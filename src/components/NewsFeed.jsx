import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Newspaper, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

function NewsFeed() {
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news/feed')
      if (response.ok) {
        const data = await response.json()
        setNewsItems(data.slice(0, 5)) // Limit to 5 items as specified
      } else {
        // Fallback to sample news
        setNewsItems(getSampleNews())
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      setNewsItems(getSampleNews())
    } finally {
      setLoading(false)
    }
  }

  const getSampleNews = () => {
    return [
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
      },
      {
        id: '3',
        title: 'Thailand Manufacturing Sector Shows Strong Growth',
        description: 'Industry reports indicate 15% growth in automotive parts manufacturing across Southeast Asia.',
        url: 'https://example.com/thai-industry-news',
        source: 'Thai Industry News',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        image: null
      },
      {
        id: '4',
        title: 'Advanced Manufacturing Technologies Reshape Industry',
        description: 'AI and automation drive efficiency improvements in precision manufacturing processes.',
        url: 'https://news.ycombinator.com/manufacturing',
        source: 'Hacker News',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        image: null
      },
      {
        id: '5',
        title: 'Sustainable Manufacturing Practices Gain Momentum',
        description: 'Companies adopt eco-friendly processes to reduce environmental impact while maintaining quality.',
        url: 'https://example.com/sustainability-news',
        source: 'Industry Report',
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        image: null
      }
    ]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length)
  }

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="w-5 h-5" />
            <span>News Feed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="text-muted-foreground">Loading news...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (newsItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="w-5 h-5" />
            <span>News Feed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No news items available
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentItem = newsItems[currentIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-5 h-5" />
            <span>News Feed</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={prevItem}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {newsItems.length}
            </span>
            <Button variant="ghost" size="sm" onClick={nextItem}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentItem.image && (
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="w-full h-32 object-cover rounded-md"
              loading="lazy"
            />
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {currentItem.source}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(currentItem.publishedAt)}
              </span>
            </div>
            
            <h3 className="font-medium leading-tight">
              {currentItem.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-3">
              {currentItem.description}
            </p>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(currentItem.url, '_blank')}
              className="w-full"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Read More
            </Button>
          </div>
        </div>
        
        {/* Dots indicator */}
        <div className="flex justify-center space-x-1 mt-4">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default NewsFeed

