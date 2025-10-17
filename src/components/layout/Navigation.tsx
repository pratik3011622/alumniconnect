import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Users, Calendar, Briefcase, User, LogOut, Menu, X, Shield } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onAuthClick: (type: 'login' | 'signup') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, onAuthClick }) => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'directory', label: 'Alumni Directory', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'about', label: 'About', icon: null },
    { id: 'contact', label: 'Contact', icon: null },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">AlumniConnect</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === item.id
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user && profile ? (
              <>
                {profile.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </button>
                )}
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onAuthClick('login')}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => onAuthClick('signup')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  currentPage === item.id
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user && profile ? (
              <>
                {profile.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onAuthClick('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onAuthClick('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
