import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '../../context/LanguageContext'
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi'

export default function CategoryCard({ category, index = 0, large = false }) {
  const { language } = useLanguage()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const Arrow = language === 'ar' ? HiArrowLeft : HiArrowRight

  // Category images (placeholder gradients as we don't have actual images)
  const categoryGradients = {
    padel: 'from-yellow-500 to-orange-600',
    football: 'from-green-500 to-emerald-600',
    swimming: 'from-blue-500 to-cyan-600',
    tennis: 'from-lime-500 to-green-600',
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`group ${large ? 'md:col-span-2' : ''}`}
    >
      <Link to={`/category/${category.id}`}>
        <div className={`category-card relative overflow-hidden rounded-2xl ${large ? 'h-80 md:h-96' : 'h-64'}`}>
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[category.id]} opacity-80`} />
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`pattern-${category.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#pattern-${category.id})`} />
            </svg>
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
            >
              <h3 className={`text-white font-display tracking-wider mb-2 ${large ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
                {category.name[language].toUpperCase()}
              </h3>
              
              <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                <span className="font-medium">
                  {language === 'en' ? 'Shop Now' : 'تسوق الآن'}
                </span>
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: language === 'ar' ? -5 : 5 }}
                  className="transform group-hover:translate-x-1 transition-transform"
                >
                  <Arrow className="w-5 h-5" />
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
      </Link>
    </motion.div>
  )
}
