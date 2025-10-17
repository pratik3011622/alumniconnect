import React, { useEffect, useState } from 'react';
import { supabase, Profile } from '../../lib/supabase';
import { Shield, Users, Calendar, Briefcase, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'events' | 'jobs'>('users');

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 text-amber-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>

          <div className="flex gap-2">
            <TabButton
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
              icon={<Users className="w-5 h-5" />}
              label="Manage Users"
            />
            <TabButton
              active={activeTab === 'events'}
              onClick={() => setActiveTab('events')}
              icon={<Calendar className="w-5 h-5" />}
              label="Manage Events"
            />
            <TabButton
              active={activeTab === 'jobs'}
              onClick={() => setActiveTab('jobs')}
              icon={<Briefcase className="w-5 h-5" />}
              label="Manage Jobs"
            />
          </div>
        </div>

        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'events' && <EventsManagement />}
        {activeTab === 'jobs' && <JobsManagement />}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-lg transition font-medium ${
      active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const approveUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true })
      .eq('user_id', userId);

    if (!error) {
      fetchUsers();
      alert('User approved successfully');
    } else {
      alert('Failed to approve user');
    }
  };

  const rejectUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: false })
      .eq('user_id', userId);

    if (!error) {
      fetchUsers();
      alert('User approval revoked');
    } else {
      alert('Failed to update user');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  const pendingUsers = users.filter((u) => u.role === 'alumni' && !u.is_approved);
  const approvedUsers = users.filter((u) => u.is_approved || u.role !== 'alumni');

  return (
    <div className="space-y-6">
      {pendingUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-yellow-600" />
            Pending Approval ({pendingUsers.length})
          </h2>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <UserCard key={user.id} user={user} onApprove={approveUser} onReject={rejectUser} showActions />
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-green-600" />
          All Users ({approvedUsers.length})
        </h2>
        <div className="space-y-3">
          {approvedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onApprove={approveUser}
              onReject={rejectUser}
              showActions={user.role === 'alumni'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const UserCard: React.FC<{
  user: Profile;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  showActions: boolean;
}> = ({ user, onApprove, onReject, showActions }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{user.full_name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {user.role.toUpperCase()}
              </span>
              {user.batch && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Batch {user.batch}</span>
              )}
              {user.is_approved ? (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Approved</span>
              ) : (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Pending</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {showActions && (
        <div className="flex gap-2">
          {!user.is_approved ? (
            <button
              onClick={() => onApprove(user.user_id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center text-sm"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </button>
          ) : (
            <button
              onClick={() => onReject(user.user_id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center text-sm"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Revoke
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const EventsManagement: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const { error } = await supabase.from('events').delete().eq('id', eventId);

    if (!error) {
      fetchEvents();
      alert('Event deleted successfully');
    } else {
      alert('Failed to delete event');
    }
  };

  const createEvent = async (eventData: any) => {
    const { error } = await supabase.from('events').insert({
      ...eventData,
      created_by: user?.id,
    });

    if (!error) {
      fetchEvents();
      setShowForm(false);
      alert('Event created successfully');
    } else {
      alert('Failed to create event');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-green-600" />
            Events ({events.length})
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Event
          </button>
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                    <span>{event.location}</span>
                    <span>
                      {event.registration_count} / {event.capacity || '∞'} registered
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && <EventForm onClose={() => setShowForm(false)} onSubmit={createEvent} />}
    </div>
  );
};

const EventForm: React.FC<{ onClose: () => void; onSubmit: (data: any) => void }> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    capacity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JobsManagement: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setJobs(data);
    }
    setLoading(false);
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    const { error } = await supabase.from('jobs').delete().eq('id', jobId);

    if (!error) {
      fetchJobs();
      alert('Job deleted successfully');
    } else {
      alert('Failed to delete job');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Briefcase className="w-6 h-6 mr-2 text-amber-600" />
        Jobs ({jobs.length})
      </h2>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {job.company} • {job.location}
                </p>
                <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {job.type.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => deleteJob(job.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
