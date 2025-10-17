import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  capacity: number;
  registration_count: number;
  image_url?: string;
  created_at: string;
}

interface EventsProps {
  onNavigate: (page: string) => void;
}

export const Events: React.FC<EventsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const fetchUserRegistrations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', user.id);

    if (!error && data) {
      setRegisteredEvents(new Set(data.map((r) => r.event_id)));
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) {
      alert('Please login to register for events');
      return;
    }

    const { error } = await supabase.from('event_registrations').insert({
      event_id: eventId,
      user_id: user.id,
    });

    if (error) {
      if (error.code === '23505') {
        alert('You are already registered for this event');
      } else {
        alert('Failed to register for event');
      }
    } else {
      const { error: updateError } = await supabase.rpc('increment', {
        table_name: 'events',
        row_id: eventId,
        column_name: 'registration_count'
      });

      alert('Successfully registered for event');
      fetchEvents();
      fetchUserRegistrations();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Upcoming Events</h1>
              <p className="text-gray-600 mt-1">Join alumni gatherings, webinars, and networking sessions</p>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No upcoming events</h3>
            <p className="text-gray-600">Check back later for new events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={registeredEvents.has(event.id)}
                onRegister={() => registerForEvent(event.id)}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  onRegister: () => void;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}

const EventCard: React.FC<EventCardProps> = ({ event, isRegistered, onRegister, formatDate, formatTime }) => {
  const spotsLeft = event.capacity - event.registration_count;
  const isFullyBooked = spotsLeft <= 0 && event.capacity > 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-48 flex items-center justify-center text-white">
        <Calendar className="w-20 h-20" />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{event.title}</h3>

        <div className="space-y-2 mb-4 text-gray-600">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{formatDate(event.event_date)}</p>
              <p className="text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(event.event_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
            <p>{event.location}</p>
          </div>

          {event.capacity > 0 && (
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3 flex-shrink-0" />
              <p>
                {event.registration_count} / {event.capacity} registered
                {!isFullyBooked && spotsLeft <= 10 && (
                  <span className="text-amber-600 ml-2 font-medium">
                    ({spotsLeft} spots left)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6 line-clamp-3">{event.description}</p>

        {isRegistered ? (
          <div className="flex items-center justify-center px-6 py-3 bg-green-50 text-green-700 rounded-lg font-medium">
            <CheckCircle className="w-5 h-5 mr-2" />
            Registered
          </div>
        ) : (
          <button
            onClick={onRegister}
            disabled={isFullyBooked}
            className={`w-full px-6 py-3 rounded-lg font-medium transition ${
              isFullyBooked
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFullyBooked ? 'Fully Booked' : 'Register Now'}
          </button>
        )}
      </div>
    </div>
  );
};
