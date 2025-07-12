# Zervi Company Dashboard

A comprehensive full-stack company dashboard built for Zervi Pty Ltd, featuring a modern React frontend with Express.js backend. This dashboard provides quick access to company tools, real-time world clocks, calendar integration, news feeds, and powerful admin functionality.

![Zervi Dashboard](./public/logo.svg)

## 🚀 Features

### Core Dashboard Features
- **Responsive Tile Grid**: Drag-and-drop reorderable tiles for quick access to company tools
- **Multi-timezone World Clocks**: Real-time clocks for Melbourne, Bangkok, Phuket, and Rayong
- **Company Calendar**: Integrated calendar with color-coded events for holidays and factory operations
- **News Feed**: Carousel-style news feed with RSS integration and fallback content
- **Quick Notice Banner**: Admin-configurable banner system for important announcements
- **Dark Theme**: Professional dark theme with Zervi brand colors (dark blue, white, orange accents)

### Admin Functionality
- **Secure Authentication**: Password-protected admin access (default: `zervi2024!`)
- **Tile Management**: Full CRUD operations for dashboard tiles
- **Banner Management**: Create and manage quick notice banners
- **Session Management**: Secure session-based authentication
- **Real-time Updates**: Live updates across all connected clients

### Technical Features
- **Full-stack Architecture**: React frontend with Express.js backend
- **RESTful API**: Comprehensive API with proper error handling
- **Responsive Design**: Mobile-first design that works on all devices
- **External API Integration**: RSS feeds, world time APIs with fallback mechanisms
- **In-memory Data Store**: Development-ready data persistence
- **CORS Support**: Proper cross-origin resource sharing configuration

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Lucide Icons**: Beautiful icon library
- **React Beautiful DnD**: Drag-and-drop functionality

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **CORS**: Cross-origin resource sharing
- **Cookie Parser**: Session management
- **In-memory Storage**: Development data persistence

### External Integrations
- **RSS2JSON API**: News feed integration
- **WorldTimeAPI**: Accurate timezone data
- **Google Fonts**: Inter and Roboto Mono typography

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zervi-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development servers**
   ```bash
   # Start both frontend and backend
   pnpm run dev:all
   
   # Or start individually
   pnpm run dev        # Frontend only
   pnpm run dev:server # Backend only
   ```

4. **Access the dashboard**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Admin Login: Use password `zervi2024!`

## 🚀 Deployment

### Production Build

1. **Build the frontend**
   ```bash
   pnpm run build
   ```

2. **Deploy to hosting service**
   - Frontend: Deploy `dist/` folder to any static hosting service
   - Backend: Deploy server files to Node.js hosting service

### Environment Configuration

Create a `.env` file in the root directory:

```env
NODE_ENV=production
PORT=3001
ADMIN_PASSWORD=zervi2024!
```

### Deployment Options

#### Frontend Deployment
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment

#### Backend Deployment
- **Railway**: Connect GitHub repository
- **Render**: Deploy from GitHub with automatic builds
- **Heroku**: Use Heroku CLI or GitHub integration

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Authenticate admin user and create session.

**Request Body:**
```json
{
  "password": "zervi2024!"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "unique-session-id"
}
```

#### GET `/api/auth/status`
Check current authentication status.

**Response:**
```json
{
  "authenticated": true,
  "sessionId": "unique-session-id"
}
```

### Tiles Management

#### GET `/api/tiles`
Retrieve all dashboard tiles.

**Response:**
```json
[
  {
    "id": "1",
    "title": "OneDrive",
    "url": "https://onedrive.com",
    "icon": "📁",
    "description": "Access shared files and folders",
    "order": 1
  }
]
```

#### POST `/api/tiles`
Create a new tile (requires authentication).

**Request Body:**
```json
{
  "title": "New Tool",
  "url": "https://example.com",
  "icon": "🔧",
  "description": "Tool description"
}
```

#### PATCH `/api/tiles/:id`
Update existing tile (requires authentication).

#### DELETE `/api/tiles/:id`
Delete tile (requires authentication).

### Calendar Events

#### GET `/api/calendar/events`
Retrieve calendar events.

**Response:**
```json
[
  {
    "id": "1",
    "title": "Factory Maintenance",
    "start": "2025-07-15",
    "backgroundColor": "#f97316",
    "borderColor": "#ea580c",
    "category": "Factory Events"
  }
]
```

### News Feed

#### GET `/api/news/feed`
Retrieve latest news articles.

**Response:**
```json
[
  {
    "id": "1",
    "title": "News Article Title",
    "description": "Article description...",
    "url": "https://example.com/article",
    "source": "News Source",
    "publishedAt": "2025-07-12T06:00:00.000Z",
    "image": null
  }
]
```

