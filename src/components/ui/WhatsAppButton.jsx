import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../../context/LanguageContext'

export default function WhatsAppButton({ product = null, selectedSize = null }) {
  const { language, t } = useLanguage()
  const phoneNumber = '201096963964'

  const generateMessage = () => {
    if (product && selectedSize) {
      const productName = product.name[language]
      const greeting = t('whatsapp.greeting')
      const articleLabel = t('whatsapp.article')
      const sizeLabel = t('whatsapp.size')
      const priceLabel = t('whatsapp.price')
      
      return encodeURIComponent(
        `${greeting}\n\n` +
        `🏷️ ${productName}\n` +
        `📋 ${articleLabel}: ${product.articleNumber}\n` +
        `📐 ${sizeLabel}: ${selectedSize}\n` +
        `💰 ${priceLabel}: ${product.price.toLocaleString()} ${t('common.currency')}`
      )
    }
    
    return encodeURIComponent(
      language === 'en' 
        ? 'Hello! I would like to inquire about your products.'
        : 'مرحباً! أود الاستفسار عن منتجاتكم.'
    )
  }

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${generateMessage()}`

  // Floating button (when no product is specified)
  if (!product) {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-lg whatsapp-pulse"
        style={{ [language === 'ar' ? 'left' : 'right']: '1.5rem', [language === 'ar' ? 'right' : 'left']: 'auto' }}
      >
        <FaWhatsapp className="w-7 h-7" />
      </motion.a>
    )
  }

  // Product page button
  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
    >
      <FaWhatsapp className="w-6 h-6" />
      {t('product.orderWhatsApp')}
    </motion.a>
  )
}
