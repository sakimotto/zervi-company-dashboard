const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'

class ApiClient {
  constructor() {
    this.sessionId = this.getSessionId()
  }

  getSessionId() {
    // Try to get session ID from localStorage or cookie
    return localStorage.getItem('sessionId') || null
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId)
    } else {
      localStorage.removeItem('sessionId')
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}/api${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.sessionId) {
      headers['X-Session-ID'] = this.sessionId
    }

    const config = {
      ...options,
      headers
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Auth methods
  async login(password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    })
    
    if (response.sessionId) {
      this.setSessionId(response.sessionId)
    }
    
    return response
  }

  async getAuthStatus() {
    return await this.request('/auth/status')
  }

  async logout() {
    this.setSessionId(null)
    return { success: true }
  }

  // Tiles methods
  async getTiles() {
    return await this.request('/tiles')
  }

  async createTile(tile) {
    return await this.request('/tiles', {
      method: 'POST',
      body: JSON.stringify(tile)
    })
  }

  async updateTile(id, updates) {
    return await this.request(`/tiles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
  }

  async deleteTile(id) {
    return await this.request(`/tiles/${id}`, {
      method: 'DELETE'
    })
  }

  async reorderTiles(tiles) {
    return await this.request('/tiles/reorder', {
      method: 'POST',
      body: JSON.stringify({ tiles })
    })
  }

  // Banner methods
  async getBanner() {
    return await this.request('/banner')
  }

  async saveBanner(message, expiresAt = null) {
    return await this.request('/banner', {
      method: 'POST',
      body: JSON.stringify({ message, expiresAt })
    })
  }

  // Admin methods
  async getAdminStats() {
    return await this.request('/admin/stats')
  }

  // Calendar methods
  async getCalendarEvents() {
    return await this.request('/calendar/events')
  }

  // News methods
  async getNewsFeed() {
    return await this.request('/news/feed')
  }

  // World clock methods
  async getWorldClock() {
    return await this.request('/worldclock')
  }

  // Health check
  async healthCheck() {
    return await this.request('/health')
  }
}

// Create singleton instance
const apiClient = new ApiClient()

export default apiClient

// Export individual methods for convenience
export const {
  login,
  getAuthStatus,
  logout,
  getTiles,
  createTile,
  updateTile,
  deleteTile,
  reorderTiles,
  getBanner,
  saveBanner,
  getAdminStats,
  getCalendarEvents,
  getNewsFeed,
  getWorldClock,
  healthCheck
} = apiClient

