// server-real.js – backend with bcrypt, register, login, socket.io
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config(); // Load env vars BEFORE PrismaClient
import express from 'express';
// ...
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const prisma = new PrismaClient();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Simple session store (in production, use Redis or similar)
const sessions = new Map();

// Helper to generate session token
function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
    const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
    if (!sessionToken) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const userId = sessions.get(sessionToken);
    if (!userId) {
        return res.status(401).json({ message: 'Invalid session' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ============ AUTH ENDPOINTS ============

// Register – email + password
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, provider = 'email' } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { email, provider, passwordHash } });
        const sessionToken = generateSessionToken();
        sessions.set(sessionToken, user.id);
        res.json({ user: { id: user.id, email: user.email, provider: user.provider }, sessionToken });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return null;
    }
}

// ... (rest of imports)

// Login – supports email/password and Google
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, provider = 'email', googleToken } = req.body;

        if (provider === 'google') {
            // Real Google OAuth flow
            if (googleToken && process.env.GOOGLE_CLIENT_ID) {
                const payload = await verifyGoogleToken(googleToken);
                if (!payload) {
                    return res.status(401).json({ message: 'Invalid Google token' });
                }
                // Use email from payload
                const googleEmail = payload.email;
                let user = await prisma.user.findUnique({ where: { email: googleEmail } });
                if (!user) {
                    user = await prisma.user.create({
                        data: { email: googleEmail, provider: 'google', passwordHash: null }
                    });
                }
                const sessionToken = generateSessionToken();
                sessions.set(sessionToken, user.id);
                return res.json({ user: { id: user.id, email: user.email, provider: user.provider }, sessionToken });
            } else {
                // Demo Google flow (fallback)
                if (!email) return res.status(400).json({ message: 'Email is required for demo google login' });
                let user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    user = await prisma.user.create({
                        data: { email, provider: 'google', passwordHash: null }
                    });
                }
                const sessionToken = generateSessionToken();
                sessions.set(sessionToken, user.id);
                return res.json({ user: { id: user.id, email: user.email, provider: user.provider }, sessionToken });
            }
        }

        // Email/Password flow
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password required for email login' });
        }
        const valid = await bcrypt.compare(password, user.passwordHash || '');
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const sessionToken = generateSessionToken();
        sessions.set(sessionToken, user.id);
        res.json({ user: { id: user.id, email: user.email, provider: user.provider }, sessionToken });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
    if (sessionToken) {
        sessions.delete(sessionToken);
    }
    res.json({ message: 'Logged out successfully' });
});

