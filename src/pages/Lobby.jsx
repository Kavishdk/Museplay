import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { fetchRooms, createRoom } from '@/lib/api';
import { Plus, Users, ArrowRight } from 'lucide-react';

export default function Lobby({ user }) {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await fetchRooms();
            setRooms(data);
        } catch (error) {
            console.error('Error loading rooms:', error);
        }
    };

    const handleCreateRoom = async () => {
        if (!newRoomName.trim()) return;
        try {
            setIsCreating(true);
            const room = await createRoom(newRoomName);
            setNewRoomName('');
            loadRooms();
            // Optionally redirect immediately
            // navigate(`/room/${room.id}`);
        } catch (error) {
            console.error('Error creating room:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const joinRoom = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6">
            <div className="max-w-4xl mx-auto w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Music Rooms
                    </h1>
                    <p className="text-gray-400">Join an existing room or create your own vibe.</p>
                </div>

                {/* Create Room Section */}
                <Card className="glass-card">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
                            <Plus className="mr-2 h-5 w-5 text-purple-400" />
                            Create New Room
                        </h2>
                        <div className="flex gap-4">
                            <Input
                                placeholder="Room Name (e.g. Chill Vibes)"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                className="bg-gray-900/50 border-gray-600 text-white focus:border-purple-500"
                            />
                            <Button
                                onClick={handleCreateRoom}
                                disabled={isCreating || !newRoomName.trim()}
                                className="custom-button min-w-[120px]"
                            >
                                {isCreating ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Rooms List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rooms.map((room) => (
                        <Card
                            key={room.id}
                            className="glass-card hover:bg-gray-800/60 transition-colors cursor-pointer group"
                            onClick={() => joinRoom(room.id)}
                        >
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-200 group-hover:text-purple-400 transition-colors">
                                        {room.name}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-400 mt-2">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>{room._count?.streams || 0} songs queued</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        ID: {room.id}
                                    </p>
                                </div>
                                <ArrowRight className="h-6 w-6 text-gray-600 group-hover:text-purple-400 transition-colors" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {rooms.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        No rooms found. Be the first to create one!
                    </div>
                )}
            </div>
        </div>
    );
}
