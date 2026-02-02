import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useProductStore, categories } from '../../store/productStore'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { 
  HiOutlineShoppingBag, 
  HiOutlineCollection, 
  HiOutlineExclamation,
  HiOutlineTrendingUp,
  HiOutlinePlus,
  HiOutlineUpload,
  HiOutlineEye,
  HiOutlineUsers,
  HiOutlineChartBar
} from 'react-icons/hi'

export default function AdminDashboard() {
  const { language, t } = useLanguage()
  const { getAllProducts, getLowStockProducts, getOutOfStockProducts } = useProductStore()
  const { getTodayStats, getYesterdayStats, getWeekStats, getLast7DaysData } = useAnalyticsStore()

  const products = getAllProducts()
  const lowStockProducts = getLowStockProducts()
  const outOfStockProducts = getOutOfStockProducts()
  
  // Analytics data
  const todayStats = getTodayStats()
  const yesterdayStats = getYesterdayStats()
  const weekStats = getWeekStats()
  const last7Days = getLast7DaysData()

  // Calculate visitor change
  const visitorChange = todayStats.uniqueVisitors - yesterdayStats.uniqueVisitors

  const stats = [
    {
      label: language === 'en' ? 'Visitors Today' : 'زوار اليوم',
      value: todayStats.uniqueVisitors,
      icon: HiOutlineUsers,
      color: 'from-green-500 to-emerald-400',
      change: visitorChange,
    },
    {
      label: language === 'en' ? 'Page Views Today' : 'مشاهدات اليوم',
      value: todayStats.pageViews,
      icon: HiOutlineEye,
      color: 'from-purple-500 to-pink-400',
    },
    {
      label: t('admin.totalProducts'),
      value: products.length,
      icon: HiOutlineShoppingBag,
      color: 'from-primary to-yellow-400',
      link: '/admin/products',
    },
    {
      label: t('admin.lowStock'),
      value: lowStockProducts.length,
      icon: HiOutlineExclamation,
      color: 'from-orange-500 to-red-500',
      warning: lowStockProducts.length > 0,
    },
  ]

  const quickActions = [
    {
      label: t('admin.addProduct'),
      icon: HiOutlinePlus,
      link: '/admin/products/add',
      color: 'bg-primary hover:bg-yellow-400 text-dark',
    },
    {
      label: t('admin.bulkUpload'),
      icon: HiOutlineUpload,
      link: '/admin/bulk-upload',
      color: 'bg-dark-200 hover:bg-dark-300 text-white',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('admin.dashboard')}
        </h1>
        <p className="text-dark-600">
          {language === 'en' 
            ? 'Welcome back! Here\'s an overview of your store.'
            : 'مرحباً بعودتك! إليك نظرة عامة على متجرك.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {stat.link ? (
              <Link to={stat.link} className="block">
                <StatCard stat={stat} />
              </Link>
            ) : (
              <StatCard stat={stat} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-100 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-yellow-400 rounded-lg flex items-center justify-center">
              <HiOutlineChartBar className="w-5 h-5 text-dark" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {language === 'en' ? 'Website Traffic' : 'حركة الموقع'}
              </h2>
              <p className="text-dark-600 text-sm">
                {language === 'en' ? 'Last 7 days' : 'آخر 7 أيام'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{weekStats.pageViews}</p>
            <p className="text-dark-600 text-sm">
              {language === 'en' ? 'Total views' : 'إجمالي المشاهدات'}
            </p>
          </div>
        </div>
        
        <MiniBarChart data={last7Days} language={language} />
        
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-dark-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{weekStats.uniqueVisitors}</p>
            <p className="text-dark-600 text-sm">
              {language === 'en' ? 'Weekly Visitors' : 'زوار الأسبوع'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{yesterdayStats.pageViews}</p>
            <p className="text-dark-600 text-sm">
              {language === 'en' ? 'Yesterday' : 'أمس'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{todayStats.pageViews}</p>
            <p className="text-dark-600 text-sm">
              {language === 'en' ? 'Today' : 'اليوم'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Link to={action.link}>
              <div className={`${action.color} rounded-2xl p-6 flex items-center gap-4 transition-colors`}>
                <action.icon className="w-8 h-8" />
                <span className="text-lg font-bold">{action.label}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-dark-100 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {language === 'en' ? 'Recent Products' : 'المنتجات الأخيرة'}
            </h2>
            <Link to="/admin/products" className="text-primary hover:underline text-sm">
              {t('common.viewAll')}
            </Link>
          </div>
          
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-dark-200 rounded-lg">
                <div className="w-12 h-12 bg-dark-300 rounded-lg flex items-center justify-center text-2xl">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {product.name[language]}
                  </p>
                  <p className="text-dark-600 text-sm">{product.articleNumber}</p>
                </div>
                <span className="text-primary font-bold">
                  {product.price.toLocaleString()} {t('common.currency')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-dark-100 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {language === 'en' ? 'Low Stock Alert' : 'تنبيه المخزون المنخفض'}
            </h2>
            {lowStockProducts.length > 0 && (
              <span className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-sm">
                {lowStockProducts.length} {language === 'en' ? 'items' : 'منتج'}
              </span>
            )}
          </div>
          
          {lowStockProducts.length > 0 ? (
            <div className="space-y-4">
              {lowStockProducts.slice(0, 5).map((product) => {
                const lowStockSizes = product.sizes.filter(s => s.stock <= 5 && s.stock > 0)
                return (
                  <div key={product.id} className="flex items-center gap-4 p-3 bg-dark-200 rounded-lg">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <HiOutlineExclamation className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {product.name[language]}
                      </p>
                      <p className="text-dark-600 text-sm">
                        {lowStockSizes.map(s => `${s.size}: ${s.stock}`).join(', ')}
                      </p>
                    </div>
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      {language === 'en' ? 'Edit' : 'تعديل'}
                    </Link>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl block mb-4">✅</span>
              <p className="text-dark-600">
                {language === 'en' ? 'All products have sufficient stock!' : 'جميع المنتجات لديها مخزون كافٍ!'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ stat }) {
  return (
    <div className="bg-dark-100 rounded-2xl p-6 hover:bg-dark-200/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
        {stat.warning && (
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
        {stat.change !== undefined && (
          <span className={`text-sm font-medium px-2 py-1 rounded ${
            stat.change > 0 
              ? 'bg-green-500/20 text-green-400' 
              : stat.change < 0 
              ? 'bg-red-500/20 text-red-400'
              : 'bg-dark-300 text-dark-600'
          }`}>
            {stat.change > 0 ? '+' : ''}{stat.change}
          </span>
        )}
      </div>
      <p className="text-dark-600 text-sm mb-1">{stat.label}</p>
      <p className="text-3xl font-bold text-white">{stat.value}</p>
    </div>
  )
}

// Simple Bar Chart Component
function MiniBarChart({ data, language }) {
  const maxValue = Math.max(...data.map(d => d.pageViews), 1)
  
  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((day, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-dark-300 rounded-t relative" style={{ height: '100%' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(day.pageViews / maxValue) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-yellow-400 rounded-t"
            />
          </div>
          <span className="text-xs text-dark-600">{day.day}</span>
        </div>
      ))}
    </div>
  )
}
