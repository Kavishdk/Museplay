import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signup({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const user = await register(email, password);
            setUser(user);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-md border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-purple-400">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Sign up to start voting on streams
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-700/50 text-white border-gray-600 focus:border-purple-400"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-700/50 text-white border-gray-600 focus:border-purple-400"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-gray-700/50 text-white border-gray-600 focus:border-purple-400"
                                required
                                disabled={loading}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full custom-button"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-400 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
