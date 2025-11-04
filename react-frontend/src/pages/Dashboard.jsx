import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { fetchUserContext, createStream, upvoteStream } from '@/lib/api';

// Replace Next.js Image component with standard img tag
const Image = ({ src, alt, width, height, className }) => (
  <img 
    src={src} 
    alt={alt} 
    width={width} 
    height={height} 
    className={className}
  />
);

// Mock data for videos
const mockVideos = [
  { id: '1', extractedId: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', votes: 5, thumbnailSml: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg' },
  { id: '2', extractedId: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', votes: 4, thumbnailSml: 'https://img.youtube.com/vi/kJQP7kiw5Fk/default.jpg' },
  { id: '3', extractedId: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', votes: 2, thumbnailSml: 'https://img.youtube.com/vi/JGwWNGJdvx8/default.jpg' },
];

export default function Dashboard({ user }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoQueue, setVideoQueue] = useState(mockVideos);
  const [currentVideo, setCurrentVideo] = useState({
    extractedId: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    votes: 0,
    thumbnailSml: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg'
  });

  const REFRESH_INTERVAL_MS = 10 * 1000;

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await fetchUserContext();
        console.log('User details:', userDetails);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  // Refresh streams
  useEffect(() => {
    const refreshStreams = async () => {
      try {
        // In a real app, this would call your backend API
        // const response = await fetch('/api/streams/my');
        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        console.error('Failed to refresh streams:', error);
      }
    };

    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const addVideo = async () => {
    if (!videoUrl.trim()) {
      console.log("Please enter a valid URL");
      return;
    }

    try {
      const userDetails = await fetchUserContext();
      
      const streamData = {
        creatorId: userDetails.id,
        url: videoUrl
      };
      
      const result = await createStream(streamData);
      
      // Simulate API response
      const newVideo = {
        id: result.id || Date.now().toString(),
        extractedId: extractVideoId(videoUrl) || "default",
        title: result.title || "New Video",
        votes: 0,
        thumbnailSml: result.thumbnailSml || `https://img.youtube.com/vi/${extractVideoId(videoUrl) || "default"}/default.jpg`
      };

      setVideoQueue(prevQueue => [...prevQueue, newVideo]);
      setVideoUrl('');
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const vote = async (index, amount) => {
    try {
      const streamId = videoQueue[index].id;
      const result = await upvoteStream(streamId);
      
      // Update the UI based on the response
      setVideoQueue(prevQueue => {
        const newQueue = [...prevQueue];
        newQueue[index] = {
          ...newQueue[index],
          votes: result.message === "Removing the upvote" 
            ? newQueue[index].votes - amount 
            : newQueue[index].votes + amount
        };
        return newQueue.sort((a, b) => b.votes - a.votes);
      });
    } catch (error) {
      console.error("Error during voting:", error);
    }
  };

  const removeVideo = (index) => {
    setVideoQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
  };

  const playNext = () => {
    setVideoQueue(prevQueue => {
      if (prevQueue.length > 0) {
        setCurrentVideo(prevQueue[0]);
        return prevQueue.slice(1);
      }
      return prevQueue;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Song Voting Queue</h1>
        <Button size="lg" className="custom-button">Get Started</Button>
        
        {/* Currently playing video */}
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideo.extractedId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Currently playing video"
            ></iframe>
          </div>
          <h2 className="text-xl font-semibold text-center">{currentVideo.title}</h2>
          <Button onClick={playNext} size="lg" className="custom-button w-full">
            Play Next Song
          </Button>
        </div>

        {/* Input for new video */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Add a new video</h2>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter YouTube URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                aria-label="YouTube URL input"
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-400"
              />
              <Button onClick={addVideo} size="lg" className="custom-button">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Video queue */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Upcoming Videos</h2>
            <ul className="space-y-4">
              {videoQueue.map((video, index) => (
                <li key={video.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                  <div className="flex items-center space-x-4">
                    {video.thumbnailSml && (
                      <Image
                        src={video.thumbnailSml}
                        alt={`Thumbnail for ${video.title}`}
                        width={120}
                        height={90}
                        className="rounded"
                      />
                    )}
                    <span className="font-medium">{video.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{video.votes} votes</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => vote(index, 1)}
                      aria-label={`Upvote ${video.title}`}
                      className="custom-button-outline"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => vote(index, -1)}
                      aria-label={`Downvote ${video.title}`}
                      className="custom-button-outline"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => removeVideo(index)}
                      aria-label={`Remove ${video.title} from queue`}
                      className="custom-button-outline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}