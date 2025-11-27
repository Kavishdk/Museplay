import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Music } from 'lucide-react';
import { logout } from '@/lib/api';

export function Appbar({ user, setUser }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    setUser(null);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center h-16 px-6 bg-gray-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
      <Link to="/" className="flex items-center justify-center group">
        <div className="p-2 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
          <Music className="h-6 w-6 text-purple-400" />
        </div>
        <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          MusePlay
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">
              {user.email}
            </span>
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            className="custom-button shadow-lg shadow-purple-500/20"
            onClick={handleLogin}
          >
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
}