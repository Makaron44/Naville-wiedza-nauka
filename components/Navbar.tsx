
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { testConnection } from '../services/geminiService';
import { AppSettings } from '../types';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'invalid' | 'offline'>('offline');

  useEffect(() => {
    let isMounted = true;
    const checkApiStatus = async () => {
      const saved = localStorage.getItem('neville_app_settings');
      let apiKey = '';
      if (saved) {
        try {
          const settings: AppSettings = JSON.parse(saved);
          apiKey = settings.apiKey || '';
        } catch (e) {
          console.error("Error parsing settings for API key in Navbar", e);
        }
      }

      if (!apiKey) {
        if (isMounted) setApiStatus('offline');
        return;
      }

      if (isMounted) setApiStatus('checking');
      const result = await testConnection(apiKey);
      if (isMounted) {
        setApiStatus(result.success ? 'connected' : 'invalid');
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 10000); // Check every 10 seconds
    
    // Listen for storage changes (in case settings are updated from Settings page)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'neville_app_settings') {
        checkApiStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  const navLinks = [
    { name: 'Główna', path: '/', icon: '🏠', isHash: false },
    { name: 'Wiedza', path: 'wiedza', icon: '✨', isHash: true },
    { name: 'Praktyki', path: 'praktyka', icon: '🌙', isHash: true },
    { name: 'Wdzięczność', path: '/gratitude', icon: '🙏', isHash: false },
    { name: 'Notatki', path: '/notes', icon: '📝', isHash: false },
    { name: 'Mentor AI', path: '/mentor', icon: '💬', isHash: false },
    { name: 'Ustawienia', path: '/settings', icon: '👤', isHash: false },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    document.body.style.overflow = newState ? 'hidden' : 'auto';
  };

  const handleHashClick = (id: string) => {
    closeMenu();
    // We let React Router handle the URL update. 
    // The Home component in App.tsx has a useEffect that watches for hash changes and scrolls.
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/10 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-amber-200 serif group-hover:text-amber-100 transition-colors">Neville.PL</span>
            <div className="flex items-center ml-2 space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'connected' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : apiStatus === 'invalid' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : apiStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-[8px] text-gray-500 uppercase tracking-tighter hidden sm:inline">
                {apiStatus === 'connected' ? 'Connected' : apiStatus === 'invalid' ? 'Invalid Key' : apiStatus === 'checking' ? 'Checking...' : 'Offline'}
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              link.isHash ? (
                <Link 
                  key={link.path}
                  to={{ pathname: '/', hash: `#${link.path}` }}
                  onClick={() => handleHashClick(link.path)}
                  className="hover:text-amber-200 transition text-sm font-medium flex items-center space-x-1.5"
                >
                  <span className="text-lg opacity-80">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ) : (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`hover:text-amber-200 transition text-sm font-medium flex items-center space-x-1.5 ${
                    location.pathname === link.path ? 'text-amber-200 font-semibold underline underline-offset-4 decoration-amber-500/50' : ''
                  }`}
                >
                  <span className="text-lg opacity-80">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              )
            ))}
          </div>

          <button 
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none z-[110]"
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-amber-200 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-amber-200 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-amber-200 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 glass border-b border-white/10 transition-all duration-500 ease-in-out overflow-hidden z-[100] ${
            isMenuOpen ? 'max-h-[600px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
          }`}
        >
          <div className="flex flex-col space-y-2 px-6">
            {navLinks.map((link) => (
              link.isHash ? (
                <Link 
                  key={link.path}
                  to={{ pathname: '/', hash: `#${link.path}` }}
                  onClick={() => handleHashClick(link.path)}
                  className="text-lg font-medium text-amber-100 hover:text-amber-200 transition py-3 border-b border-white/5 flex items-center space-x-3 active:bg-white/5 rounded-lg px-2"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ) : (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={closeMenu}
                  className={`text-lg font-medium py-3 border-b border-white/5 transition flex items-center space-x-3 active:bg-white/5 rounded-lg px-2 ${
                    location.pathname === link.path ? 'text-amber-200 bg-white/5' : 'text-amber-100 hover:text-amber-200'
                  }`}
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[90]" 
          onClick={closeMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;
