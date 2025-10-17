import React from 'react';
import { GraduationCap, Target, Heart, Users, Globe, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GraduationCap className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">About AlumniConnect</h1>
          <p className="text-xl text-blue-100">
            Building bridges between past, present, and future generations of excellence
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              AlumniConnect was founded with a simple yet powerful vision: to create a thriving ecosystem where
              alumni, current students, and future leaders can connect, collaborate, and grow together.
            </p>
            <p className="mb-4">
              As graduates spread across the globe, pursuing diverse careers and making their mark in various
              industries, we recognized the need for a platform that keeps our community united. AlumniConnect
              serves as the digital home for our extended university family, fostering meaningful connections
              that transcend time and distance.
            </p>
            <p>
              Today, we're proud to serve thousands of alumni and students, facilitating career opportunities,
              mentorship relationships, and lifelong friendships that continue to strengthen our community.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Mission & Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <ValueCard
            icon={<Target className="w-12 h-12 text-blue-600" />}
            title="Our Mission"
            description="To create a vibrant, supportive network that empowers alumni and students to achieve their professional and personal goals through meaningful connections."
          />
          <ValueCard
            icon={<Heart className="w-12 h-12 text-red-600" />}
            title="Community First"
            description="We believe in the power of community. Every feature we build is designed to bring people together and foster genuine relationships."
          />
          <ValueCard
            icon={<Users className="w-12 h-12 text-green-600" />}
            title="Inclusivity"
            description="Our platform welcomes all alumni and students, regardless of their background, batch, or branch, creating a truly diverse network."
          />
          <ValueCard
            icon={<Globe className="w-12 h-12 text-amber-600" />}
            title="Global Reach"
            description="With members across continents and industries, we provide a global perspective and opportunities that span borders."
          />
          <ValueCard
            icon={<Award className="w-12 h-12 text-purple-600" />}
            title="Excellence"
            description="We maintain high standards in everything we do, from the quality of our platform to the caliber of opportunities we facilitate."
          />
          <ValueCard
            icon={<GraduationCap className="w-12 h-12 text-teal-600" />}
            title="Lifelong Learning"
            description="Education doesn't end at graduation. We promote continuous learning and knowledge sharing among our community members."
          />
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-xl text-blue-100 mb-6">
            Be part of a network that's shaping the future, one connection at a time
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <StatCard number="5,000+" label="Active Alumni" />
            <StatCard number="2,000+" label="Current Students" />
            <StatCard number="50+" label="Countries" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-blue-100">{label}</div>
    </div>
  );
};
