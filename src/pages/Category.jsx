import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useProductStore, categories, subcategories } from '../store/productStore'
import ProductCard from '../components/ui/ProductCard'
import AnimatedSection, { SectionTitle } from '../components/ui/AnimatedSection'
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi'

export default function Category() {
  const { categoryId, subcategoryId } = useParams()
  const { language, t } = useLanguage()
  const { getProductsByCategory } = useProductStore()

  const category = categories.find(c => c.id === categoryId)
  const products = useMemo(
    () => getProductsByCategory(categoryId, subcategoryId),
    [categoryId, subcategoryId, getProductsByCategory]
  )

  const Chevron = language === 'ar' ? HiChevronLeft : HiChevronRight

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Category not found</h1>
          <Link to="/" className="text-primary hover:underline">
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    )
  }

  // Category gradients
  const categoryGradients = {
    padel: 'from-yellow-500/20 to-orange-600/20',
    football: 'from-green-500/20 to-emerald-600/20',
    swimming: 'from-blue-500/20 to-cyan-600/20',
    tennis: 'from-lime-500/20 to-green-600/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-20"
    >
      {/* Hero Banner */}
      <section className={`relative py-20 bg-gradient-to-r ${categoryGradients[categoryId]}`}>
        <div className="container mx-auto px-4">
          <AnimatedSection>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-dark-600 mb-6">
              <Link to="/" className="hover:text-primary transition-colors">
                {t('nav.home')}
              </Link>
              <Chevron className="w-4 h-4" />
              <Link to="/products" className="hover:text-primary transition-colors">
                {t('nav.shop')}
              </Link>
              <Chevron className="w-4 h-4" />
              <span className="text-primary">{category.name[language]}</span>
              {subcategoryId && (
                <>
                  <Chevron className="w-4 h-4" />
                  <span className="text-primary">{subcategories[subcategoryId]?.[language]}</span>
                </>
              )}
            </nav>

            <h1 className="text-5xl md:text-7xl font-display tracking-wider text-white">
              {category.name[language].toUpperCase()}
            </h1>
            {subcategoryId && (
              <p className="text-xl text-dark-600 mt-4">
                {subcategories[subcategoryId]?.[language]}
              </p>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Subcategory Navigation */}
      <section className="py-8 border-b border-dark-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/category/${categoryId}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !subcategoryId
                  ? 'bg-primary text-dark'
                  : 'bg-dark-200 text-white hover:bg-dark-300'
              }`}
            >
              {t('categories.all')}
            </Link>
            {category.subcategories.map((subId) => (
              <Link
                key={subId}
                to={`/category/${categoryId}/${subId}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  subcategoryId === subId
                    ? 'bg-primary text-dark'
                    : 'bg-dark-200 text-white hover:bg-dark-300'
                }`}
              >
                {subcategories[subId]?.[language]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-dark-600">
                  {products.length} {language === 'en' ? 'products' : 'منتج'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl text-white mb-4">{t('common.noResults')}</h2>
              <p className="text-dark-600 mb-8">
                {language === 'en'
                  ? 'No products found in this category yet.'
                  : 'لم يتم العثور على منتجات في هذا القسم بعد.'}
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                {t('common.viewAll')}
                <Chevron className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}
