import { useState, useEffect } from 'react'
import TileGrid from '../components/TileGrid'
import Calendar from '../components/Calendar'
import NewsFeed from '../components/NewsFeed'
import WorldClock from '../components/WorldClock'
import { Button } from '@/components/ui/button'
import apiClient from '../lib/api'

function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [banner, setBanner] = useState('')

  useEffect(() => {
    // Check if user is admin (from cookie or session)
    const checkAdminStatus = async () => {
      try {
        const data = await apiClient.getAuthStatus()
        setIsAdmin(data.role === 'admin')
      } catch (error) {
        console.error('Error checking admin status:', error)
      }
    }
    
    // Fetch current banner
    const fetchBanner = async () => {
      try {
        const data = await apiClient.getBanner()
        setBanner(data.message || '')
      } catch (error) {
        console.error('Error fetching banner:', error)
      }
    }

    checkAdminStatus()
    fetchBanner()
  }, [])

  const dismissBanner = () => {
    setBanner('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      {banner && (
        <div className="bg-primary text-primary-foreground px-4 py-2 flex justify-between items-center">
          <span>{banner}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={dismissBanner}
            className="text-primary-foreground hover:bg-primary/80"
          >
            ×
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.svg" alt="Razorback" className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Zervi Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <WorldClock />
            {isAdmin && (
              <Button variant="outline" size="sm">
                Admin Panel
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tiles */}
          <div className="lg:col-span-2">
            <TileGrid isAdmin={isAdmin} />
          </div>
          
          {/* Right Column - Calendar & News */}
          <div className="space-y-6">
            <Calendar />
            <NewsFeed />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

