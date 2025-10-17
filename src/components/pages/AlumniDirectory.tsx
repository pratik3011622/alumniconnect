import React, { useEffect, useState } from 'react';
import { supabase, Profile } from '../../lib/supabase';
import { Search, MapPin, Briefcase, Users, Mail, UserPlus, X, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AlumniDirectoryProps {
  onNavigate: (page: string) => void;
}

export const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [alumni, setAlumni] = useState<Profile[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<Profile | null>(null);

  const batches = ['2020', '2021', '2022', '2023', '2024'];
  const branches = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics'];

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    filterAlumniList();
  }, [searchTerm, filterBatch, filterBranch, alumni]);

  const fetchAlumni = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'alumni')
      .eq('is_approved', true)
      .order('full_name', { ascending: true });

    if (!error && data) {
      setAlumni(data);
    }
    setLoading(false);
  };

  const filterAlumniList = () => {
    let filtered = alumni;

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.profession?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBatch) {
      filtered = filtered.filter((a) => a.batch === filterBatch);
    }

    if (filterBranch) {
      filtered = filtered.filter((a) => a.branch === filterBranch);
    }

    setFilteredAlumni(filtered);
  };

  const sendConnectionRequest = async (receiverId: string) => {
    if (!user) {
      alert('Please login to send connection requests');
      return;
    }

    const { error } = await supabase.from('connection_requests').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      status: 'pending',
    });

    if (error) {
      if (error.code === '23505') {
        alert('Connection request already sent');
      } else {
        alert('Failed to send connection request');
      }
    } else {
      alert('Connection request sent successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading alumni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Alumni Directory</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, company, or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Batches</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  Batch {batch}
                </option>
              ))}
            </select>

            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <p className="text-gray-600">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </p>
        </div>

        {filteredAlumni.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No alumni found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumnus) => (
              <AlumniCard
                key={alumnus.id}
                alumnus={alumnus}
                onViewProfile={() => setSelectedAlumni(alumnus)}
                onConnect={() => sendConnectionRequest(alumnus.user_id)}
                isOwnProfile={user?.id === alumnus.user_id}
              />
            ))}
          </div>
        )}

        {selectedAlumni && (
          <AlumniDetailModal
            alumnus={selectedAlumni}
            onClose={() => setSelectedAlumni(null)}
            onConnect={() => sendConnectionRequest(selectedAlumni.user_id)}
            isOwnProfile={user?.id === selectedAlumni.user_id}
          />
        )}
      </div>
    </div>
  );
};

interface AlumniCardProps {
  alumnus: Profile;
  onViewProfile: () => void;
  onConnect: () => void;
  isOwnProfile: boolean;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumnus, onViewProfile, onConnect, isOwnProfile }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-24"></div>
      <div className="px-6 pb-6">
        <div className="flex justify-center -mt-12 mb-4">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-blue-600">
            {alumnus.full_name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{alumnus.full_name}</h3>
          {alumnus.profession && (
            <p className="text-sm text-gray-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4 mr-1" />
              {alumnus.profession}
            </p>
          )}
          {alumnus.company && (
            <p className="text-sm text-gray-600 flex items-center justify-center mt-1">
              <Building2 className="w-4 h-4 mr-1" />
              {alumnus.company}
            </p>
          )}
        </div>
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          {alumnus.batch && (
            <p>
              <span className="font-medium">Batch:</span> {alumnus.batch}
            </p>
          )}
          {alumnus.branch && (
            <p>
              <span className="font-medium">Branch:</span> {alumnus.branch}
            </p>
          )}
          {alumnus.location && (
            <p className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {alumnus.location}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onViewProfile}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            View Profile
          </button>
          {!isOwnProfile && (
            <button
              onClick={onConnect}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface AlumniDetailModalProps {
  alumnus: Profile;
  onClose: () => void;
  onConnect: () => void;
  isOwnProfile: boolean;
}

const AlumniDetailModal: React.FC<AlumniDetailModalProps> = ({ alumnus, onClose, onConnect, isOwnProfile }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-32 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:text-blue-600 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-8 pb-8">
          <div className="flex justify-center -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-5xl font-bold text-blue-600">
              {alumnus.full_name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{alumnus.full_name}</h2>
            {alumnus.profession && (
              <p className="text-lg text-gray-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5 mr-2" />
                {alumnus.profession} at {alumnus.company}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {alumnus.batch && (
              <InfoItem label="Batch" value={alumnus.batch} />
            )}
            {alumnus.branch && (
              <InfoItem label="Branch" value={alumnus.branch} />
            )}
            {alumnus.location && (
              <InfoItem label="Location" value={alumnus.location} icon={<MapPin className="w-4 h-4" />} />
            )}
            {alumnus.email && (
              <InfoItem label="Email" value={alumnus.email} icon={<Mail className="w-4 h-4" />} />
            )}
          </div>

          {alumnus.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
              <p className="text-gray-600">{alumnus.bio}</p>
            </div>
          )}

          {alumnus.linkedin_url && (
            <div className="mb-6">
              <a
                href={alumnus.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                View LinkedIn Profile
              </a>
            </div>
          )}

          {!isOwnProfile && (
            <div className="flex gap-4">
              <button
                onClick={onConnect}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Connect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-medium text-gray-800 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {value}
      </p>
    </div>
  );
};