### World Clock

#### GET `/api/worldclock`
Get current time for all configured timezones.

**Response:**
```json
[
  {
    "name": "Melbourne",
    "timezone": "Australia/Melbourne",
    "flag": "🇦🇺",
    "time": "16:13",
    "date": "7/12/2025",
    "utcOffset": "auto"
  }
]
```

### Banner Management

#### GET `/api/banner`
Get current banner message.

#### POST `/api/banner`
Set banner message (requires authentication).

**Request Body:**
```json
{
  "message": "Important announcement",
  "expiresAt": "2025-07-20T00:00:00.000Z"
}
```

## 🎨 Customization

### Brand Colors
The dashboard uses Zervi's brand colors defined in `src/App.css`:

```css
:root {
  --primary: 220 100% 50%;        /* Blue */
  --primary-foreground: 0 0% 100%; /* White */
  --accent: 25 95% 53%;           /* Orange */
  --background: 220 65% 4%;       /* Dark Blue */
}
```

### Adding New Tiles
Tiles can be added through the admin interface or by modifying the initial data in `src/server/index.js`.

### Customizing Timezones
Modify the timezone configuration in the world clock API endpoint:

```javascript
const timezones = [
  { name: 'Melbourne', timezone: 'Australia/Melbourne', flag: '🇦🇺' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
  // Add more timezones as needed
]
```

## 🔧 Development

### Project Structure
```
zervi-dashboard/
├── public/                 # Static assets
│   └── logo.svg           # Zervi logo
├── src/
│   ├── components/        # React components
│   │   ├── TileGrid.jsx   # Main tile grid
│   │   ├── WorldClock.jsx # World clock display
│   │   ├── Calendar.jsx   # Calendar component
│   │   ├── NewsFeed.jsx   # News feed carousel
│   │   └── AdminPanel.jsx # Admin interface
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   └── AdminLogin.jsx # Admin login
│   ├── lib/               # Utilities
│   │   └── api.js         # API client
│   ├── server/            # Backend server
│   │   └── index.js       # Express server
│   ├── App.jsx            # Main app component
│   ├── App.css            # Global styles
│   └── main.jsx           # App entry point
├── dist/                  # Production build
├── package.json           # Dependencies
└── README.md              # This file
```

### Available Scripts

- `pnpm run dev` - Start frontend development server
- `pnpm run dev:server` - Start backend server
- `pnpm run dev:all` - Start both frontend and backend
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Adding New Features

1. **Frontend Components**: Add new React components in `src/components/`
2. **API Endpoints**: Add new routes in `src/server/index.js`
3. **Styling**: Use Tailwind CSS classes or extend `src/App.css`
4. **External APIs**: Add integration logic with proper fallbacks

## 🔒 Security

### Authentication
- Session-based authentication with secure session IDs
- Password protection for admin features
- CORS configuration for secure cross-origin requests

### Best Practices
- Input validation on all API endpoints
- Secure session management
- Environment variable configuration for sensitive data
- Error handling without information disclosure

## 🐛 Troubleshooting

### Common Issues

**Frontend not connecting to backend:**
- Ensure backend server is running on port 3001
- Check CORS configuration in server
- Verify API_BASE URL in `src/lib/api.js`

**Admin login not working:**
- Verify password is `zervi2024!`
- Check browser console for API errors
- Ensure backend authentication endpoint is responding

**Tiles not saving:**
- Confirm admin authentication is active
- Check browser network tab for API errors
- Verify backend data persistence is working

**World clocks showing incorrect time:**
- Check browser timezone settings
- Verify JavaScript Intl API support
- Fallback to manual timezone calculation if needed

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Testing**: Use browser dev tools or Postman to test API endpoints
3. **Debugging**: Enable browser dev tools and check console for errors
4. **Performance**: Use React DevTools to profile component performance

## 📄 License

This project is proprietary software developed for Zervi Pty Ltd. All rights reserved.

## 🤝 Contributing

This is a private project for Zervi Pty Ltd. For internal development:

1. Create feature branches from `main`
2. Follow existing code style and conventions
3. Test thoroughly before merging
4. Update documentation for new features

## 📞 Support

For technical support or questions about this dashboard:

- **Internal Team**: Contact the development team
- **Issues**: Document issues with steps to reproduce
- **Feature Requests**: Submit detailed requirements and use cases

---

**Built with ❤️ for Zervi Pty Ltd**

*This dashboard represents a modern, scalable solution for company operations management, designed to grow with Zervi's expanding global presence.*

