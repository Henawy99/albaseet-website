import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialProducts = [
  // Padel Products
  {
    id: 'padel-001',
    articleNumber: 'PD-SH-001',
    name: { en: 'Pro Padel Court Shoes', ar: 'حذاء بادل احترافي' },
    description: {
      en: 'Professional padel court shoes with excellent grip and lateral support. Designed for quick movements and maximum comfort during intense matches.',
      ar: 'حذاء بادل احترافي بقبضة ممتازة ودعم جانبي. مصمم للحركات السريعة والراحة القصوى أثناء المباريات المكثفة.'
    },
    category: 'padel',
    subcategory: 'shoes',
    price: 2499,
    images: ['/products/padel-shoes-1.jpg', '/products/padel-shoes-2.jpg'],
    sizes: [
      { size: '40', stock: 5 },
      { size: '41', stock: 8 },
      { size: '42', stock: 12 },
      { size: '43', stock: 6 },
      { size: '44', stock: 4 },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: 'padel-002',
    articleNumber: 'PD-RC-001',
    name: { en: 'Carbon Pro Padel Racket', ar: 'مضرب بادل كربون برو' },
    description: {
      en: 'High-performance carbon fiber padel racket. Perfect balance of power and control for advanced players.',
      ar: 'مضرب بادل من ألياف الكربون عالي الأداء. توازن مثالي بين القوة والتحكم للاعبين المتقدمين.'
    },
    category: 'padel',
    subcategory: 'rackets',
    price: 3999,
    images: ['/products/padel-racket-1.jpg'],
    sizes: [
      { size: 'One Size', stock: 15 },
    ],
    featured: true,
    isNew: false,
  },
  {
    id: 'padel-003',
    articleNumber: 'PD-BL-001',
    name: { en: 'Premium Padel Balls (3 Pack)', ar: 'كرات بادل فاخرة (3 قطع)' },
    description: {
      en: 'Tournament-grade padel balls with consistent bounce and durability. Perfect for training and competitive play.',
      ar: 'كرات بادل بمستوى البطولات مع ارتداد ثابت ومتانة. مثالية للتدريب واللعب التنافسي.'
    },
    category: 'padel',
    subcategory: 'balls',
    price: 299,
    images: ['/products/padel-balls-1.jpg'],
    sizes: [
      { size: '3 Pack', stock: 50 },
    ],
    featured: false,
    isNew: false,
  },
  
  // Football Products
  {
    id: 'football-001',
    articleNumber: 'FB-SH-001',
    name: { en: 'Elite Football Boots', ar: 'حذاء كرة قدم إيليت' },
    description: {
      en: 'Professional football boots with advanced stud configuration for optimal traction on natural grass.',
      ar: 'حذاء كرة قدم احترافي مع تكوين أزرار متقدم للتماسك الأمثل على العشب الطبيعي.'
    },
    category: 'football',
    subcategory: 'shoes',
    price: 3299,
    images: ['/products/football-boots-1.jpg', '/products/football-boots-2.jpg'],
    sizes: [
      { size: '39', stock: 3 },
      { size: '40', stock: 7 },
      { size: '41', stock: 10 },
      { size: '42', stock: 8 },
      { size: '43', stock: 5 },
      { size: '44', stock: 4 },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: 'football-002',
    articleNumber: 'FB-BL-001',
    name: { en: 'Match Football', ar: 'كرة قدم للمباريات' },
    description: {
      en: 'FIFA-approved match ball with excellent flight stability and soft touch.',
      ar: 'كرة مباريات معتمدة من الفيفا مع ثبات طيران ممتاز ولمسة ناعمة.'
    },
    category: 'football',
    subcategory: 'balls',
    price: 899,
    images: ['/products/football-1.jpg'],
    sizes: [
      { size: 'Size 5', stock: 25 },
    ],
    featured: false,
    isNew: false,
  },
  {
    id: 'football-003',
    articleNumber: 'FB-AP-001',
    name: { en: 'Pro Training Jersey', ar: 'قميص تدريب احترافي' },
    description: {
      en: 'Lightweight, breathable training jersey with moisture-wicking technology.',
      ar: 'قميص تدريب خفيف الوزن وقابل للتنفس مع تقنية امتصاص الرطوبة.'
    },
    category: 'football',
    subcategory: 'apparel',
    price: 599,
    images: ['/products/jersey-1.jpg'],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 5 },
    ],
    featured: false,
    isNew: true,
  },
  
  // Swimming Products
  {
    id: 'swimming-001',
    articleNumber: 'SW-GG-001',
    name: { en: 'Competition Goggles', ar: 'نظارات سباحة للمسابقات' },
    description: {
      en: 'Anti-fog competition swimming goggles with UV protection and adjustable nose bridge.',
      ar: 'نظارات سباحة للمسابقات مضادة للضباب مع حماية من الأشعة فوق البنفسجية وجسر أنف قابل للتعديل.'
    },
    category: 'swimming',
    subcategory: 'goggles',
    price: 449,
    images: ['/products/goggles-1.jpg'],
    sizes: [
      { size: 'Adult', stock: 20 },
      { size: 'Junior', stock: 15 },
    ],
    featured: true,
    isNew: false,
  },
  {
    id: 'swimming-002',
    articleNumber: 'SW-SW-001',
    name: { en: 'Pro Racing Swimsuit', ar: 'بدلة سباحة احترافية' },
    description: {
      en: 'Hydrodynamic racing swimsuit with chlorine-resistant fabric for maximum speed.',
      ar: 'بدلة سباحة هيدروديناميكية مع قماش مقاوم للكلور لأقصى سرعة.'
    },
    category: 'swimming',
    subcategory: 'swimwear',
    price: 1299,
    images: ['/products/swimsuit-1.jpg'],
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 8 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 7 },
      { size: 'XL', stock: 4 },
    ],
    featured: false,
    isNew: true,
  },
  {
    id: 'swimming-003',
    articleNumber: 'SW-CP-001',
    name: { en: 'Silicone Swim Cap', ar: 'قبعة سباحة سيليكون' },
    description: {
      en: 'Premium silicone swim cap with excellent stretch and durability.',
      ar: 'قبعة سباحة سيليكون فاخرة مع مرونة ومتانة ممتازة.'
    },
    category: 'swimming',
    subcategory: 'caps',
    price: 149,
    images: ['/products/swim-cap-1.jpg'],
    sizes: [
      { size: 'One Size', stock: 30 },
    ],
    featured: false,
    isNew: false,
  },
  
  // Tennis Products
  {
    id: 'tennis-001',
    articleNumber: 'TN-RC-001',
    name: { en: 'Tournament Tennis Racket', ar: 'مضرب تنس للبطولات' },
    description: {
      en: 'Professional-grade tennis racket with graphite frame for powerful serves and precise shots.',
      ar: 'مضرب تنس بمستوى احترافي مع إطار جرافيت للإرسالات القوية والضربات الدقيقة.'
    },
    category: 'tennis',
    subcategory: 'rackets',
    price: 4599,
    images: ['/products/tennis-racket-1.jpg'],
    sizes: [
      { size: 'G2', stock: 6 },
      { size: 'G3', stock: 8 },
      { size: 'G4', stock: 5 },
    ],
    featured: true,
    isNew: false,
  },
  {
    id: 'tennis-002',
    articleNumber: 'TN-SH-001',
    name: { en: 'All-Court Tennis Shoes', ar: 'حذاء تنس لجميع الملاعب' },
    description: {
      en: 'Versatile tennis shoes designed for all court surfaces with excellent cushioning.',
      ar: 'حذاء تنس متعدد الاستخدامات مصمم لجميع أسطح الملاعب مع توسيد ممتاز.'
    },
    category: 'tennis',
    subcategory: 'shoes',
    price: 2799,
    images: ['/products/tennis-shoes-1.jpg'],
    sizes: [
      { size: '40', stock: 6 },
      { size: '41', stock: 9 },
      { size: '42', stock: 11 },
      { size: '43', stock: 7 },
      { size: '44', stock: 4 },
    ],
    featured: false,
    isNew: true,
  },
  {
    id: 'tennis-003',
    articleNumber: 'TN-BL-001',
    name: { en: 'Championship Tennis Balls (4 Pack)', ar: 'كرات تنس للبطولات (4 قطع)' },
    description: {
      en: 'ITF-approved tennis balls with consistent bounce and felt durability.',
      ar: 'كرات تنس معتمدة من ITF مع ارتداد ثابت ومتانة اللباد.'
    },
    category: 'tennis',
    subcategory: 'balls',
    price: 199,
    images: ['/products/tennis-balls-1.jpg'],
    sizes: [
      { size: '4 Pack', stock: 40 },
    ],
    featured: false,
    isNew: false,
  },
]

