import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useProductStore, categories } from '../store/productStore'
import ProductCard from '../components/ui/ProductCard'
import CategoryCard from '../components/ui/CategoryCard'
import Button from '../components/ui/Button'
import AnimatedSection, { SectionTitle, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection'
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi'

export default function Home() {
  const { language, t } = useLanguage()
  const { getFeaturedProducts, getNewProducts } = useProductStore()
  
  const featuredProducts = getFeaturedProducts()
  const newProducts = getNewProducts()
  const Arrow = language === 'ar' ? HiArrowLeft : HiArrowRight

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-pattern">
          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Animated Logo with Yellow Background */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="mb-8"
              >
                <div className="bg-primary rounded-2xl p-4 md:p-6 shadow-2xl shadow-primary/50 inline-block animate-float">
                  <img 
                    src="/logo.png" 
                    alt="ALBASEET" 
                    className="h-20 md:h-28 w-auto"
                  />
                </div>
              </motion.div>

              {/* Brand Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-dark-100 border border-primary/30 rounded-full px-4 py-2 mb-8"
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-dark-600">
                  {language === 'en' ? 'Premium Sports Equipment' : 'معدات رياضية فاخرة'}
                </span>
              </motion.div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display tracking-wider mb-6">
                <span className="hero-text">{t('hero.title')}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-dark-600 mb-10 max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  to="/products"
                  size="lg"
                  icon={<Arrow className="w-5 h-5" />}
                  iconPosition="right"
                >
                  {t('hero.cta')}
                </Button>
                <Button
                  to="/category/padel"
                  variant="outline"
                  size="lg"
                >
                  {t('hero.explore')}
                </Button>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 border-2 border-dark-400 rounded-full flex justify-center pt-2"
              >
                <div className="w-1 h-2 bg-primary rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-dark">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={language === 'en' ? 'SHOP BY SPORT' : 'تسوق حسب الرياضة'}
            subtitle={language === 'en' ? 'Find the perfect gear for your game' : 'اعثر على المعدات المثالية للعبتك'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                large={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-dark-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-display tracking-wider text-white">
                {language === 'en' ? 'FEATURED PRODUCTS' : 'منتجات مميزة'}
              </h2>
              <p className="text-dark-600 mt-2">
                {language === 'en' ? 'Top picks for champions' : 'أفضل الاختيارات للأبطال'}
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <Link 
                to="/products"
                className="flex items-center gap-2 text-primary hover:text-white transition-colors group"
              >
                {t('common.viewAll')}
                <Arrow className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-yellow-400" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="banner-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="black" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#banner-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-4xl md:text-6xl font-display tracking-wider text-dark mb-6">
                {language === 'en' ? 'GEAR UP FOR GREATNESS' : 'جهّز نفسك للعظمة'}
              </h2>
              <p className="text-dark/70 text-lg mb-8">
                {language === 'en' 
                  ? 'Premium quality sports equipment for every athlete'
                  : 'معدات رياضية بجودة عالية لكل رياضي'}
              </p>
              <Button to="/products" variant="white" size="lg">
                {language === 'en' ? 'Explore Collection' : 'استكشف المجموعة'}
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-display tracking-wider text-white">
                {language === 'en' ? 'NEW ARRIVALS' : 'وصل حديثاً'}
              </h2>
              <p className="text-dark-600 mt-2">
                {language === 'en' ? 'Fresh gear just landed' : 'معدات جديدة وصلت للتو'}
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <Link 
                to="/products?filter=new"
                className="flex items-center gap-2 text-primary hover:text-white transition-colors group"
              >
                {t('common.viewAll')}
                <Arrow className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-100">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚚',
                title: { en: 'Fast Delivery', ar: 'توصيل سريع' },
                desc: { en: 'Quick delivery across Egypt', ar: 'توصيل سريع في جميع أنحاء مصر' },
              },
              {
                icon: '✨',
                title: { en: 'Premium Quality', ar: 'جودة عالية' },
                desc: { en: 'Only the best sports equipment', ar: 'أفضل المعدات الرياضية فقط' },
              },
              {
                icon: '💬',
                title: { en: 'WhatsApp Support', ar: 'دعم واتساب' },
                desc: { en: 'Order easily via WhatsApp', ar: 'اطلب بسهولة عبر واتساب' },
              },
            ].map((feature, index) => (
              <StaggerItem key={index}>
                <div className="text-center p-8 bg-dark-200 rounded-2xl hover:bg-dark-300 transition-colors">
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title[language]}
                  </h3>
                  <p className="text-dark-600">{feature.desc[language]}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </motion.div>
  )
}
