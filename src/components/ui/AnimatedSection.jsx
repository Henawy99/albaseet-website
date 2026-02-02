import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function AnimatedSection({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  threshold = 0.1,
  once = true,
}) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  })

  const directions = {
    up: { initial: { y: 40 }, animate: { y: 0 } },
    down: { initial: { y: -40 }, animate: { y: 0 } },
    left: { initial: { x: 40 }, animate: { x: 0 } },
    right: { initial: { x: -40 }, animate: { x: 0 } },
    none: { initial: {}, animate: {} },
  }

  const { initial, animate } = directions[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initial }}
      animate={inView ? { opacity: 1, ...animate } : { opacity: 0, ...initial }}
      transition={{ 
        duration, 
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Section Title Component
export function SectionTitle({ title, subtitle, align = 'center', light = false }) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <AnimatedSection className={`mb-12 ${alignClasses[align]}`}>
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-display tracking-wider mb-4 ${light ? 'text-dark' : 'text-white'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg ${light ? 'text-dark-500' : 'text-dark-600'}`}>
          {subtitle}
        </p>
      )}
      <div className={`w-20 h-1 bg-primary mt-6 ${align === 'center' ? 'mx-auto' : ''}`} />
    </AnimatedSection>
  )
}

// Parallax Section
export function ParallaxSection({ children, className = '', speed = 0.5 }) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0,
  })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transform: inView ? `translateY(${-speed * 50}px)` : 'translateY(0)',
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </motion.div>
  )
}

// Stagger Children Container
export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger Item
export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
