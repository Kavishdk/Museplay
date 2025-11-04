import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Music } from 'lucide-react';

export function Appbar({ user, setUser }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // In a real app, this would call your backend API to logout
    setUser(null);
    navigate('/');
  };

  const handleLogin = () => {
    // In a real app, this would redirect to your login page or open a login modal
    navigate('/login');
  };

  return (
    <div className="flex items-center h-14 px-4 bg-gray-900">
      <Link to="/" className="flex items-center justify-center">
        <Music className="h-6 w-6 text-purple-400" />
        <span className="ml-2 text-2xl font-bold text-purple-400">MusePlay</span>
      </Link>
      <nav className="flex items-center gap-4 sm:gap-6 ml-auto">
        <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" to="/#features">
          Features
        </Link>
        <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" to="/#how-it-works">
          How It Works
        </Link>
        <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" to="/#contact">
          Contact
        </Link>
        <div>  
          {user ? (
            <Button className="custom-button" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button className="custom-button" onClick={handleLogin}>
                Sign in with Google
              </Button>
              <Button className="custom-button" onClick={handleLogin}>
                Sign in with Email
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}