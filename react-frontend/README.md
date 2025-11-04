# MusePlay React Frontend

This is the React.js (Vite) version of the MusePlay application, migrated from the original Next.js implementation.

## Key Changes from Next.js to React/Vite

1. **Routing**: Replaced Next.js file-based routing with React Router DOM
2. **Authentication**: Removed NextAuth in favor of custom authentication flow
3. **API Calls**: Replaced Next.js API routes with direct calls to backend APIs
4. **Environment Variables**: Updated from `process.env.NEXT_PUBLIC_*` to `import.meta.env.VITE_*`
5. **Image Components**: Replaced Next.js `Image` component with standard HTML `<img>` tags
6. **Component Structure**: Restructured components to work with React/Vite architecture

## Project Structure

```
react-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions and API clients
│   ├── pages/              # Page components
│   ├── App.css             # Global styles
│   ├── App.jsx             # Main App component with routing
│   └── main.jsx            # Entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
VITE_API_BASE_URL=http://localhost:3001/api
```

## API Integration

The frontend connects directly to the backend API. Make sure your backend is running and accessible at the URL specified in `VITE_API_BASE_URL`.

## Authentication

Authentication is handled through custom components and API calls. The login flow includes:
- Email/Password authentication
- Google OAuth (to be implemented)
- Email magic link (to be implemented)

## Styling

The application uses Tailwind CSS for styling, maintaining the same visual design as the original Next.js version.

## Components

- `Appbar`: Navigation header with authentication controls
- `LandingPage`: Main landing page with features and signup form
- `Dashboard`: Main application dashboard for managing streams
- `Login`: Authentication page
- UI components: Button, Input, Card (from shadcn/ui)

## Migration Notes

1. All Next.js-specific features have been removed
2. API routes have been replaced with direct backend calls
3. Server-side rendering capabilities have been removed in favor of client-side rendering
4. Image optimization is no longer automatic (using standard `<img>` tags)
5. Environment variables now use Vite's `import.meta.env` syntax