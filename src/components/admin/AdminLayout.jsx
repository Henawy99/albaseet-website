import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminStore } from '../../store/adminStore'
import { useLanguage } from '../../context/LanguageContext'
import { 
  HiOutlineViewGrid, 
  HiOutlineShoppingBag, 
  HiOutlinePlus,
  HiOutlineUpload,
  HiOutlineLogout,
  HiOutlineGlobe
} from 'react-icons/hi'

export default function AdminLayout({ children }) {
  const { isAuthenticated, logout } = useAdminStore()
  const { language, toggleLanguage, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: HiOutlineViewGrid, label: t('admin.dashboard') },
    { path: '/admin/products', icon: HiOutlineShoppingBag, label: t('admin.products') },
    { path: '/admin/products/add', icon: HiOutlinePlus, label: t('admin.addProduct') },
    { path: '/admin/bulk-upload', icon: HiOutlineUpload, label: t('admin.bulkUpload') },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-100 border-r border-dark-200 flex flex-col">
      {/* Logo & Back to Website */}
      <div className="p-6 border-b border-dark-200">
        <Link to="/" className="inline-block">
          <div className="bg-primary rounded-lg p-2">
            <img src="/logo.png" alt="ALBASEET" className="h-10 w-auto" />
          </div>
        </Link>
        <p className="text-dark-600 text-sm mt-2">{language === 'en' ? 'Admin Panel' : 'لوحة التحكم'}</p>
        <Link 
          to="/" 
          className="mt-3 flex items-center gap-2 text-primary hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {language === 'en' ? 'Back to Website' : 'العودة للموقع'}
        </Link>
      </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`admin-sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-dark-600 hover:text-white hover:bg-dark-200'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-dark-200 space-y-2">
          {/* Language Switcher - More Prominent */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HiOutlineGlobe className="w-5 h-5" />
              <span className="font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
            </div>
            <span className="text-xs bg-primary text-dark px-2 py-1 rounded">
              {language === 'en' ? 'EN' : 'AR'}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
