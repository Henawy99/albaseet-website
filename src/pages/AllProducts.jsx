import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useProductStore, categories, subcategories } from '../store/productStore'
import ProductCard from '../components/ui/ProductCard'
import AnimatedSection from '../components/ui/AnimatedSection'
import { HiOutlineFilter, HiOutlineSortDescending, HiX } from 'react-icons/hi'

export default function AllProducts() {
  const [searchParams] = useSearchParams()
  const { language, t } = useLanguage()
  const { getAllProducts, searchProducts } = useProductStore()
  
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const searchQuery = searchParams.get('search') || ''
  const filterNew = searchParams.get('filter') === 'new'

  const allProducts = useMemo(() => {
    let products = searchQuery 
      ? searchProducts(searchQuery, language)
      : getAllProducts()
    
    // Filter new products
    if (filterNew) {
      products = products.filter(p => p.isNew)
    }

    // Filter by category
    if (selectedCategory) {
      products = products.filter(p => p.category === selectedCategory)
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      products = products.filter(p => p.subcategory === selectedSubcategory)
    }

    // Filter by price range
    if (priceRange.min) {
      products = products.filter(p => p.price >= Number(priceRange.min))
    }
    if (priceRange.max) {
      products = products.filter(p => p.price <= Number(priceRange.max))
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products = [...products].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products = [...products].sort((a, b) => b.price - a.price)
        break
      case 'name':
        products = [...products].sort((a, b) => 
          a.name[language].localeCompare(b.name[language])
        )
        break
      case 'newest':
      default:
        // Keep original order (newest first)
        break
    }

    return products
  }, [searchQuery, filterNew, selectedCategory, selectedSubcategory, sortBy, priceRange, language, getAllProducts, searchProducts])

  const currentCategory = categories.find(c => c.id === selectedCategory)

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedSubcategory('')
    setPriceRange({ min: '', max: '' })
    setSortBy('newest')
  }

  const hasActiveFilters = selectedCategory || selectedSubcategory || priceRange.min || priceRange.max

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-20"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display tracking-wider text-white mb-4">
            {searchQuery 
              ? `${language === 'en' ? 'Search Results for' : 'نتائج البحث عن'} "${searchQuery}"`
              : filterNew
              ? language === 'en' ? 'NEW ARRIVALS' : 'وصل حديثاً'
              : t('categories.all').toUpperCase()}
          </h1>
          <p className="text-dark-600">
            {allProducts.length} {language === 'en' ? 'products found' : 'منتج'}
          </p>
        </AnimatedSection>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-dark-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors text-white"
            >
              <HiOutlineFilter className="w-5 h-5" />
              {t('common.filter')}
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-dark-600 hover:text-primary transition-colors text-sm"
              >
                <HiX className="w-4 h-4" />
                {language === 'en' ? 'Clear filters' : 'مسح الفلاتر'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <HiOutlineSortDescending className="w-5 h-5 text-dark-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-200 text-white px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">{t('common.sortByNewest')}</option>
              <option value="price-asc">{t('common.sortByPrice')}</option>
              <option value="price-desc">{t('common.sortByPriceDesc')}</option>
              <option value="name">{t('common.sortByName')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatedSection
            direction="left"
            className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-dark-100 rounded-2xl p-6 sticky top-32">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-white font-bold mb-4">{t('nav.categories')}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setSelectedSubcategory('')
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory
                        ? 'bg-primary text-dark'
                        : 'text-dark-600 hover:text-white hover:bg-dark-200'
                    }`}
                  >
                    {t('categories.all')}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setSelectedSubcategory('')
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-dark'
                          : 'text-dark-600 hover:text-white hover:bg-dark-200'
                      }`}
                    >
                      {category.name[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {currentCategory && (
                <div className="mb-6">
                  <h3 className="text-white font-bold mb-4">
                    {language === 'en' ? 'Subcategory' : 'القسم الفرعي'}
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedSubcategory('')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedSubcategory
                          ? 'bg-dark-300 text-white'
                          : 'text-dark-600 hover:text-white hover:bg-dark-200'
                      }`}
                    >
                      {t('categories.all')}
                    </button>
                    {currentCategory.subcategories.map((subId) => (
                      <button
                        key={subId}
                        onClick={() => setSelectedSubcategory(subId)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedSubcategory === subId
                            ? 'bg-dark-300 text-white'
                            : 'text-dark-600 hover:text-white hover:bg-dark-200'
                        }`}
                      >
                        {subcategories[subId]?.[language]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h3 className="text-white font-bold mb-4">
                  {language === 'en' ? 'Price Range' : 'نطاق السعر'}
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={language === 'en' ? 'Min' : 'من'}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full bg-dark-200 text-white px-3 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder={language === 'en' ? 'Max' : 'إلى'}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full bg-dark-200 text-white px-3 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="text-dark-600 text-sm mt-2">{t('common.currency')}</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Products Grid */}
          <div className="flex-1">
            {allProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {allProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🔍</div>
                <h2 className="text-2xl text-white mb-4">{t('common.noResults')}</h2>
                <p className="text-dark-600">
                  {language === 'en'
                    ? 'Try adjusting your filters or search term.'
                    : 'حاول تعديل الفلاتر أو مصطلح البحث.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
