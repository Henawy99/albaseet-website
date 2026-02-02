import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import AnimatedSection, { StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection'
import { 
  HiOutlineLocationMarker, 
  HiOutlineMail, 
  HiOutlinePhone,
  HiOutlineClock 
} from 'react-icons/hi'
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa'

export default function Contact() {
  const { language, t } = useLanguage()

  const contactInfo = [
    {
      icon: HiOutlineLocationMarker,
      title: { en: 'Visit Us', ar: 'زورنا' },
      content: {
        en: 'Inside Be Pro Fun Hub\nIn front of Al-Rehab Gate 1\nFirst Settlement',
        ar: 'بداخل Be Pro Fun Hub\nامام الرحاب بوابه ١\nالتجمع الأول'
      },
      color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    },
    {
      icon: HiOutlineMail,
      title: { en: 'Email Us', ar: 'راسلنا' },
      content: { en: 'Albaseettennisutilities@gmail.com', ar: 'Albaseettennisutilities@gmail.com' },
      link: 'mailto:Albaseettennisutilities@gmail.com',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      icon: FaWhatsapp,
      title: { en: 'WhatsApp', ar: 'واتساب' },
      content: { en: '+20 109 696 3964', ar: '+20 109 696 3964' },
      link: 'https://wa.me/201096963964',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    },
    {
      icon: HiOutlineClock,
      title: { en: 'Working Hours', ar: 'ساعات العمل' },
      content: { 
        en: 'Saturday - Thursday\n10:00 AM - 10:00 PM', 
        ar: 'السبت - الخميس\n١٠:٠٠ ص - ١٠:٠٠ م' 
      },
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    },
  ]

  const socialLinks = [
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: FaFacebookF, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: FaTiktok, href: '#', label: 'TikTok', color: 'hover:bg-black' },
    { icon: FaWhatsapp, href: 'https://wa.me/201096963964', label: 'WhatsApp', color: 'hover:bg-green-600' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-20"
    >
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display tracking-wider text-white mb-6">
              {t('contact.title').toUpperCase()}
            </h1>
            <p className="text-xl text-dark-600">
              {t('contact.subtitle')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-dark-100 rounded-2xl overflow-hidden h-full"
                >
                  {/* Colored Header */}
                  <div className={`${item.color} p-6`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3">
                      {item.title[language]}
                    </h3>
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-dark-600 hover:text-primary transition-colors whitespace-pre-line break-all"
                      >
                        {item.content[language]}
                      </a>
                    ) : (
                      <p className="text-dark-600 whitespace-pre-line">
                        {item.content[language]}
                      </p>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="bg-dark-100 rounded-2xl overflow-hidden">
              <div className="aspect-video w-full bg-dark-200 flex items-center justify-center">
                {/* Placeholder for map - you can integrate Google Maps here */}
                <div className="text-center p-8">
                  <HiOutlineLocationMarker className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">
                    {language === 'en' ? 'Find Us on Map' : 'جدنا على الخريطة'}
                  </h3>
                  <p className="text-dark-600 whitespace-pre-line">
                    {language === 'en' 
                      ? 'Inside Be Pro Fun Hub\nIn front of Al-Rehab Gate 1\nFirst Settlement'
                      : 'بداخل Be Pro Fun Hub\nامام الرحاب بوابه ١\nالتجمع الأول'}
                  </p>
                  <a
                    href="https://maps.google.com/?q=Be+Pro+Fun+Hub+First+Settlement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-primary hover:text-white transition-colors"
                  >
                    {language === 'en' ? 'Open in Google Maps' : 'فتح في خرائط جوجل'}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center">
            <h2 className="text-2xl md:text-3xl font-display tracking-wider text-white mb-8">
              {language === 'en' ? 'FOLLOW US' : 'تابعنا'}
            </h2>
            
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-14 h-14 bg-dark-200 rounded-full flex items-center justify-center text-white transition-colors ${social.color}`}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-yellow-400 rounded-3xl p-8 md:p-12 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-display tracking-wider text-dark mb-4">
                {language === 'en' ? 'READY TO ORDER?' : 'جاهز للطلب؟'}
              </h2>
              <p className="text-dark/70 text-lg mb-8 max-w-2xl mx-auto">
                {language === 'en'
                  ? 'Contact us directly via WhatsApp for the fastest response and easy ordering!'
                  : 'تواصل معنا مباشرة عبر واتساب للحصول على أسرع رد وطلب سهل!'}
              </p>
              <motion.a
                href="https://wa.me/201096963964"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-dark text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-dark-100 transition-colors"
              >
                <FaWhatsapp className="w-6 h-6" />
                {language === 'en' ? 'Chat on WhatsApp' : 'تحدث عبر واتساب'}
              </motion.a>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
