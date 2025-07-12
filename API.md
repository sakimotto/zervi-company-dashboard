# Zervi Dashboard API Documentation

This document provides comprehensive documentation for the Zervi Dashboard REST API. The API is built with Express.js and provides endpoints for authentication, tile management, calendar events, news feeds, and administrative functions.

## 🔗 Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-backend-url.com/api`

## 🔐 Authentication

The API uses session-based authentication for admin operations. Authentication is required for all write operations (POST, PATCH, DELETE) and admin-specific endpoints.

### Authentication Flow

1. **Login**: POST to `/auth/login` with admin password
2. **Session**: Server creates session and returns session ID
3. **Requests**: Include session ID in subsequent requests
4. **Logout**: Session expires automatically or can be cleared

### Session Management

- **Session Duration**: 1 hour (configurable)
- **Storage**: In-memory (development) / Redis (production)
- **Security**: Secure session IDs with proper expiration

## 📚 API Endpoints

### Authentication Endpoints

#### POST `/auth/login`

Authenticate admin user and create a new session.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "password": "zervi2024!"
}
```

**Response (Success):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Login successful",
  "sessionId": "sess_1234567890abcdef",
  "expiresAt": "2025-07-12T07:00:00.000Z"
}
```

**Response (Error):**
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Invalid password"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"zervi2024!"}'
```

#### GET `/auth/status`

Check current authentication status and session validity.

**Request:**
```http
GET /api/auth/status
X-Session-ID: sess_1234567890abcdef
```

**Response (Authenticated):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "authenticated": true,
  "sessionId": "sess_1234567890abcdef",
  "expiresAt": "2025-07-12T07:00:00.000Z"
}
```

**Response (Not Authenticated):**
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "authenticated": false,
  "error": "No valid session"
}
```

#### POST `/auth/logout`

Invalidate current session and logout.

**Request:**
```http
POST /api/auth/logout
X-Session-ID: sess_1234567890abcdef
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Logged out successfully"
}
```

### Tiles Management

#### GET `/tiles`

Retrieve all dashboard tiles in display order.

**Request:**
```http
GET /api/tiles
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "1",
    "title": "OneDrive",
    "url": "https://onedrive.live.com",
    "icon": "📁",
    "description": "Access shared files and folders",
    "order": 1,
    "createdAt": "2025-07-12T06:00:00.000Z",
    "updatedAt": "2025-07-12T06:00:00.000Z"
  },
  {
    "id": "2",
    "title": "Odoo ERP",
    "url": "https://odoo.com",
    "icon": "📊",
    "description": "Sales, inventory, and timesheets",
    "order": 2,
    "createdAt": "2025-07-12T06:00:00.000Z",
    "updatedAt": "2025-07-12T06:00:00.000Z"
  }
]
```

**Curl Example:**
```bash
curl http://localhost:3001/api/tiles
```

#### POST `/tiles`

Create a new dashboard tile. Requires authentication.

**Request:**
```http
POST /api/tiles
Content-Type: application/json
X-Session-ID: sess_1234567890abcdef

{
  "title": "New Tool",
  "url": "https://example.com",
  "icon": "🔧",
  "description": "Tool description"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "6",
  "title": "New Tool",
  "url": "https://example.com",
  "icon": "🔧",
  "description": "Tool description",
  "order": 6,
  "createdAt": "2025-07-12T06:30:00.000Z",
  "updatedAt": "2025-07-12T06:30:00.000Z"
}
```

**Validation Rules:**
- `title`: Required, 1-100 characters
- `url`: Required, valid URL format
- `icon`: Required, single emoji character
- `description`: Required, 1-200 characters

**Error Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Validation failed",
  "details": {
    "title": "Title is required",
    "url": "Invalid URL format"
  }
}
```

#### PATCH `/tiles/:id`

Update an existing tile. Requires authentication.

**Request:**
```http
PATCH /api/tiles/1
Content-Type: application/json
X-Session-ID: sess_1234567890abcdef

{
  "title": "Updated OneDrive",
  "description": "Updated description"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "1",
  "title": "Updated OneDrive",
  "url": "https://onedrive.live.com",
  "icon": "📁",
  "description": "Updated description",
  "order": 1,
  "createdAt": "2025-07-12T06:00:00.000Z",
  "updatedAt": "2025-07-12T06:30:00.000Z"
}
```

#### DELETE `/tiles/:id`

Delete a tile. Requires authentication.

**Request:**
```http
DELETE /api/tiles/1
X-Session-ID: sess_1234567890abcdef
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Tile deleted successfully"
}
```

#### POST `/tiles/reorder`

Reorder tiles by updating their order values. Requires authentication.

