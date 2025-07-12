import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const timezones = [
  { name: 'Melbourne', timezone: 'Australia/Melbourne', flag: '🇦🇺' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
  { name: 'Phuket', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
  { name: 'Rayong', timezone: 'Asia/Bangkok', flag: '🇹🇭' }
]

function WorldClock() {
  const [times, setTimes] = useState({})

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {}
      timezones.forEach(tz => {
        const now = new Date()
        const timeString = now.toLocaleTimeString('en-US', {
          timeZone: tz.timezone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        })
        newTimes[tz.name] = timeString
      })
      setTimes(newTimes)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-4 text-sm">
      <Clock className="w-4 h-4 text-muted-foreground" />
      <div className="flex space-x-4">
        {timezones.map((tz) => (
          <div key={tz.name} className="flex items-center space-x-1">
            <span>{tz.flag}</span>
            <span className="font-mono">{times[tz.name] || '--:--'}</span>
            <span className="text-muted-foreground text-xs">{tz.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorldClock

