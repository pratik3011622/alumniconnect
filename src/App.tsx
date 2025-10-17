import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navigation } from './components/layout/Navigation';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { Home } from './components/pages/Home';
import { AlumniDirectory } from './components/pages/AlumniDirectory';
import { Events } from './components/pages/Events';
import { Jobs } from './components/pages/Jobs';
import { Profile } from './components/pages/Profile';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { About } from './components/pages/About';
import { Contact } from './components/pages/Contact';

type Page = 'home' | 'directory' | 'events' | 'jobs' | 'profile' | 'admin' | 'about' | 'contact';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAuth, setShowAuth] = useState<'login' | 'signup' | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleAuthClick = (type: 'login' | 'signup') => {
    setShowAuth(type);
  };

  const handleCloseAuth = () => {
    setShowAuth(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onAuthClick={handleAuthClick} />;
      case 'directory':
        return <AlumniDirectory onNavigate={handleNavigate} />;
      case 'events':
        return <Events onNavigate={handleNavigate} />;
      case 'jobs':
        return <Jobs onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={handleNavigate} onAuthClick={handleAuthClick} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} onAuthClick={handleAuthClick} />
        {renderPage()}

        {showAuth === 'login' && (
          <Login
            onClose={handleCloseAuth}
            onSwitchToSignup={() => setShowAuth('signup')}
          />
        )}

        {showAuth === 'signup' && (
          <Signup
            onClose={handleCloseAuth}
            onSwitchToLogin={() => setShowAuth('login')}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
