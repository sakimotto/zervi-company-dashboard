const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// In-memory data store (for development)
let tiles = [
  {
    id: '1',
    title: 'OneDrive',
    url: 'https://onedrive.live.com',
    icon: '📁',
    description: 'Access shared files and folders',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Odoo ERP',
    url: 'https://demo.odoo.com',
    icon: '📊',
    description: 'Sales, inventory, and timesheets',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Adobe Creative Cloud',
    url: 'https://creativecloud.adobe.com',
    icon: '🎨',
    description: 'Design tools and shared libraries',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'AutoCAD Web',
    url: 'https://web.autocad.com',
    icon: '📐',
    description: 'View and edit CAD files',
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Razorback 4×4 Admin',
    url: 'https://razorback4x4.myshopify.com/admin',
    icon: '🛒',
    description: 'Shopify store management',
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

let banner = null
let users = []

// Authentication middleware
const checkAuth = (req, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId
  if (!sessionId) {
    return res.status(401).json({ error: 'No session found' })
  }

  const user = users.find(u => u.session_id === sessionId)
  if (!user) {
    return res.status(401).json({ error: 'Invalid session' })
  }

  req.user = user
  next()
}

const checkAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// Routes

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body
  
  if (password === 'zervi2024!') {
    const sessionId = Date.now().toString() + Math.random().toString(36)
    
    // Create or update admin user
    let existingAdmin = users.find(u => u.role === 'admin')
    if (existingAdmin) {
      existingAdmin.session_id = sessionId
      existingAdmin.last_active = new Date().toISOString()
    } else {
      users.push({
        id: users.length + 1,
        session_id: sessionId,
        role: 'admin',
        last_active: new Date().toISOString()
      })
    }

    res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.json({ success: true, role: 'admin', sessionId })
  } else {
    res.status(401).json({ error: 'Invalid password' })
  }
})

app.get('/api/auth/status', (req, res) => {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId
  
  if (!sessionId) {
    return res.json({ role: 'user' })
  }

  const user = users.find(u => u.session_id === sessionId)
  res.json({ role: user?.role || 'user' })
})

// Tiles routes
app.get('/api/tiles', (req, res) => {
  try {
    const sortedTiles = [...tiles].sort((a, b) => a.order_index - b.order_index)
    res.json(sortedTiles)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tiles' })
  }
})

