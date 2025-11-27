# MusePlay - Collaborative Music Streaming

MusePlay is a real-time collaborative music streaming application that allows users to create rooms, join them, and listen to music together. Users can add songs from YouTube to a shared queue, vote on them, and the highest-voted songs play next.

![MusePlay Screenshot](https://via.placeholder.com/800x400?text=MusePlay+Dashboard)

## Features

*   **Real-time Synchronization**: Room state (queue, current song, votes) is synced instantly across all connected users using WebSockets.
*   **Room Management**: Create unique rooms for different groups or vibes.
*   **Voting System**: Upvote or downvote songs to influence the playback order.
*   **YouTube Integration**: Add any song from YouTube by pasting the URL.
*   **Authentication**: Secure signup and login system.
*   **Responsive Design**: Modern, glassmorphism-inspired UI that works on desktop and mobile.

## Tech Stack

### Frontend
*   **React**: UI library.
*   **Vite**: Build tool and dev server.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **Socket.IO Client**: For real-time communication.
*   **React Router**: For client-side routing.
*   **Lucide React**: For icons.

### Backend
*   **Node.js & Express**: Server runtime and framework.
*   **Socket.IO**: Real-time event-based communication.
*   **Prisma**: ORM for database interaction.
*   **SQLite**: Database (can be easily switched to PostgreSQL/MySQL).
*   **Bcryptjs**: Password hashing.

## Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/museplay.git
    cd museplay
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    # Optional: Google Client ID for OAuth (if enabled)
    GOOGLE_CLIENT_ID=your_google_client_id
    
    # Database URL (defaults to local SQLite file)
    DATABASE_URL="file:./dev.db"
    ```

4.  **Database Setup**
    Initialize the SQLite database:
    ```bash
    npx prisma migrate dev --name init
    ```

### Running the Application

1.  **Start the Backend**
    ```bash
    npm run dev:backend
    ```
    The server will start on `http://localhost:3001`.

2.  **Start the Frontend**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Usage

1.  **Sign Up/Login**: Create an account to get started.
2.  **Create a Room**: Go to the dashboard and create a new room (e.g., "Chill Vibes").
3.  **Invite Friends**: Share the Room ID or let them join from the lobby.
4.  **Add Music**: Paste a YouTube link to add it to the queue.
5.  **Vote**: Thumbs up your favorite tracks to bump them up the list!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
