import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { categories } from '../../store/productStore'
import { 
  HiOutlineMail, 
  HiOutlineLocationMarker,
  HiOutlinePhone 
} from 'react-icons/hi'
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTiktok,
  FaWhatsapp 
} from 'react-icons/fa'

export default function Footer() {
  const { language, t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaTiktok, href: '#', label: 'TikTok' },
    { icon: FaWhatsapp, href: 'https://wa.me/201096963964', label: 'WhatsApp' },
  ]

  return (
    <footer className="bg-dark-100 border-t border-dark-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-primary rounded-xl p-3 shadow-lg shadow-primary/30 inline-block"
              >
                <img 
                  src="/logo.png" 
                  alt="ALBASEET" 
                  className="h-16 w-auto"
                />
              </motion.div>
            </Link>
            <p className="text-dark-600 mb-6 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-dark-200 hover:bg-primary text-white hover:text-dark rounded-full flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-dark-600 hover:text-primary transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-dark-600 hover:text-primary transition-colors">
                  {t('nav.shop')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-dark-600 hover:text-primary transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('footer.categories')}</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/category/${category.id}`} 
                    className="text-dark-600 hover:text-primary transition-colors"
                  >
                    {category.name[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <HiOutlineLocationMarker className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-dark-600 whitespace-pre-line">
                  {t('contact.address')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlineMail className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="mailto:Albaseettennisutilities@gmail.com" 
                  className="text-dark-600 hover:text-primary transition-colors break-all"
                >
                  Albaseettennisutilities@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlinePhone className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="tel:+201096963964" 
                  className="text-dark-600 hover:text-primary transition-colors"
                >
                  +20 109 696 3964
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-dark-600 text-sm">
              © {currentYear} ALBASEET. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-dark-600">
                {language === 'en' ? 'Prices in EGP' : 'الأسعار بالجنيه المصري'}
              </span>
              <span className="text-dark-400">|</span>
              <Link to="/admin" className="text-dark-600 hover:text-primary transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
