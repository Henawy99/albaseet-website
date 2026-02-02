import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Generate unique visitor ID
const generateVisitorId = () => {
  return 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Get today's date as string
const getTodayString = () => {
  return new Date().toISOString().split('T')[0]
}

// Get current hour
const getCurrentHour = () => {
  return new Date().getHours()
}

export const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      // Visitor data
      visitorId: null,
      visits: [], // Array of { date, hour, page, timestamp }
      dailyStats: {}, // { '2024-01-15': { visitors: Set, pageViews: 10 } }
      
      // Initialize visitor
      initVisitor: () => {
        let visitorId = get().visitorId
        if (!visitorId) {
          visitorId = generateVisitorId()
          set({ visitorId })
        }
        return visitorId
      },
      
      // Track page view
      trackPageView: (page = '/') => {
        const visitorId = get().initVisitor()
        const today = getTodayString()
        const hour = getCurrentHour()
        const timestamp = Date.now()
        
        // Add visit
        const newVisit = { date: today, hour, page, timestamp, visitorId }
        
        set(state => {
          // Update daily stats
          const dailyStats = { ...state.dailyStats }
          if (!dailyStats[today]) {
            dailyStats[today] = { 
              uniqueVisitors: [], 
              pageViews: 0,
              hourlyViews: {}
            }
          }
          
          // Add unique visitor
          if (!dailyStats[today].uniqueVisitors.includes(visitorId)) {
            dailyStats[today].uniqueVisitors.push(visitorId)
          }
          
          // Increment page views
          dailyStats[today].pageViews++
          
          // Track hourly views
          if (!dailyStats[today].hourlyViews[hour]) {
            dailyStats[today].hourlyViews[hour] = 0
          }
          dailyStats[today].hourlyViews[hour]++
          
          return {
            visits: [...state.visits.slice(-1000), newVisit], // Keep last 1000 visits
            dailyStats
          }
        })
      },
      
      // Get today's stats
      getTodayStats: () => {
        const today = getTodayString()
        const stats = get().dailyStats[today]
        if (!stats) {
          return { uniqueVisitors: 0, pageViews: 0 }
        }
        return {
          uniqueVisitors: stats.uniqueVisitors.length,
          pageViews: stats.pageViews
        }
      },
      
      // Get yesterday's stats
      getYesterdayStats: () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toISOString().split('T')[0]
        const stats = get().dailyStats[yesterdayString]
        if (!stats) {
          return { uniqueVisitors: 0, pageViews: 0 }
        }
        return {
          uniqueVisitors: stats.uniqueVisitors.length,
          pageViews: stats.pageViews
        }
      },
      
      // Get this week's stats
      getWeekStats: () => {
        const dailyStats = get().dailyStats
        const today = new Date()
        let totalVisitors = 0
        let totalPageViews = 0
        const uniqueVisitorsSet = new Set()
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateString = date.toISOString().split('T')[0]
          const stats = dailyStats[dateString]
          if (stats) {
            stats.uniqueVisitors.forEach(v => uniqueVisitorsSet.add(v))
            totalPageViews += stats.pageViews
          }
        }
        
        return {
          uniqueVisitors: uniqueVisitorsSet.size,
          pageViews: totalPageViews
        }
      },
      
      // Get last 7 days data for chart
      getLast7DaysData: () => {
        const dailyStats = get().dailyStats
        const data = []
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateString = date.toISOString().split('T')[0]
          const stats = dailyStats[dateString]
          
          data.push({
            date: dateString,
            day: date.toLocaleDateString('en', { weekday: 'short' }),
            visitors: stats?.uniqueVisitors?.length || 0,
            pageViews: stats?.pageViews || 0
          })
        }
        
        return data
      },
      
      // Clear old data (keep last 30 days)
      cleanupOldData: () => {
        const dailyStats = { ...get().dailyStats }
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - 30)
        
        Object.keys(dailyStats).forEach(date => {
          if (new Date(date) < cutoffDate) {
            delete dailyStats[date]
          }
        })
        
        set({ dailyStats })
      }
    }),
    {
      name: 'albaseet-analytics',
    }
  )
)