app.post('/api/tiles', checkAuth, checkAdmin, (req, res) => {
  try {
    const { id, title, url, icon, description } = req.body
    const maxOrder = Math.max(...tiles.map(t => t.order_index), -1)
    const orderIndex = maxOrder + 1

    const newTile = {
      id: id || Date.now().toString(),
      title,
      url,
      icon: icon || '🔗',
      description: description || '',
      order_index: orderIndex,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    tiles.push(newTile)
    res.json(newTile)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tile' })
  }
})

app.patch('/api/tiles/:id', checkAuth, checkAdmin, (req, res) => {
  try {
    const { id } = req.params
    const { title, url, icon, description } = req.body

    const tileIndex = tiles.findIndex(t => t.id === id)
    if (tileIndex === -1) {
      return res.status(404).json({ error: 'Tile not found' })
    }

    tiles[tileIndex] = {
      ...tiles[tileIndex],
      title,
      url,
      icon,
      description,
      updated_at: new Date().toISOString()
    }

    res.json(tiles[tileIndex])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tile' })
  }
})

app.delete('/api/tiles/:id', checkAuth, checkAdmin, (req, res) => {
  try {
    const { id } = req.params
    const tileIndex = tiles.findIndex(t => t.id === id)
    
    if (tileIndex === -1) {
      return res.status(404).json({ error: 'Tile not found' })
    }

    tiles.splice(tileIndex, 1)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tile' })
  }
})

app.post('/api/tiles/reorder', checkAuth, (req, res) => {
  try {
    const { tiles: reorderedTiles } = req.body
    
    reorderedTiles.forEach((tile, index) => {
      const existingTile = tiles.find(t => t.id === tile.id)
      if (existingTile) {
        existingTile.order_index = index
      }
    })
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder tiles' })
  }
})

// Banner routes
app.get('/api/banner', (req, res) => {
  try {
    if (banner && banner.expires_at && new Date(banner.expires_at) < new Date()) {
      banner = null
    }
    
    res.json(banner || {})
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banner' })
  }
})

app.post('/api/banner', checkAuth, checkAdmin, (req, res) => {
  try {
    const { message, expiresAt } = req.body
    
    if (message) {
      banner = {
        id: 1,
        message,
        expires_at: expiresAt,
        created_at: new Date().toISOString()
      }
    } else {
      banner = null
    }
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save banner' })
  }
})

// Admin stats route
app.get('/api/admin/stats', checkAuth, checkAdmin, (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const activeUsers = users.filter(u => new Date(u.last_active) > oneDayAgo).length
    const lastUpdated = tiles.reduce((latest, tile) => {
      const tileDate = new Date(tile.updated_at)
      return tileDate > latest ? tileDate : latest
    }, new Date(0))

    res.json({
      totalTiles: tiles.length,
      activeUsers,
      lastUpdated: lastUpdated.toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Calendar events route (placeholder)
app.get('/api/calendar/events', (req, res) => {
  // Sample events for testing
  const sampleEvents = [
    {
      id: '1',
      title: 'Australia Day',
      start: '2025-01-26',
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      textColor: '#FFFFFF'
    },
    {
      id: '2',
      title: 'Thai New Year',
      start: '2025-04-13',
      end: '2025-04-15',
      backgroundColor: '#EF4444',
      borderColor: '#EF4444',
      textColor: '#FFFFFF'
    }
  ]
  res.json(sampleEvents)
})

// News feed route with RSS integration
app.get('/api/news/feed', async (req, res) => {
  try {
    const rssSources = [
      'https://feeds.feedburner.com/TechCrunch',
      'https://rss.cnn.com/rss/edition.rss',
      'https://feeds.bbci.co.uk/news/rss.xml'
    ]
    
    const allNews = []
    
    for (const rssUrl of rssSources) {
      try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=3`)
        const data = await response.json()
        
        if (data.status === 'ok' && data.items) {
          const newsItems = data.items.map(item => ({
            id: item.guid || item.link,
            title: item.title,
            description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
            url: item.link,
            source: data.feed.title,
            publishedAt: item.pubDate,
            image: item.thumbnail || null
          }))
          allNews.push(...newsItems)
        }
      } catch (error) {
        console.error(`Error fetching RSS from ${rssUrl}:`, error)
      }
    }
    
    // Sort by publication date and limit to 10 items
    allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    res.json(allNews.slice(0, 10))
  } catch (error) {
    console.error('Error fetching news feed:', error)
    // Fallback to sample news
    const sampleNews = [
      {
        id: '1',
        title: 'Zervi Expands Manufacturing Capabilities in Thailand',
        description: 'New facility in Rayong increases production capacity by 40% to meet growing demand for automotive components.',
        url: 'https://zervi.com/news/expansion-thailand',
        source: 'Zervi Blog',
        publishedAt: new Date().toISOString(),
        image: null
      },
      {
        id: '2',
        title: 'Razorback 4×4 Launches New Product Line',
        description: 'Innovative off-road accessories designed for extreme conditions now available across Australia.',
        url: 'https://razorback4x4.com/news/new-products',
        source: 'Razorback Blog',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        image: null
      }
    ]
    res.json(sampleNews)
  }
})

// World clock route with fallback to JavaScript timezone calculation
app.get('/api/worldclock', async (req, res) => {
  try {
    const timezones = [
      { name: 'Melbourne', timezone: 'Australia/Melbourne', flag: '🇦🇺' },
      { name: 'Bangkok', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
      { name: 'Phuket', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
      { name: 'Rayong', timezone: 'Asia/Bangkok', flag: '🇹🇭' }
    ]
    
    const clockData = timezones.map(tz => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: tz.timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
      
      return {
        name: tz.name,
        timezone: tz.timezone,
        flag: tz.flag,
        time: timeString,
        date: now.toLocaleDateString('en-US', { timeZone: tz.timezone }),
        utcOffset: 'auto'
      }
    })
    
    res.json(clockData)
  } catch (error) {
    console.error('Error generating world clock data:', error)
    res.status(500).json({ error: 'Failed to fetch world clock data' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Using in-memory data store for development')
})

module.exports = app

