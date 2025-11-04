import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, this would call your backend API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // const userData = await response.json();
      
      // Simulate successful login
      const userData = {
        id: '1',
        email: email,
        name: 'Test User'
      };
      
      setUser(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleGoogleLogin = () => {
    // In a real app, this would redirect to Google OAuth
    console.log('Google login');
  };

  const handleEmailLogin = () => {
    // In a real app, this would send a magic link to the email
    console.log('Email login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-400">
            {isLogin ? 'Sign In to MusePlay' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {isLogin ? 'Enter your credentials to continue' : 'Create an account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-purple-400"
                required
              />
            </div>
            {isLogin && (
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600 focus:border-purple-400"
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full custom-button">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full custom-button"
              variant="outline"
            >
              Sign in with Google
            </Button>
            <Button 
              onClick={handleEmailLogin} 
              className="w-full custom-button"
              variant="outline"
            >
              Sign in with Email
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}