import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Settings, Bell, Users, BarChart3, Save } from 'lucide-react'

function AdminPanel() {
  const [banner, setBanner] = useState('')
  const [bannerActive, setBannerActive] = useState(false)
  const [stats, setStats] = useState({
    totalTiles: 0,
    activeUsers: 0,
    lastUpdated: null
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      // Fetch current banner
      const bannerResponse = await fetch('/api/banner')
      if (bannerResponse.ok) {
        const bannerData = await bannerResponse.json()
        setBanner(bannerData.message || '')
        setBannerActive(!!bannerData.message)
      }

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }

  const saveBanner = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: bannerActive ? banner : '',
          expiresAt: bannerActive ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
        }),
      })

      if (response.ok) {
        // Show success feedback
        console.log('Banner saved successfully')
      }
    } catch (error) {
      console.error('Error saving banner:', error)
    } finally {
      setSaving(false)
    }
  }

  const clearBanner = async () => {
    setBanner('')
    setBannerActive(false)
    await saveBanner()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <Tabs defaultValue="banner" className="space-y-4">
        <TabsList>
          <TabsTrigger value="banner">Banner Management</TabsTrigger>
          <TabsTrigger value="stats">Dashboard Stats</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="banner">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Quick Notice Banner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="banner-active"
                  checked={bannerActive}
                  onChange={(e) => setBannerActive(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="banner-active">Show banner to all users</Label>
              </div>

              <div>
                <Label htmlFor="banner-message">Banner Message</Label>
                <Textarea
                  id="banner-message"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  placeholder="Enter banner message (auto-dismisses after 24 hours)"
                  disabled={!bannerActive}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={saveBanner} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Banner'}
                </Button>
                <Button variant="outline" onClick={clearBanner}>
                  Clear Banner
                </Button>
              </div>

              {bannerActive && banner && (
                <div className="mt-4">
                  <Label>Preview:</Label>
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md mt-2">
                    {banner}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.totalTiles}</div>
                  <div className="text-sm text-muted-foreground">Total Tiles</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.activeUsers}</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Tile "OneDrive" accessed</span>
                    <Badge variant="secondary">2 min ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">New user logged in</span>
                    <Badge variant="secondary">15 min ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Calendar events updated</span>
                    <Badge variant="secondary">1 hour ago</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Admin User</div>
                    <div className="text-sm text-muted-foreground">Full access to all features</div>
                  </div>
                  <Badge>Admin</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Regular Users</div>
                    <div className="text-sm text-muted-foreground">Can view and personalize dashboard</div>
                  </div>
                  <Badge variant="secondary">User</Badge>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">User Permissions</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Admin: Can add, edit, delete tiles and manage banner</li>
                    <li>• User: Can reorder tiles and access all dashboard features</li>
                    <li>• All users can access external links and view calendar/news</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPanel

