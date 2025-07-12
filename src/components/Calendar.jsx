import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'

function Calendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCalendarEvents()
  }, [])

  const fetchCalendarEvents = async () => {
    try {
      // Fetch from Google Calendar iCal feed (converted to JSON)
      const response = await fetch('/api/calendar/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        // Fallback to sample events
        setEvents(getSampleEvents())
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      setEvents(getSampleEvents())
    } finally {
      setLoading(false)
    }
  }

  const getSampleEvents = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15)

    return [
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
      },
      {
        id: '3',
        title: 'Factory Maintenance',
        start: nextWeek.toISOString().split('T')[0],
        backgroundColor: '#FF6A00',
        borderColor: '#FF6A00',
        textColor: '#FFFFFF'
      },
      {
        id: '4',
        title: 'Team Meeting',
        start: nextMonth.toISOString().split('T')[0],
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        textColor: '#FFFFFF'
      }
    ]
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5" />
            <span>Company Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading calendar...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="w-5 h-5" />
          <span>Company Calendar</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth'
            }}
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkClick="popover"
            eventTextColor="#FFFFFF"
            themeSystem="standard"
          />
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>AU Holidays</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>TH Holidays</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Factory Events</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Calendar

