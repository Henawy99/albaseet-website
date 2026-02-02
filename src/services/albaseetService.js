import { supabase, ALBASEET_PRODUCTS_TABLE, ALBASEET_STORAGE_BUCKET, getImageUrl } from '../config/supabase'

// ============================================
// ALBASEET SUPABASE SERVICE
// Completely separate from Playmaker data
// ============================================

// Transform Supabase row (snake_case) to JS object (camelCase)
const transformFromDB = (row) => ({
  id: row.id,
  articleNumber: row.article_number,
  name: row.name,
  description: row.description,
  category: row.category,
  subcategory: row.subcategory,
  price: row.price,
  images: (row.images || []).map(img => getImageUrl(img)),
  sizes: row.sizes || [],
  isNew: row.is_new,
  featured: row.featured,
  createdAt: row.created_at,
})

// Transform JS object (camelCase) to Supabase row (snake_case)
const transformToDB = (product) => ({
  article_number: product.articleNumber,
  name: product.name,
  description: product.description,
  category: product.category,
  subcategory: product.subcategory,
  price: product.price,
  images: product.images || [],
  sizes: product.sizes || [],
  is_new: product.isNew || false,
  featured: product.featured || false,
})

// -------------------- PRODUCTS --------------------

export const fetchAllProducts = async () => {
  const { data, error } = await supabase
    .from(ALBASEET_PRODUCTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  
  return data.map(transformFromDB)
}

export const fetchProductById = async (id) => {
  const { data, error } = await supabase
    .from(ALBASEET_PRODUCTS_TABLE)
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching product:', error)
    return null
  }
  
  return transformFromDB(data)
}

export const fetchProductsByCategory = async (category) => {
  const { data, error } = await supabase
    .from(ALBASEET_PRODUCTS_TABLE)
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
  
  return data.map(transformFromDB)
}

export const createProduct = async (productData) => {
  const dbData = transformToDB(productData)
  
  const { data, error } = await supabase
    .from(ALBASEET_PRODUCTS_TABLE)
    .insert([dbData])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating product:', error)
    throw error
  }
  
  return transformFromDB(data)
}

export const updateProduct = async (id, updates) => {
  // Only transform fields that are being updated
  const dbUpdates = {}
  if (updates.articleNumber !== undefined) dbUpdates.article_number = updates.articleNumber
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.category !== undefined) dbUpdates.category = updates.category
  if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory
  if (updates.price !== undefined) dbUpdates.price = updates.price
  if (updates.images !== undefined) dbUpdates.images = updates.images
  if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes
  if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew
  if (updates.featured !== undefined) dbUpdates.featured = updates.featured
  
  const { data, error } = await supabase
    .from(ALBASEET_PRODUCTS_TABLE)
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating product:', error)
    throw error
  }
  
  return transformFromDB(data)
}

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from(ALBASEET_PRODUCTS_TABLE)
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }
  
  return true
}

export const bulkCreateProducts = async (products) => {
  const dbProducts = products.map(transformToDB)
  
  const { data, error } = await supabase
    .from(ALBASEET_PRODUCTS_TABLE)
    .insert(dbProducts)
    .select()
  
  if (error) {
    console.error('Error bulk creating products:', error)
    throw error
  }
  
  return data.map(transformFromDB)
}

// -------------------- IMAGES --------------------

export const uploadProductImage = async (file, productId) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${productId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(ALBASEET_STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('Error uploading image:', error)
    throw error
  }
  
  return data.path
}

export const deleteProductImage = async (path) => {
  const { error } = await supabase.storage
    .from(ALBASEET_STORAGE_BUCKET)
    .remove([path])
  
  if (error) {
    console.error('Error deleting image:', error)
    throw error
  }
  
  return true
}

// -------------------- ANALYTICS --------------------

export const trackPageView = async (page) => {
  // Store analytics in localStorage for now (can add Supabase table later)
  const today = new Date().toISOString().split('T')[0]
  const analyticsKey = `albaseet_analytics_${today}`
  const current = JSON.parse(localStorage.getItem(analyticsKey) || '{"views":0,"visitors":[]}')
  
  current.views++
  
  // Track unique visitor
  const visitorId = localStorage.getItem('albaseet_visitor_id') || `v_${Date.now()}`
  localStorage.setItem('albaseet_visitor_id', visitorId)
  if (!current.visitors.includes(visitorId)) {
    current.visitors.push(visitorId)
  }
  
  localStorage.setItem(analyticsKey, JSON.stringify(current))
}

// -------------------- INITIALIZATION --------------------

export const initializeDatabase = async () => {
  // Check if table exists by trying to fetch
  const { error } = await supabase
    .from(ALBASEET_PRODUCTS_TABLE)
    .select('id')
    .limit(1)
  
  if (error && error.code === '42P01') {
    console.log('Table does not exist. Please create it in Supabase dashboard.')
    return false
  }
  
  return true
}
