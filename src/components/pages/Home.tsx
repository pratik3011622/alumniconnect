import React from 'react';
import { Users, Calendar, Briefcase, GraduationCap, ArrowRight, UserCheck, Globe, Award } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onAuthClick: (type: 'login' | 'signup') => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onAuthClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <GraduationCap className="w-20 h-20" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to AlumniConnect
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connecting generations of excellence. Join our thriving community of alumni, students, and future leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onAuthClick('signup')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105 shadow-lg"
              >
                Join Now
              </button>
              <button
                onClick={() => onNavigate('directory')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Explore Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickLinkCard
              icon={<Users className="w-12 h-12" />}
              title="Alumni Directory"
              description="Connect with alumni from different batches and branches"
              onClick={() => onNavigate('directory')}
              color="blue"
            />
            <QuickLinkCard
              icon={<Calendar className="w-12 h-12" />}
              title="Events"
              description="Join upcoming reunions, webinars, and networking events"
              onClick={() => onNavigate('events')}
              color="green"
            />
            <QuickLinkCard
              icon={<Briefcase className="w-12 h-12" />}
              title="Job Board"
              description="Explore career opportunities shared by alumni"
              onClick={() => onNavigate('jobs')}
              color="amber"
            />
            <QuickLinkCard
              icon={<UserCheck className="w-12 h-12" />}
              title="Your Profile"
              description="Manage your profile and connect with others"
              onClick={() => onNavigate('profile')}
              color="red"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Why Join AlumniConnect?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="w-16 h-16 text-blue-600" />}
              title="Global Network"
              description="Connect with thousands of alumni across the world, building meaningful professional and personal relationships."
            />
            <FeatureCard
              icon={<Briefcase className="w-16 h-16 text-green-600" />}
              title="Career Opportunities"
              description="Access exclusive job postings and internships shared by alumni from leading companies."
            />
            <FeatureCard
              icon={<Award className="w-16 h-16 text-amber-600" />}
              title="Exclusive Events"
              description="Participate in reunions, industry talks, mentorship programs, and networking sessions."
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our community today and unlock a world of opportunities
          </p>
          <button
            onClick={() => onAuthClick('signup')}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105 shadow-lg"
          >
            Create Your Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 mr-2" />
            <span className="text-xl font-bold">AlumniConnect</span>
          </div>
          <p className="text-gray-400 mb-4">
            Building bridges between past, present, and future generations
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition">
              About
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition">
              Contact
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            © 2025 AlumniConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface QuickLinkCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({ icon, title, description, onClick, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color as keyof typeof colorClasses]} p-6 rounded-xl transition transform hover:scale-105 shadow-md hover:shadow-lg text-left`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
