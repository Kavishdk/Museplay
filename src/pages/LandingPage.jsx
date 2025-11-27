import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = () => {
    if (roomCode.trim()) {
      navigate(`/room/${roomCode}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-6xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              MusePlay
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            The ultimate collaborative music streaming experience. Create rooms, vote on songs, and listen together in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center min-h-[80px]">
            {showJoinInput ? (
              <div className="flex w-full max-w-sm items-center space-x-2 animate-fade-in">
                <Input
                  type="text"
                  placeholder="Enter Room Code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-500"
                />
                <Button onClick={handleJoin} className="custom-button">
                  Join
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowJoinInput(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/signup')}
                  size="lg"
                  className="custom-button text-lg px-8 py-6 w-full sm:w-auto"
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => setShowJoinInput(true)}
                  variant="outline"
                  size="lg"
                  className="custom-button-outline text-lg px-8 py-6 w-full sm:w-auto"
                >
                  Join a Room
                </Button>
              </>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Real-time Voting</h3>
              <p className="text-gray-400">Upvote your favorite tracks to push them to the top of the queue.</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Live Sync</h3>
              <p className="text-gray-400">Listen together with friends, perfectly synchronized across all devices.</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Easy Sharing</h3>
              <p className="text-gray-400">Just paste a YouTube link to add any song to the playlist instantly.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MusePlay. All rights reserved.
      </footer>
    </div>
  );
}