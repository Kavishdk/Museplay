import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3002', // Vite's default port
  credentials: true
}));

app.use(express.json());

// Middleware to simulate authentication (in a real app, you'd use proper auth)
const authenticateUser = async (req, res, next) => {
  // For demo purposes, we'll simulate a user
  // In a real application, you would check session/cookies/JWT
  req.user = {
    id: 'demo-user-id',
    email: 'demo@example.com'
  };
  next();
};

// Get user context endpoint
app.get('/api/userContext', authenticateUser, async (req, res) => {
  try {
    // Return mock user data
    res.json({
      id: req.user.id,
      email: req.user.email,
      provider: 'demo',
    });
  } catch (error) {
    console.error('Error fetching user context:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create stream endpoint
app.post('/api/streams', authenticateUser, async (req, res) => {
  try {
    const { creatorId, url } = req.body;
    
    // Validate input
    if (!creatorId || !url) {
      return res.status(400).json({ message: 'creatorId and url are required' });
    }
    
    // Extract video ID from YouTube URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }
    
    // Return mock stream data
    const stream = {
      id: `stream-${Date.now()}`,
      userId: creatorId,
      url: url,
      extractedId: videoId,
      title: `Stream ${Date.now()}`,
      thumbnailSml: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      thumbnailMed: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      thumbnailHigh: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      thumbnailStandard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      thumbnailMaxRes: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };
    
    res.status(201).json(stream);
  } catch (error) {
    console.error('Error creating stream:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upvote stream endpoint
app.post('/api/streams/upvote', authenticateUser, async (req, res) => {
  try {
    const { streamId } = req.body;
    
    // Validate input
    if (!streamId) {
      return res.status(400).json({ message: 'streamId is required' });
    }
    
    // Simulate upvote logic
    // In a real app, you would check if the user has already upvoted this stream
    const hasUpvoted = Math.random() > 0.5; // Randomly determine if user has upvoted
    
    if (hasUpvoted) {
      // Remove upvote
      return res.json({ message: "Removing the upvote" });
    } else {
      // Add upvote
      return res.json({ message: "Upvoted successfully" });
    }
  } catch (error) {
    console.error('Error upvoting stream:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to extract YouTube video ID
function extractVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});