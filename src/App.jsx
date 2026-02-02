import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLanguage } from './context/LanguageContext'
import { useAnalyticsStore } from './store/analyticsStore'

// Layout
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/ui/WhatsAppButton'

// Pages
import Home from './pages/Home'
import Category from './pages/Category'
import Product from './pages/Product'
import Contact from './pages/Contact'
import AllProducts from './pages/AllProducts'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminAddProduct from './pages/admin/AdminAddProduct'
import AdminBulkUpload from './pages/admin/AdminBulkUpload'
import AdminLayout from './components/admin/AdminLayout'

function AnimatedRoutes() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/category/:categoryId/:subcategoryId" element={<Category />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/products/add" element={<AdminLayout><AdminAddProduct /></AdminLayout>} />
        <Route path="/admin/products/edit/:productId" element={<AdminLayout><AdminAddProduct /></AdminLayout>} />
        <Route path="/admin/bulk-upload" element={<AdminLayout><AdminBulkUpload /></AdminLayout>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-sans'}>
      <Router>
        <AppContent />
      </Router>
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const { trackPageView } = useAnalyticsStore()

  // Track page views (only for non-admin pages)
  useEffect(() => {
    if (!isAdminRoute) {
      trackPageView(location.pathname)
    }
  }, [location.pathname, isAdminRoute, trackPageView])

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={!isAdminRoute ? 'min-h-screen' : ''}>
        <AnimatedRoutes />
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </>
  )
}

export default App