**Request:**
```http
POST /api/tiles/reorder
Content-Type: application/json
X-Session-ID: sess_1234567890abcdef

{
  "tiles": [
    {"id": "2", "order": 1},
    {"id": "1", "order": 2},
    {"id": "3", "order": 3}
  ]
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Tiles reordered successfully"
}
```

### Calendar Events

#### GET `/calendar/events`

Retrieve all calendar events for the dashboard.

**Request:**
```http
GET /api/calendar/events
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "1",
    "title": "Factory Maintenance",
    "start": "2025-07-15",
    "end": "2025-07-15",
    "backgroundColor": "#f97316",
    "borderColor": "#ea580c",
    "category": "Factory Events",
    "description": "Scheduled maintenance for production line A",
    "location": "Rayong Factory"
  },
  {
    "id": "2",
    "title": "Australia Day",
    "start": "2025-01-26",
    "backgroundColor": "#3b82f6",
    "borderColor": "#2563eb",
    "category": "AU Holidays",
    "allDay": true
  }
]
```

**Event Categories:**
- `AU Holidays`: Australian public holidays (blue)
- `TH Holidays`: Thai public holidays (red)
- `Factory Events`: Factory operations and maintenance (orange)

#### POST `/calendar/events`

Create a new calendar event. Requires authentication.

**Request:**
```http
POST /api/calendar/events
Content-Type: application/json
X-Session-ID: sess_1234567890abcdef

{
  "title": "Team Meeting",
  "start": "2025-07-20T10:00:00.000Z",
  "end": "2025-07-20T11:00:00.000Z",
  "category": "Factory Events",
  "description": "Monthly team meeting",
  "location": "Conference Room A"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "10",
  "title": "Team Meeting",
  "start": "2025-07-20T10:00:00.000Z",
  "end": "2025-07-20T11:00:00.000Z",
  "backgroundColor": "#f97316",
  "borderColor": "#ea580c",
  "category": "Factory Events",
  "description": "Monthly team meeting",
  "location": "Conference Room A"
}
```

### News Feed

#### GET `/news/feed`

Retrieve latest news articles from configured RSS sources.

**Request:**
```http
GET /api/news/feed
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "1",
    "title": "Zervi Expands Manufacturing Capabilities in Thailand",
    "description": "New facility in Rayong increases production capacity by 40% to meet growing demand for automotive components.",
    "url": "https://zervi.com/news/expansion-thailand",
    "source": "Zervi Blog",
    "publishedAt": "2025-07-12T06:00:00.000Z",
    "image": null,
    "category": "Company News"
  },
  {
    "id": "tech_123",
    "title": "Latest Technology Trends in Manufacturing",
    "description": "Industry experts discuss the impact of AI and automation on modern manufacturing processes...",
    "url": "https://techcrunch.com/article/123",
    "source": "TechCrunch",
    "publishedAt": "2025-07-12T05:30:00.000Z",
    "image": "https://example.com/image.jpg",
    "category": "Industry News"
  }
]
```

**RSS Sources:**
- TechCrunch (Technology news)
- CNN (General news)
- BBC News (International news)
- Zervi Blog (Company news)

**Fallback Behavior:**
If external RSS feeds are unavailable, the API returns sample company news to ensure the dashboard remains functional.

### World Clock

#### GET `/worldclock`

Get current time for all configured company locations.

**Request:**
```http
GET /api/worldclock
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "name": "Melbourne",
    "timezone": "Australia/Melbourne",
    "flag": "🇦🇺",
    "time": "16:13",
    "date": "7/12/2025",
    "utcOffset": "+11:00",
    "isDST": false
  },
  {
    "name": "Bangkok",
    "timezone": "Asia/Bangkok",
    "flag": "🇹🇭",
    "time": "13:13",
    "date": "7/12/2025",
    "utcOffset": "+07:00",
    "isDST": false
  },
  {
    "name": "Phuket",
    "timezone": "Asia/Bangkok",
    "flag": "🇹🇭",
    "time": "13:13",
    "date": "7/12/2025",
    "utcOffset": "+07:00",
    "isDST": false
  },
  {
    "name": "Rayong",
    "timezone": "Asia/Bangkok",
    "flag": "🇹🇭",
    "time": "13:13",
    "date": "7/12/2025",
    "utcOffset": "+07:00",
    "isDST": false
  }
]
```

**Time Format:**
- `time`: 24-hour format (HH:MM)
- `date`: Localized date format
- `utcOffset`: UTC offset in ±HH:MM format
- `isDST`: Daylight saving time status

### Banner Management

#### GET `/banner`

Get current banner message and status.

**Request:**
```http
GET /api/banner
```

