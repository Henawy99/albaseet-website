import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '../../context/LanguageContext'
import { useCart } from '../../context/CartContext'
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag } from 'react-icons/hi'

export default function ProductCard({ product, index = 0 }) {
  const { language, t } = useLanguage()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const isWishlisted = isInWishlist(product.id)
  const hasStock = product.sizes.some(s => s.stock > 0)

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="product-card bg-dark-100 rounded-2xl overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full">
                  {t('product.new')}
                </span>
              )}
              {product.featured && (
                <span className="bg-white text-dark text-xs font-bold px-3 py-1 rounded-full">
                  {t('product.featured')}
                </span>
              )}
              {!hasStock && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t('product.outOfStock')}
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-dark/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-dark transition-colors"
            >
              {isWishlisted ? (
                <HiHeart className="w-5 h-5 text-red-500" />
              ) : (
                <HiOutlineHeart className="w-5 h-5" />
              )}
            </motion.button>

            {/* Product Image */}
            <div className={`w-full h-full bg-dark-200 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <img
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name[language]}
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-dark-200 animate-pulse" />
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 bg-primary text-dark font-bold py-3 rounded-lg"
                >
                  <HiOutlineShoppingBag className="w-5 h-5" />
                  {t('product.addToCart')}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Article Number */}
            <span className="text-dark-600 text-xs font-medium">
              {product.articleNumber}
            </span>
            
            {/* Product Name */}
            <h3 className="text-white font-semibold mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {product.name[language]}
            </h3>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-primary font-bold text-lg">
                {product.price.toLocaleString()} {t('common.currency')}
              </span>
              
              {/* Available Sizes Preview */}
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map((size, idx) => (
                  <span 
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${
                      size.stock > 0 
                        ? 'bg-dark-200 text-dark-600' 
                        : 'bg-dark-300 text-dark-500 line-through'
                    }`}
                  >
                    {size.size}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs px-2 py-1 text-dark-600">
                    +{product.sizes.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
