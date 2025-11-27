import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Trash2, ArrowLeft } from 'lucide-react';
import { fetchUserContext, createStream, upvoteStream, fetchStreams, deleteStream, fetchRoomDetails } from '@/lib/api';
import { io } from 'socket.io-client';

// Simple img wrapper (replaces Next.js Image)
const Image = ({ src, alt, width, height, className }) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
);

export default function Dashboard({ user }) {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoQueue, setVideoQueue] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const currentVideoRef = useRef(null);
    const socketRef = useRef(null);

    // Keep ref in sync with state
    useEffect(() => {
        currentVideoRef.current = currentVideo;
    }, [currentVideo]);

    // Load data on mount
    useEffect(() => {
        if (!roomId) return;

        const loadData = async () => {
            try {
                // Fetch room details
                const room = await fetchRoomDetails(roomId);
                setRoomName(room.name);

                const userDetails = await fetchUserContext();
                console.log('User details:', userDetails);
                const streams = await fetchStreams(roomId);
                setVideoQueue(streams);
                if (streams.length > 0) {
                    setCurrentVideo(streams[0]);
                    setVideoQueue(prev => prev.slice(1));
                }
            } catch (err) {
                console.error('Error loading dashboard data:', err);
                // navigate('/dashboard'); // Redirect to lobby if room fails?
            }
        };
        loadData();

        // Initialize Socket.IO client
        socketRef.current = io('http://localhost:3001');
        const socket = socketRef.current;

        // Join the specific room
        socket.emit('joinRoom', roomId);

        // Stream added
        socket.on('streamAdded', (payload) => {
            console.log('streamAdded', payload);
            if (payload.roomId !== roomId) return; // Safety check

            setVideoQueue(prev => {
                // If nothing is playing, set as current
                if (!currentVideoRef.current) {
                    setCurrentVideo(payload);
                    return prev;
                }
                return [...prev, payload];
            });
        });

        // Stream updated (votes)
        socket.on('streamUpdated', (payload) => {
            console.log('streamUpdated', payload);
            if (payload.roomId !== roomId) return;

            const { streamId, votes } = payload;
            setVideoQueue(prev => {
                const updated = prev.map(v => v.id === streamId ? { ...v, votes } : v);
                return updated.sort((a, b) => b.votes - a.votes);
            });
            if (currentVideoRef.current && currentVideoRef.current.id === streamId) {
                setCurrentVideo(prev => ({ ...prev, votes }));
            }
        });

        // Stream deleted
        socket.on('streamDeleted', ({ id, roomId: eventRoomId }) => {
            console.log('streamDeleted', id);
            if (eventRoomId !== roomId) return;

            setVideoQueue(prev => prev.filter(v => v.id !== id));
            if (currentVideoRef.current && currentVideoRef.current.id === id) {
                // Move to next video if available
                setCurrentVideo(null);
                setTimeout(() => {
                    setVideoQueue(q => {
                        if (q.length > 0) {
                            setCurrentVideo(q[0]);
                            return q.slice(1);
                        }
                        return q;
                    });
                }, 0);
            }
        });

        // Cleanup on unmount
        return () => {
            if (socket) socket.disconnect();
        };
    }, [roomId]);

    // Add a new video to the queue
    const addVideo = async () => {
        if (!videoUrl.trim()) return;
        try {
            await createStream(videoUrl, roomId);
            // Socket will handle the update
            setVideoUrl('');
        } catch (err) {
            console.error('Error adding video:', err);
        }
    };

    // Voting handler (upvote = 1, downvote = -1)
    const vote = async (index, amount) => {
        try {
            const streamId = videoQueue[index].id;
            await upvoteStream(streamId);
            // Socket will handle the update
        } catch (err) {
            console.error('Error voting:', err);
        }
    };

    const removeVideo = async (index) => {
        try {
            const streamId = videoQueue[index].id;
            await deleteStream(streamId);
        } catch (err) {
            console.error('Error deleting video:', err);
        }
    };

    const playNext = () => {
        if (videoQueue.length === 0) return;
        setCurrentVideo(videoQueue[0]);
        setVideoQueue(prev => prev.slice(1));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
            <div className="container mx-auto p-4 space-y-6 max-w-4xl">
                <div className="flex items-center mb-8">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4 text-gray-400 hover:text-white">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-fade-in">
                            {roomName || 'Loading...'}
                        </h1>
                        <p className="text-sm text-gray-500">Room ID: {roomId}</p>
                    </div>
                </div>

                {/* Currently playing video */}
                {currentVideo && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Currently playing video"
                            />
                        </div>
                        <div className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-purple-300 truncate flex-1 mr-4">{currentVideo.title}</h2>
                            <Button onClick={playNext} size="lg" className="custom-button shrink-0">
                                Play Next Song
                            </Button>
                        </div>
                    </div>
                )}

                {/* Add video form */}
                <Card className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Add a New Song</h2>
                        <div className="flex space-x-3">
                            <Input
                                type="text"
                                placeholder="Paste YouTube URL here..."
                                value={videoUrl}
                                onChange={e => setVideoUrl(e.target.value)}
                                className="bg-gray-900/50 text-gray-100 border-gray-600 focus:border-purple-500 h-12"
                            />
                            <Button onClick={addVideo} size="lg" className="custom-button h-12 px-8">
                                Add
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Queue list */}
                <Card className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Upcoming Songs</h2>
                        {videoQueue.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No songs in queue. Add one to get started!
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {videoQueue.map((video, index) => (
                                    <li key={video.id} className="flex items-center justify-between bg-gray-800/40 p-3 rounded-lg border border-white/5 hover:bg-gray-800/60 transition-colors group">
                                        <div className="flex items-center space-x-4 overflow-hidden">
                                            <div className="relative shrink-0">
                                                {video.thumbnailSml && (
                                                    <Image src={video.thumbnailSml} alt={video.title} width={120} height={68} className="rounded-md object-cover" />
                                                )}
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                            </div>
                                            <span className="font-medium text-gray-200 truncate">{video.title}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 shrink-0 ml-4">
                                            <div className="flex flex-col items-center mr-2">
                                                <span className="text-xs text-gray-400 uppercase tracking-wider">Votes</span>
                                                <span className="text-lg font-bold text-purple-400">{video.votes}</span>
                                            </div>
                                            <Button size="icon" variant="ghost" onClick={() => vote(index, 1)} className="hover:bg-purple-500/20 hover:text-purple-300 text-gray-400">
                                                <ThumbsUp className="h-5 w-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => vote(index, -1)} className="hover:bg-red-500/20 hover:text-red-300 text-gray-400">
                                                <ThumbsDown className="h-5 w-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => removeVideo(index)} className="hover:bg-red-500/20 hover:text-red-300 text-gray-400">
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
