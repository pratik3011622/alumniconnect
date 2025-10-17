import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Save, Briefcase, MapPin, Globe, FileText, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    batch: profile?.batch || '',
    branch: profile?.branch || '',
    profession: profile?.profession || '',
    company: profile?.company || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    linkedin_url: profile?.linkedin_url || '',
    resume_url: profile?.resume_url || '',
  });

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Not Logged In</h3>
          <p className="text-gray-600 mb-4">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('user_id', user.id);

    if (error) {
      alert('Failed to update profile');
    } else {
      await refreshProfile();
      setEditing(false);
      alert('Profile updated successfully');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name,
      batch: profile.batch || '',
      branch: profile.branch || '',
      profession: profile.profession || '',
      company: profile.company || '',
      location: profile.location || '',
      bio: profile.bio || '',
      linkedin_url: profile.linkedin_url || '',
      resume_url: profile.resume_url || '',
    });
    setEditing(false);
  };

  const batches = ['2020', '2021', '2022', '2023', '2024'];
  const branches = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>

          <div className="px-8 pb-8">
            <div className="flex justify-center -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-5xl font-bold text-blue-600">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.full_name}</h1>
              <div className="flex items-center justify-center gap-4 text-gray-600">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </span>
                {profile.role === 'alumni' && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.is_approved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {profile.is_approved ? 'Verified' : 'Pending Approval'}
                  </span>
                )}
              </div>
            </div>

            {!editing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <InfoCard icon={<Mail />} label="Email" value={profile.email} />
                  {profile.batch && <InfoCard icon={<User />} label="Batch" value={profile.batch} />}
                  {profile.branch && <InfoCard icon={<FileText />} label="Branch" value={profile.branch} />}
                  {profile.profession && <InfoCard icon={<Briefcase />} label="Profession" value={profile.profession} />}
                  {profile.company && <InfoCard icon={<Briefcase />} label="Company" value={profile.company} />}
                  {profile.location && <InfoCard icon={<MapPin />} label="Location" value={profile.location} />}
                </div>

                {profile.bio && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{profile.bio}</p>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <Globe className="w-5 h-5 mr-2" />
                      LinkedIn Profile
                    </a>
                  )}
                  {profile.resume_url && (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      View Resume
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                    <select
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Batch</option>
                      {batches.map((batch) => (
                        <option key={batch} value={batch}>
                          {batch}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Google"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
                  <input
                    type="url"
                    value={formData.resume_url}
                    onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourresume.com/resume.pdf"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center text-gray-600 mb-2">
        <span className="w-5 h-5 mr-2">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
};
