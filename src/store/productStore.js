import { create } from 'zustand'
import * as albaseetService from '../services/albaseetService'

// Categories and subcategories (static data)
export const categories = [
  { id: 'padel', name: { en: 'Padel', ar: 'بادل' }, color: 'from-yellow-500 to-orange-500' },
  { id: 'football', name: { en: 'Football', ar: 'كرة القدم' }, color: 'from-green-500 to-emerald-500' },
  { id: 'swimming', name: { en: 'Swimming', ar: 'سباحة' }, color: 'from-blue-500 to-cyan-500' },
  { id: 'tennis', name: { en: 'Tennis', ar: 'تنس' }, color: 'from-purple-500 to-pink-500' },
]

export const subcategories = [
  { id: 'shoes', name: { en: 'Shoes', ar: 'أحذية' } },
  { id: 'rackets', name: { en: 'Rackets / Balls', ar: 'مضارب / كرات' } },
  { id: 'apparel', name: { en: 'Apparel', ar: 'ملابس' } },
  { id: 'accessories', name: { en: 'Accessories', ar: 'إكسسوارات' } },
  { id: 'equipment', name: { en: 'Training Equipment', ar: 'معدات تدريب' } },
]

// Sample products for fallback (when Supabase is empty)
const sampleProducts = [
  {
    id: 'sample-1',
    articleNumber: 'PD-SH-001',
    name: { en: 'Pro Padel Court Shoes', ar: 'حذاء ملعب بادل برو' },
    description: {
      en: 'Professional padel court shoes with excellent grip and support.',
      ar: 'أحذية ملعب بادل احترافية مع قبضة ودعم ممتازين.'
    },
    category: 'padel',
    subcategory: 'shoes',
    price: 2499,
    images: ['/placeholder-product.jpg'],
    sizes: [
      { size: '40', stock: 5 },
      { size: '41', stock: 10 },
      { size: '42', stock: 8 },
      { size: '43', stock: 12 },
      { size: '44', stock: 4 },
    ],
    isNew: true,
    featured: true,
  },
  {
    id: 'sample-2',
    articleNumber: 'PD-RC-001',
    name: { en: 'Carbon Pro Padel Racket', ar: 'مضرب بادل كربون برو' },
    description: {
      en: 'High-performance carbon fiber padel racket for advanced players.',
      ar: 'مضرب بادل من ألياف الكربون عالي الأداء للاعبين المتقدمين.'
    },
    category: 'padel',
    subcategory: 'rackets',
    price: 3999,
    images: ['/placeholder-product.jpg'],
    sizes: [{ size: 'One Size', stock: 15 }],
    isNew: false,
    featured: true,
  },
]

export const useProductStore = create((set, get) => ({
  products: [],
  loading: true,
  error: null,
  initialized: false,

  // Initialize - fetch from Supabase
  initialize: async () => {
    if (get().initialized) return
    
    set({ loading: true, error: null })
    
    try {
      const products = await albaseetService.fetchAllProducts()
      
      if (products.length === 0) {
        // Use sample products if database is empty
        set({ products: sampleProducts, loading: false, initialized: true })
      } else {
        set({ products, loading: false, initialized: true })
      }
    } catch (error) {
      console.error('Failed to initialize products:', error)
      // Fallback to sample products
      set({ products: sampleProducts, loading: false, error: error.message, initialized: true })
    }
  },

  // Refresh products from Supabase
  refreshProducts: async () => {
    set({ loading: true })
    try {
      const products = await albaseetService.fetchAllProducts()
      set({ products: products.length > 0 ? products : sampleProducts, loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },

  // Get all products
  getAllProducts: () => get().products,

  // Get product by ID
  getProductById: (id) => get().products.find(p => p.id === id),

  // Get products by category
  getProductsByCategory: (category) => 
    get().products.filter(p => p.category === category),

  // Get products by subcategory
  getProductsBySubcategory: (category, subcategory) =>
    get().products.filter(p => p.category === category && p.subcategory === subcategory),

  // Get featured products
  getFeaturedProducts: () => get().products.filter(p => p.featured),

  // Get new products
  getNewProducts: () => get().products.filter(p => p.isNew),

  // Add product
  addProduct: async (product) => {
    try {
      const newProduct = await albaseetService.createProduct({
        ...product,
        created_at: new Date().toISOString(),
      })
      set(state => ({ products: [newProduct, ...state.products] }))
      return newProduct
    } catch (error) {
      console.error('Failed to add product:', error)
      throw error
    }
  },

  // Add multiple products (bulk)
  addProducts: async (products) => {
    try {
      const newProducts = await albaseetService.bulkCreateProducts(
        products.map(p => ({
          ...p,
          created_at: new Date().toISOString(),
        }))
      )
      set(state => ({ products: [...newProducts, ...state.products] }))
      return newProducts
    } catch (error) {
      console.error('Failed to bulk add products:', error)
      throw error
    }
  },

  // Update product
  updateProduct: async (id, updates) => {
    try {
      const updatedProduct = await albaseetService.updateProduct(id, updates)
      set(state => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
      }))
      return updatedProduct
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      await albaseetService.deleteProduct(id)
      set(state => ({
        products: state.products.filter(p => p.id !== id)
      }))
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw error
    }
  },

  // Upload image for product
  uploadImage: async (file, productId) => {
    try {
      const path = await albaseetService.uploadProductImage(file, productId)
      return path
    } catch (error) {
      console.error('Failed to upload image:', error)
      throw error
    }
  },

  // Update stock
  updateStock: async (productId, sizeIndex, newStock) => {
    const product = get().products.find(p => p.id === productId)
    if (!product) return
    
    const newSizes = [...product.sizes]
    newSizes[sizeIndex] = { ...newSizes[sizeIndex], stock: newStock }
    
    await get().updateProduct(productId, { sizes: newSizes })
  },

  // Get low stock products (stock <= 5)
  getLowStockProducts: () => {
    return get().products.filter(product =>
      product.sizes?.some(size => size.stock > 0 && size.stock <= 5)
    )
  },

  // Get out of stock products
  getOutOfStockProducts: () => {
    return get().products.filter(product =>
      product.sizes?.every(size => size.stock === 0)
    )
  },

  // Search products
  searchProducts: (query) => {
    const q = query.toLowerCase()
    return get().products.filter(p =>
      p.name?.en?.toLowerCase().includes(q) ||
      p.name?.ar?.includes(q) ||
      p.articleNumber?.toLowerCase().includes(q)
    )
  },
}))