app.get('/api/userContext', authenticateUser, async (req, res) => {
    try {
        res.json({ id: req.user.id, email: req.user.email, provider: req.user.provider });
    } catch (error) {
        console.error('Error fetching user context:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ============ ROOM ENDPOINTS ============

app.post('/api/rooms', authenticateUser, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Room name is required' });
        }
        const room = await prisma.room.create({
            data: {
                name,
                creatorId: req.user.id,
            },
        });
        res.status(201).json(room);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/rooms', authenticateUser, async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { streams: true } } }
        });
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/rooms/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const room = await prisma.room.findUnique({ where: { id } });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ============ STREAM ENDPOINTS ============
app.post('/api/streams', authenticateUser, async (req, res) => {
    try {
        const { url, roomId } = req.body;
        if (!url || !roomId) {
            return res.status(400).json({ message: 'URL and Room ID are required' });
        }

        // Verify room exists
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return res.status(400).json({ message: 'Invalid YouTube URL' });
        }
        const title = await getVideoTitle(videoId);
        const stream = await prisma.stream.create({
            data: {
                type: 'youtube',
                url,
                extractedId: videoId,
                title,
                thumbnailSml: `https://img.youtube.com/vi/${videoId}/default.jpg`,
                thumbnaidBig: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                userId: req.user.id,
                roomId: roomId,
            },
            include: { upvotes: true, user: { select: { email: true } } },
        });
        const payload = {
            id: stream.id,
            extractedId: stream.extractedId,
            url: stream.url,
            title: stream.title,
            thumbnailSml: stream.thumbnailSml,
            thumbnailBig: stream.thumbnaidBig,
            votes: stream.upvotes.length,
            addedBy: stream.user.email,
            roomId: roomId,
        };
        io.to(roomId).emit('streamAdded', payload);
        res.status(201).json(payload);
    } catch (error) {
        console.error('Error creating stream:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/streams', async (req, res) => {
    // Public streams endpoint - arguably should be removed or filtered by a "public" room if concept exists
    // For now, return empty or all streams (but streams now need room)
    // Let's just return 404 or empty to encourage room usage
    res.json([]);
});

app.get('/api/streams/:roomId', authenticateUser, async (req, res) => {
    try {
        const { roomId } = req.params;
        const streams = await prisma.stream.findMany({
            where: { active: true, roomId },
            include: {
                upvotes: { include: { user: { select: { id: true } } } },
                user: { select: { email: true } },
            },
            orderBy: { id: 'desc' },
        });
        const result = streams.map(s => ({
            id: s.id,
            extractedId: s.extractedId,
            url: s.url,
            title: s.title,
            thumbnailSml: s.thumbnailSml,
            votes: s.upvotes.length,
            addedBy: s.user.email,
            hasUpvoted: s.upvotes.some(u => u.userId === req.user.id),
        }));
        result.sort((a, b) => b.votes - a.votes);
        res.json(result);
    } catch (error) {
        console.error('Error fetching streams:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/streams/upvote', authenticateUser, async (req, res) => {
    try {
        const { streamId } = req.body;
        if (!streamId) {
            return res.status(400).json({ message: 'streamId is required' });
        }
        const stream = await prisma.stream.findUnique({ where: { id: streamId } });
        if (!stream) {
            return res.status(404).json({ message: 'Stream not found' });
        }
        const existing = await prisma.upvote.findUnique({
            where: { userId_streamId: { userId: req.user.id, streamId } },
        });
        let message, hasUpvoted;
        if (existing) {
            await prisma.upvote.delete({ where: { id: existing.id } });
            message = 'Removing the upvote';
            hasUpvoted = false;
        } else {
            await prisma.upvote.create({ data: { userId: req.user.id, streamId } });
            message = 'Upvoted successfully';
            hasUpvoted = true;
        }
        const newVoteCount = await prisma.upvote.count({ where: { streamId } });
        const payload = { streamId, votes: newVoteCount, hasUpvoted, message, roomId: stream.roomId };
        io.to(stream.roomId).emit('streamUpdated', payload);
        res.json(payload);
    } catch (error) {
        console.error('Error upvoting stream:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/streams/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const stream = await prisma.stream.findUnique({ where: { id } });
        if (!stream) {
            return res.status(404).json({ message: 'Stream not found' });
        }
        await prisma.stream.update({ where: { id }, data: { active: false } });
        io.to(stream.roomId).emit('streamDeleted', { id, roomId: stream.roomId });
        res.json({ message: 'Stream deleted successfully' });
    } catch (error) {
        console.error('Error deleting stream:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ============ HELPER FUNCTIONS ============
function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1].split('&')[0].split('?')[0];
    }
    return null;
}

async function getVideoTitle(videoId) {
    try {
        const response = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        return response.data.title;
    } catch (error) {
        console.error('Error fetching video title:', error.message);
        return `Video ${videoId}`; // Fallback
    }
}

// ============ SERVER STARTUP ============
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }
});

io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, async () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
    try {
        await prisma.$connect();
        console.log('✅ Prisma client connected successfully');
    } catch (error) {
        console.error('❌ Failed to connect to database:', error);
        // Don't exit, just log. The app might still work if the DB recovers or if it's a transient issue.
        // But for Prisma P1012 it's fatal.
    }
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
