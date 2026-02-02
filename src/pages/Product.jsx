import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { useProductStore, categories, subcategories } from '../store/productStore'
import ProductCard from '../components/ui/ProductCard'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import Button from '../components/ui/Button'
import AnimatedSection from '../components/ui/AnimatedSection'
import toast from 'react-hot-toast'
import { 
  HiChevronRight, 
  HiChevronLeft, 
  HiOutlineHeart, 
  HiHeart,
  HiOutlineShoppingBag,
  HiCheck
} from 'react-icons/hi'

export default function Product() {
  const { productId } = useParams()
  const { language, t } = useLanguage()
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart()
  const { getProductById, getProductsByCategory } = useProductStore()

  const product = getProductById(productId)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)

  const Chevron = language === 'ar' ? HiChevronLeft : HiChevronRight

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return getProductsByCategory(product.category)
      .filter(p => p.id !== product.id)
      .slice(0, 4)
  }, [product, getProductsByCategory])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">
            {language === 'en' ? 'Product not found' : 'المنتج غير موجود'}
          </h1>
          <Link to="/" className="text-primary hover:underline">
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    )
  }

  const isWishlisted = isInWishlist(product.id)
  const category = categories.find(c => c.id === product.category)
  const selectedSizeStock = product.sizes.find(s => s.size === selectedSize)?.stock || 0
  const hasStock = product.sizes.some(s => s.stock > 0)

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(language === 'en' ? 'Please select a size' : 'يرجى اختيار المقاس')
      return
    }
    
    setIsAdding(true)
    setTimeout(() => {
      addToCart(product, selectedSize)
      toast.success(language === 'en' ? 'Added to cart!' : 'تمت الإضافة للسلة!')
      setIsAdding(false)
    }, 500)
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success(language === 'en' ? 'Removed from wishlist' : 'تم الحذف من المفضلة')
    } else {
      addToWishlist(product)
      toast.success(language === 'en' ? 'Added to wishlist!' : 'تمت الإضافة للمفضلة!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-20"
    >
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <AnimatedSection>
          <nav className="flex items-center gap-2 text-sm text-dark-600 mb-8 flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Chevron className="w-4 h-4" />
            <Link to="/products" className="hover:text-primary transition-colors">
              {t('nav.shop')}
            </Link>
            <Chevron className="w-4 h-4" />
            <Link to={`/category/${product.category}`} className="hover:text-primary transition-colors">
              {category?.name[language]}
            </Link>
            <Chevron className="w-4 h-4" />
            <span className="text-white">{product.name[language]}</span>
          </nav>
        </AnimatedSection>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <AnimatedSection direction="left">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-dark-100 rounded-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full bg-dark-200 flex items-center justify-center"
                  >
                    {product.images[selectedImage] ? (
                      <img
                        src={product.images[selectedImage]}
                        alt={product.name[language]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-dark-600 text-center">
                        <span className="text-6xl block mb-2">📦</span>
                        <span>{language === 'en' ? 'No image' : 'لا توجد صورة'}</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-primary text-dark text-sm font-bold px-3 py-1 rounded-full">
                      {t('product.new')}
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-white text-dark text-sm font-bold px-3 py-1 rounded-full">
                      {t('product.featured')}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-transparent hover:border-dark-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name[language]} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Info */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="space-y-6">
              {/* Article Number */}
              <p className="text-dark-600 text-sm">
                {t('product.articleNo')}: {product.articleNumber}
              </p>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {product.name[language]}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {product.price.toLocaleString()} {t('common.currency')}
                </span>
                {hasStock ? (
                  <span className="text-green-500 flex items-center gap-1">
                    <HiCheck className="w-5 h-5" />
                    {t('product.inStock')}
                  </span>
                ) : (
                  <span className="text-red-500">{t('product.outOfStock')}</span>
                )}
              </div>

              {/* Description */}
              <div className="border-t border-dark-200 pt-6">
                <h3 className="text-lg font-bold text-white mb-3">{t('product.description')}</h3>
                <p className="text-dark-600 leading-relaxed">
                  {product.description[language]}
                </p>
              </div>

              {/* Size Selection */}
              <div className="border-t border-dark-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{t('product.size')}</h3>
                  {selectedSize && (
                    <span className="text-sm text-dark-600">
                      {t('admin.stock')}: {selectedSizeStock}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock === 0}
                      className={`min-w-[60px] px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedSize === size.size
                          ? 'bg-primary text-dark'
                          : size.stock === 0
                          ? 'bg-dark-300 text-dark-500 cursor-not-allowed line-through'
                          : 'bg-dark-200 text-white hover:bg-dark-300'
                      }`}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-dark-200 pt-6 space-y-4">
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!hasStock}
                    loading={isAdding}
                    icon={<HiOutlineShoppingBag className="w-5 h-5" />}
                    fullWidth
                    size="lg"
                  >
                    {t('product.addToCart')}
                  </Button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWishlistToggle}
                    className="w-14 h-14 bg-dark-200 hover:bg-dark-300 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    {isWishlisted ? (
                      <HiHeart className="w-6 h-6 text-red-500" />
                    ) : (
                      <HiOutlineHeart className="w-6 h-6 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* WhatsApp Order */}
                <WhatsAppButton product={product} selectedSize={selectedSize} />
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-display tracking-wider text-white mb-8">
                {t('product.related')}
              </h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  )
}
