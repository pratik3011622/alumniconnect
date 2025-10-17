import React, { useEffect, useState } from 'react';
import { supabase, Profile } from '../../lib/supabase';
import { Briefcase, MapPin, DollarSign, X, Plus, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  type: 'job' | 'internship';
  location: string;
  salary_range?: string;
  requirements?: string;
  posted_by: string;
  is_active: boolean;
  created_at: string;
}

interface JobsProps {
  onNavigate: (page: string) => void;
}

export const Jobs: React.FC<JobsProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'job' | 'internship'>('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setJobs(data);
    }
    setLoading(false);
  };

  const filteredJobs = filterType === 'all' ? jobs : jobs.filter((job) => job.type === filterType);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Job Board</h1>
                <p className="text-gray-600 mt-1">Opportunities shared by our alumni network</p>
              </div>
            </div>
            {user && profile?.role === 'alumni' && (
              <button
                onClick={() => setShowJobForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post Job
              </button>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({jobs.length})
            </button>
            <button
              onClick={() => setFilterType('job')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'job'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Jobs ({jobs.filter((j) => j.type === 'job').length})
            </button>
            <button
              onClick={() => setFilterType('internship')}
              className={`px-4 py-2 rounded-lg transition ${
                filterType === 'internship'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Internships ({jobs.filter((j) => j.type === 'internship').length})
            </button>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs available</h3>
            <p className="text-gray-600">Check back later for new opportunities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onRefresh={fetchJobs} />
            ))}
          </div>
        )}

        {showJobForm && (
          <JobForm
            onClose={() => setShowJobForm(false)}
            onSuccess={() => {
              setShowJobForm(false);
              fetchJobs();
            }}
          />
        )}
      </div>
    </div>
  );
};

interface JobCardProps {
  job: Job;
  onRefresh: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();

  const applyForJob = async () => {
    if (!user) {
      alert('Please login to apply for jobs');
      return;
    }

    const { error } = await supabase.from('job_applications').insert({
      job_id: job.id,
      applicant_id: user.id,
    });

    if (error) {
      if (error.code === '23505') {
        alert('You have already applied for this job');
      } else {
        alert('Failed to apply for job');
      }
    } else {
      alert('Application submitted successfully');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.type === 'job'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {job.type === 'job' ? 'Full-time' : 'Internship'}
              </span>
            </div>
            <p className="text-lg text-gray-700 flex items-center mb-2">
              <Building2 className="w-5 h-5 mr-2" />
              {job.company}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{job.location}</p>
          </div>
          {job.salary_range && (
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 flex-shrink-0" />
              <p>{job.salary_range}</p>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(true)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View Details
          </button>
          <button
            onClick={applyForJob}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Apply
          </button>
        </div>
      </div>

      {showDetails && (
        <JobDetailsModal job={job} onClose={() => setShowDetails(false)} onApply={applyForJob} />
      )}
    </>
  );
};

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onApply: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onApply }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
            <p className="text-xl text-blue-100">{job.company}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:text-blue-600 rounded-full p-2 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
              job.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
              {job.type === 'job' ? 'Full-time Position' : 'Internship'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>
            {job.salary_range && (
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-5 h-5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Salary Range</p>
                  <p className="font-medium">{job.salary_range}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
              <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Apply for this Position
          </button>
        </div>
      </div>
    </div>
  );
};

interface JobFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    type: 'job' as 'job' | 'internship',
    location: '',
    salary_range: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('jobs').insert({
      ...formData,
      posted_by: user?.id,
      is_active: true,
    });

    if (error) {
      alert('Failed to post job');
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-blue-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Post a Job</h2>
          <button onClick={onClose} className="text-white hover:bg-white hover:text-blue-600 rounded-full p-2 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'job' | 'internship' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="job">Full-time Job</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range (Optional)</label>
            <input
              type="text"
              value={formData.salary_range}
              onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., $80,000 - $120,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (Optional)</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};