**Response (Active Banner):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "1",
  "message": "System maintenance scheduled for tonight 10 PM - 2 AM AEST",
  "isActive": true,
  "createdAt": "2025-07-12T06:00:00.000Z",
  "expiresAt": "2025-07-13T02:00:00.000Z"
}
```

**Response (No Banner):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": null,
  "isActive": false
}
```

#### POST `/banner`

Create or update banner message. Requires authentication.

**Request:**
```http
POST /api/banner
Content-Type: application/json
X-Session-ID: sess_1234567890abcdef

{
  "message": "Important: New security protocols in effect",
  "expiresAt": "2025-07-20T00:00:00.000Z"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "2",
  "message": "Important: New security protocols in effect",
  "isActive": true,
  "createdAt": "2025-07-12T06:30:00.000Z",
  "expiresAt": "2025-07-20T00:00:00.000Z"
}
```

#### DELETE `/banner`

Remove current banner. Requires authentication.

**Request:**
```http
DELETE /api/banner
X-Session-ID: sess_1234567890abcdef
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Banner removed successfully"
}
```

### Admin Statistics

#### GET `/admin/stats`

Get dashboard usage statistics. Requires authentication.

**Request:**
```http
GET /api/admin/stats
X-Session-ID: sess_1234567890abcdef
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "tiles": {
    "total": 5,
    "recentlyAdded": 2,
    "mostUsed": {
      "id": "1",
      "title": "OneDrive",
      "clicks": 45
    }
  },
  "sessions": {
    "active": 3,
    "totalToday": 12,
    "averageDaily": 8.5
  },
  "system": {
    "uptime": "2 days, 14 hours",
    "version": "1.0.0",
    "lastRestart": "2025-07-10T08:00:00.000Z"
  }
}
```

### Health Check

#### GET `/health`

System health check endpoint for monitoring.

**Request:**
```http
GET /api/health
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "ok",
  "timestamp": "2025-07-12T06:30:00.000Z",
  "uptime": 172800,
  "version": "1.0.0",
  "environment": "production"
}
```

## 🔒 Security

### Authentication Security

1. **Session Management**
   - Secure session ID generation
   - Automatic session expiration
   - Session invalidation on logout

2. **Password Security**
   - Strong password requirements
   - Rate limiting on login attempts
   - Secure password storage (hashed)

3. **Request Validation**
   - Input sanitization
   - SQL injection prevention
   - XSS protection

### CORS Configuration

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Session-ID']
}
```

### Rate Limiting

- **Login Endpoint**: 5 attempts per 15 minutes per IP
- **API Endpoints**: 100 requests per minute per session
- **Public Endpoints**: 1000 requests per hour per IP

## 📊 Error Handling

### Standard Error Response

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  },
  "timestamp": "2025-07-12T06:30:00.000Z"
}
```

### HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Codes

- `INVALID_PASSWORD`: Login password incorrect
- `SESSION_EXPIRED`: Session has expired
- `VALIDATION_ERROR`: Request validation failed
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server internal error

## 🧪 Testing

### API Testing with curl

**Authentication Flow:**
```bash
# Login
SESSION_ID=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"zervi2024!"}' | jq -r '.sessionId')

# Use session for authenticated requests
curl -H "X-Session-ID: $SESSION_ID" http://localhost:3001/api/admin/stats
```

**Tile Management:**
```bash
# Get all tiles
curl http://localhost:3001/api/tiles

# Create new tile
curl -X POST http://localhost:3001/api/tiles \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: $SESSION_ID" \
  -d '{"title":"Test Tool","url":"https://test.com","icon":"🔧","description":"Test description"}'
```

### Postman Collection

A Postman collection is available with pre-configured requests for all endpoints. Import the collection and set the following environment variables:

- `base_url`: `http://localhost:3001/api`
- `admin_password`: `zervi2024!`
- `session_id`: (automatically set after login)

## 📈 Performance

### Response Times

- **Health Check**: < 10ms
- **Tiles List**: < 50ms
- **Calendar Events**: < 100ms
- **News Feed**: < 500ms (with external API calls)
- **World Clock**: < 200ms

### Caching Strategy

1. **Static Data**: 5 minutes cache for tiles and calendar events
2. **Dynamic Data**: 1 minute cache for world clock
3. **External APIs**: 15 minutes cache for news feeds
4. **Health Check**: No caching

### Database Optimization

When migrating from in-memory storage:

1. **Indexing**: Add indexes on frequently queried fields
2. **Connection Pooling**: Implement connection pooling
3. **Query Optimization**: Optimize complex queries
4. **Pagination**: Implement pagination for large datasets

---

This API documentation provides comprehensive information for integrating with the Zervi Dashboard backend. For additional support or questions, refer to the main README.md file or contact the development team.