export const categories = [
  {
    id: 'padel',
    name: { en: 'Padel', ar: 'بادل' },
    image: '/categories/padel.jpg',
    subcategories: ['shoes', 'rackets', 'balls', 'apparel', 'accessories'],
  },
  {
    id: 'football',
    name: { en: 'Football', ar: 'كرة قدم' },
    image: '/categories/football.jpg',
    subcategories: ['shoes', 'balls', 'apparel', 'accessories', 'training'],
  },
  {
    id: 'swimming',
    name: { en: 'Swimming', ar: 'سباحة' },
    image: '/categories/swimming.jpg',
    subcategories: ['goggles', 'swimwear', 'caps', 'accessories', 'training'],
  },
  {
    id: 'tennis',
    name: { en: 'Tennis', ar: 'تنس' },
    image: '/categories/tennis.jpg',
    subcategories: ['shoes', 'rackets', 'balls', 'apparel', 'accessories'],
  },
]

export const subcategories = {
  shoes: { en: 'Shoes', ar: 'أحذية' },
  rackets: { en: 'Rackets', ar: 'مضارب' },
  balls: { en: 'Balls', ar: 'كرات' },
  apparel: { en: 'Apparel', ar: 'ملابس' },
  accessories: { en: 'Accessories', ar: 'إكسسوارات' },
  training: { en: 'Training Equipment', ar: 'معدات تدريب' },
  goggles: { en: 'Goggles', ar: 'نظارات' },
  swimwear: { en: 'Swimwear', ar: 'ملابس سباحة' },
  caps: { en: 'Caps', ar: 'قبعات' },
}

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: initialProducts,
      
      // Get all products
      getAllProducts: () => get().products,
      
      // Get product by ID
      getProductById: (id) => get().products.find(p => p.id === id),
      
      // Get products by category
      getProductsByCategory: (categoryId, subcategoryId = null) => {
        return get().products.filter(p => {
          if (subcategoryId) {
            return p.category === categoryId && p.subcategory === subcategoryId
          }
          return p.category === categoryId
        })
      },
      
      // Get featured products
      getFeaturedProducts: () => get().products.filter(p => p.featured),
      
      // Get new products
      getNewProducts: () => get().products.filter(p => p.isNew),
      
      // Search products
      searchProducts: (query, lang = 'en') => {
        const lowerQuery = query.toLowerCase()
        return get().products.filter(p => 
          p.name[lang].toLowerCase().includes(lowerQuery) ||
          p.articleNumber.toLowerCase().includes(lowerQuery) ||
          p.description[lang].toLowerCase().includes(lowerQuery)
        )
      },
      
      // Add product
      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: `product-${Date.now()}`,
        }
        set(state => ({
          products: [...state.products, newProduct]
        }))
        return newProduct
      },
      
      // Add multiple products (bulk)
      addProducts: (products) => {
        const newProducts = products.map((p, index) => ({
          ...p,
          id: `product-${Date.now()}-${index}`,
        }))
        set(state => ({
          products: [...state.products, ...newProducts]
        }))
        return newProducts
      },
      
      // Update product
      updateProduct: (id, updates) => {
        set(state => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }))
      },
      
      // Delete product
      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id)
        }))
      },
      
      // Update stock
      updateStock: (productId, size, newStock) => {
        set(state => ({
          products: state.products.map(p => {
            if (p.id === productId) {
              return {
                ...p,
                sizes: p.sizes.map(s => 
                  s.size === size ? { ...s, stock: newStock } : s
                )
              }
            }
            return p
          })
        }))
      },
      
      // Get low stock products
      getLowStockProducts: (threshold = 5) => {
        return get().products.filter(p => 
          p.sizes.some(s => s.stock <= threshold && s.stock > 0)
        )
      },
      
      // Get out of stock products
      getOutOfStockProducts: () => {
        return get().products.filter(p => 
          p.sizes.every(s => s.stock === 0)
        )
      },
      
      // Reset to initial products
      resetProducts: () => {
        set({ products: initialProducts })
      },
    }),
    {
      name: 'albaseet-products',
    }
  )
)
