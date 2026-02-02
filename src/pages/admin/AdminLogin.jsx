import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminStore } from '../../store/adminStore'
import { useLanguage } from '../../context/LanguageContext'
import toast from 'react-hot-toast'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAdminStore()
  const { language, t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000))

    const result = login(email, password)
    
    if (result.success) {
      toast.success(language === 'en' ? 'Welcome back!' : 'مرحباً بعودتك!')
      navigate('/admin/dashboard')
    } else {
      toast.error(language === 'en' ? 'Invalid credentials' : 'بيانات غير صحيحة')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo with Yellow Background */}
        <div className="text-center mb-8">
          <div className="bg-primary rounded-xl p-4 inline-block mb-4">
            <img src="/logo.png" alt="ALBASEET" className="h-14 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('admin.login')}</h1>
          <p className="text-dark-600 mt-2">
            {language === 'en' ? 'Sign in to manage your store' : 'سجل دخول لإدارة متجرك'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-dark-100 rounded-2xl p-8 border border-dark-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">
                {t('admin.email')}
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-200 text-white pl-12 pr-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="admin@albaseet.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">
                {t('admin.password')}
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-200 text-white pl-12 pr-12 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-600 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-400 text-dark font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                t('admin.signIn')
              )}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-dark-200 rounded-lg">
            <p className="text-dark-600 text-sm text-center mb-2">
              {language === 'en' ? 'Demo Credentials:' : 'بيانات تجريبية:'}
            </p>
            <p className="text-white text-sm text-center font-mono">
              admin@albaseet.com / Albaseet@2024
            </p>
          </div>
        </div>

        {/* Back to Store */}
        <p className="text-center mt-6">
          <a href="/" className="text-dark-600 hover:text-primary transition-colors">
            {language === 'en' ? '← Back to Store' : '→ العودة للمتجر'}
          </a>
        </p>
      </motion.div>
    </div>
  )
}
