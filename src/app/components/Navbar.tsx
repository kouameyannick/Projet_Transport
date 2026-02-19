import { Link, useLocation } from 'react-router';
import { MapPin, Hotel, Car, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Itinéraires', icon: MapPin },
    { path: '/hotels', label: 'Hôtels', icon: Hotel },
    { path: '/location-voiture', label: 'Location de voiture', icon: Car },
  ];

  return (
    // <nav className="bg-gradient-to-r from-orange-500 to-green-600 shadow-lg sticky top-0 z-50">
    <nav className="bg-orange-500 to-green-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white rounded-full p-2">
              <MapPin className="h-6 w-6 text-[#FF6B35]" />
            </div>
            <span className="text-white text-xl font-bold hidden sm:block">
              Abidjan Route
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-white text-[#FF6B35]'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/connexion"
              className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="bg-white text-[#FF6B35] px-4 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-2"
            >
              <User className="h-5 w-5" />
              <span>S'inscrire</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-white text-[#FF6B35]'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-white/20 my-2 pt-2 space-y-2">
              <Link
                to="/connexion"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white hover:bg-white/20 px-4 py-3 rounded-lg transition-all"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 bg-white text-[#FF6B35] px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
              >
                <User className="h-5 w-5" />
                <span>S'inscrire</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
