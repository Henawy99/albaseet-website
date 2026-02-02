import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useCart } from '../../context/CartContext'
import { categories } from '../../store/productStore'
import { 
  HiOutlineShoppingBag, 
  HiOutlineHeart, 
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineGlobe
} from 'react-icons/hi'

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage()
  const { cartItemsCount, wishlist } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-dark/95 backdrop-blur-md shadow-lg shadow-primary/5' 
            : 'bg-transparent'
        }`}
      >
        {/* Top Bar */}
        <div className="hidden md:block bg-dark-100 border-b border-dark-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-10 text-sm">
              <span className="text-dark-600">
                {language === 'en' ? 'Free shipping on orders over 1000 EGP' : 'شحن مجاني للطلبات أكثر من 1000 جنيه'}
              </span>
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-dark-600 hover:text-primary transition-colors"
              >
                <HiOutlineGlobe className="w-4 h-4" />
                {language === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Made to Stand Out with Yellow Background */}
            <Link to="/" className="flex items-center gap-3 z-50">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="bg-primary rounded-lg p-2 shadow-lg shadow-primary/30">
                  <img 
                    src="/logo.png" 
                    alt="ALBASEET" 
                    className="h-10 md:h-12 w-auto"
                  />
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link 
                to="/" 
                className="nav-link text-white hover:text-primary transition-colors font-medium"
              >
                {t('nav.home')}
              </Link>
              
              {/* Categories Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('categories')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-link text-white hover:text-primary transition-colors font-medium flex items-center gap-1">
                  {t('nav.categories')}
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'categories' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-dark-100 border border-dark-200 rounded-lg shadow-xl overflow-hidden"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-dark-200 transition-colors group/item"
                        >
                          <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          <span className="text-white group-hover/item:text-primary transition-colors">
                            {category.name[language]}
                          </span>
                        </Link>
                      ))}
                      <div className="border-t border-dark-200">
                        <Link
                          to="/products"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-dark-200 transition-colors text-primary font-medium"
                        >
                          {t('common.viewAll')}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                to="/products" 
                className="nav-link text-white hover:text-primary transition-colors font-medium"
              >
                {t('nav.shop')}
              </Link>
              <Link 
                to="/contact" 
                className="nav-link text-white hover:text-primary transition-colors font-medium"
              >
                {t('nav.contact')}
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-white hover:text-primary transition-colors"
              >
                <HiOutlineSearch className="w-6 h-6" />
              </motion.button>

              {/* Wishlist */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Link to="/wishlist" className="p-2 text-white hover:text-primary transition-colors block">
                  <HiOutlineHeart className="w-6 h-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-dark text-xs font-bold rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </motion.div>

              {/* Cart */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Link to="/cart" className="p-2 text-white hover:text-primary transition-colors block">
                  <HiOutlineShoppingBag className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-dark text-xs font-bold rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </motion.div>

              {/* Language Toggle (Mobile) */}
              <button 
                onClick={toggleLanguage}
                className="lg:hidden p-2 text-white hover:text-primary transition-colors"
              >
                <HiOutlineGlobe className="w-6 h-6" />
              </button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-primary transition-colors"
              >
                {isMobileMenuOpen ? (
                  <HiOutlineX className="w-6 h-6" />
                ) : (
                  <HiOutlineMenu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-dark/95 backdrop-blur-md flex items-start justify-center pt-32"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl px-4"
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('nav.search')}
                    className="w-full bg-dark-100 border-2 border-primary text-white text-xl px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/30"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-white transition-colors"
                  >
                    <HiOutlineSearch className="w-6 h-6" />
                  </button>
                </div>
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="mt-6 text-dark-600 hover:text-white transition-colors mx-auto block"
              >
                {language === 'en' ? 'Press ESC to close' : 'اضغط ESC للإغلاق'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? -300 : 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: language === 'ar' ? -300 : 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-y-0 right-0 z-[55] w-80 bg-dark-100 shadow-2xl lg:hidden"
            style={{ [language === 'ar' ? 'left' : 'right']: 0, [language === 'ar' ? 'right' : 'left']: 'auto' }}
          >
            <div className="flex flex-col h-full pt-24 pb-8 px-6">
              <nav className="flex flex-col gap-2">
                <Link 
                  to="/" 
                  className="px-4 py-3 text-lg text-white hover:text-primary hover:bg-dark-200 rounded-lg transition-all"
                >
                  {t('nav.home')}
                </Link>
                
                <div className="border-t border-dark-200 my-2" />
                
                <span className="px-4 py-2 text-sm text-dark-600 font-medium uppercase tracking-wider">
                  {t('nav.categories')}
                </span>
                
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="px-4 py-3 text-white hover:text-primary hover:bg-dark-200 rounded-lg transition-all flex items-center gap-3"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {category.name[language]}
                  </Link>
                ))}
                
                <div className="border-t border-dark-200 my-2" />
                
                <Link 
                  to="/products" 
                  className="px-4 py-3 text-lg text-white hover:text-primary hover:bg-dark-200 rounded-lg transition-all"
                >
                  {t('nav.shop')}
                </Link>
                <Link 
                  to="/contact" 
                  className="px-4 py-3 text-lg text-white hover:text-primary hover:bg-dark-200 rounded-lg transition-all"
                >
                  {t('nav.contact')}
                </Link>
              </nav>
              
              <div className="mt-auto">
                <Link 
                  to="/admin" 
                  className="block px-4 py-3 text-sm text-dark-600 hover:text-primary transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
