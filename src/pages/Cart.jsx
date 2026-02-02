import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import Button from '../components/ui/Button'
import { HiOutlineTrash, HiOutlinePlus, HiOutlineMinus, HiOutlineShoppingBag, HiArrowRight, HiArrowLeft } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Cart() {
  const { language, t } = useLanguage()
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const Arrow = language === 'ar' ? HiArrowLeft : HiArrowRight

  const handleWhatsAppCheckout = () => {
    const whatsappNumber = '201096963964'
    
    let message = language === 'en' 
      ? '🛒 *Order from ALBASEET*\n\n'
      : '🛒 *طلب من البسيط*\n\n'
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name?.[language] || item.name?.en || 'Product'}\n`
      message += `   ${language === 'en' ? 'Article' : 'رقم المنتج'}: ${item.articleNumber}\n`
      message += `   ${language === 'en' ? 'Size' : 'المقاس'}: ${item.selectedSize}\n`
      message += `   ${language === 'en' ? 'Qty' : 'الكمية'}: ${item.quantity}\n`
      message += `   ${language === 'en' ? 'Price' : 'السعر'}: ${(item.price * item.quantity).toLocaleString()} EGP\n\n`
    })
    
    message += `━━━━━━━━━━━━━━━━━━\n`
    message += `${language === 'en' ? '💰 Total' : '💰 الإجمالي'}: ${cartTotal.toLocaleString()} EGP\n\n`
    message += language === 'en' 
      ? '📍 Please send your delivery address'
      : '📍 من فضلك أرسل عنوان التوصيل'
    
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-dark pt-32 pb-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineShoppingBag className="w-12 h-12 text-dark-500" />
            </div>
            <h1 className="text-3xl font-display text-white mb-4">
              {language === 'en' ? 'Your Cart is Empty' : 'سلة التسوق فارغة'}
            </h1>
            <p className="text-dark-600 mb-8">
              {language === 'en' 
                ? 'Looks like you haven\'t added any items yet.'
                : 'يبدو أنك لم تضف أي منتجات بعد.'}
            </p>
            <Button to="/products" icon={<Arrow />} iconPosition="right">
              {language === 'en' ? 'Start Shopping' : 'ابدأ التسوق'}
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark pt-32 pb-20"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display text-white">
              {language === 'en' ? 'Shopping Cart' : 'سلة التسوق'}
            </h1>
            <p className="text-dark-600 mt-2">
              {cart.length} {language === 'en' ? 'items' : 'منتجات'}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-dark-600 hover:text-red-500 transition-colors flex items-center gap-2"
          >
            <HiOutlineTrash className="w-5 h-5" />
            {language === 'en' ? 'Clear All' : 'مسح الكل'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.selectedSize}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-100 rounded-2xl p-4 flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-dark-200 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.name?.[language]}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <Link 
                    to={`/product/${item.id}`}
                    className="text-white font-medium hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.name?.[language] || item.name?.en}
                  </Link>
                  <p className="text-dark-600 text-sm mt-1">
                    {language === 'en' ? 'Article' : 'رقم المنتج'}: {item.articleNumber}
                  </p>
                  <p className="text-dark-600 text-sm">
                    {language === 'en' ? 'Size' : 'المقاس'}: {item.selectedSize}
                  </p>
                  <p className="text-primary font-bold mt-2">
                    {(item.price * item.quantity).toLocaleString()} EGP
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-dark-500 hover:text-red-500 transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 bg-dark-200 rounded-lg px-3 py-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, Math.max(1, item.quantity - 1))}
                      className="text-dark-500 hover:text-white transition-colors"
                    >
                      <HiOutlineMinus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                      className="text-dark-500 hover:text-white transition-colors"
                    >
                      <HiOutlinePlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-100 rounded-2xl p-6 sticky top-32">
              <h2 className="text-xl font-bold text-white mb-6">
                {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-dark-600">
                  <span>{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                  <span>{cartTotal.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-dark-600">
                  <span>{language === 'en' ? 'Shipping' : 'الشحن'}</span>
                  <span className="text-primary">
                    {cartTotal >= 1000 
                      ? (language === 'en' ? 'FREE' : 'مجاني')
                      : '50 EGP'}
                  </span>
                </div>
                {cartTotal < 1000 && (
                  <p className="text-xs text-dark-500">
                    {language === 'en' 
                      ? `Add ${(1000 - cartTotal).toLocaleString()} EGP more for free shipping!`
                      : `أضف ${(1000 - cartTotal).toLocaleString()} جنيه للحصول على شحن مجاني!`}
                  </p>
                )}
                <div className="border-t border-dark-200 pt-4 flex justify-between text-white font-bold text-lg">
                  <span>{language === 'en' ? 'Total' : 'الإجمالي'}</span>
                  <span className="text-primary">
                    {(cartTotal + (cartTotal >= 1000 ? 0 : 50)).toLocaleString()} EGP
                  </span>
                </div>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors"
              >
                <FaWhatsapp className="w-6 h-6" />
                {language === 'en' ? 'Order via WhatsApp' : 'اطلب عبر واتساب'}
              </button>

              <p className="text-dark-500 text-sm text-center mt-4">
                {language === 'en' 
                  ? 'Your order will be sent to our WhatsApp for confirmation'
                  : 'سيتم إرسال طلبك إلى واتساب للتأكيد'}
              </p>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="mt-6 block text-center text-primary hover:text-white transition-colors"
              >
                {language === 'en' ? '← Continue Shopping' : 'متابعة التسوق ←'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
