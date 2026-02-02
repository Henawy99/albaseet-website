import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useLanguage } from '../../context/LanguageContext'
import { useProductStore, categories, subcategories } from '../../store/productStore'
import toast from 'react-hot-toast'
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlineUpload
} from 'react-icons/hi'

// Product Image Dropzone Component
function ProductImageDropzone({ product, onImageDrop }) {
  const { language } = useLanguage()
  const [isDragOver, setIsDragOver] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const imageUrl = URL.createObjectURL(file)
      onImageDrop(product.id, imageUrl)
      toast.success(language === 'en' ? 'Image added!' : 'تمت إضافة الصورة!')
    }
    setIsDragOver(false)
  }, [product.id, onImageDrop, language])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    noClick: product.images.length > 0, // Only allow click if no image
  })

  return (
    <div
      {...getRootProps()}
      className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all ${
        isDragActive || isDragOver
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-dark-100 scale-110'
          : ''
      }`}
    >
      <input {...getInputProps()} />
      
      {product.images.length > 0 ? (
        <>
          <img
            src={product.images[0]}
            alt={product.name.en}
            className="w-full h-full object-cover"
          />
          {/* Overlay on drag */}
          {(isDragActive || isDragOver) && (
            <div className="absolute inset-0 bg-primary/80 flex items-center justify-center">
              <HiOutlineUpload className="w-6 h-6 text-dark" />
            </div>
          )}
          {/* Hover overlay to replace */}
          <div className="absolute inset-0 bg-dark/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <HiOutlinePhotograph className="w-5 h-5 text-white" />
          </div>
        </>
      ) : (
        <div className={`w-full h-full flex flex-col items-center justify-center transition-colors ${
          isDragActive || isDragOver
            ? 'bg-primary/20 border-primary'
            : 'bg-dark-300 border-dark-400 hover:border-primary hover:bg-dark-200'
        } border-2 border-dashed rounded-lg`}>
          <HiOutlinePhotograph className={`w-5 h-5 ${isDragActive || isDragOver ? 'text-primary' : 'text-dark-500'}`} />
          <span className="text-[10px] text-dark-500 mt-1">
            {language === 'en' ? 'Drop' : 'اسحب'}
          </span>
        </div>
      )}
    </div>
  )
}

export default function AdminProducts() {
  const { language, t } = useLanguage()
  const { getAllProducts, deleteProduct, updateProduct } = useProductStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Handle image drop on product
  const handleImageDrop = useCallback((productId, imageUrl) => {
    const product = getAllProducts().find(p => p.id === productId)
    if (product) {
      updateProduct(productId, {
        images: [imageUrl, ...product.images.slice(0, 4)] // Add new image as first, keep up to 5
      })
    }
  }, [getAllProducts, updateProduct])

  const products = useMemo(() => {
    let filtered = getAllProducts()
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.en.toLowerCase().includes(query) ||
        p.name.ar.includes(query) ||
        p.articleNumber.toLowerCase().includes(query)
      )
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    
    return filtered
  }, [searchQuery, selectedCategory, getAllProducts])

  const handleDelete = (productId) => {
    deleteProduct(productId)
    setDeleteConfirm(null)
    toast.success(language === 'en' ? 'Product deleted!' : 'تم حذف المنتج!')
  }

  const getTotalStock = (sizes) => {
    return sizes.reduce((total, s) => total + s.stock, 0)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('admin.products')}
          </h1>
          <p className="text-dark-600">
            {products.length} {language === 'en' ? 'products' : 'منتج'}
          </p>
        </div>
        
        <Link
          to="/admin/products/add"
          className="flex items-center gap-2 bg-primary hover:bg-yellow-400 text-dark font-bold px-6 py-3 rounded-lg transition-colors"
        >
          <HiOutlinePlus className="w-5 h-5" />
          {t('admin.addProduct')}
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-dark-100 rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search by name or article number...' : 'ابحث بالاسم أو رقم المنتج...'}
              className="w-full bg-dark-200 text-white pl-12 pr-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <HiOutlineFilter className="w-5 h-5 text-dark-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-dark-200 text-white px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{language === 'en' ? 'All Categories' : 'جميع الأقسام'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name[language]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drag & Drop Tip */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <HiOutlinePhotograph className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h4 className="text-primary font-medium">
            {language === 'en' ? 'Quick Image Upload' : 'رفع سريع للصور'}
          </h4>
          <p className="text-dark-600 text-sm">
            {language === 'en' 
              ? 'Drag and drop images directly onto any product to add photos instantly!'
              : 'اسحب وأفلت الصور مباشرة على أي منتج لإضافة الصور فوراً!'}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-dark-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-200">
                <th className="text-left px-6 py-4 text-dark-600 font-medium">
                  <div className="flex items-center gap-2">
                    {language === 'en' ? 'Product' : 'المنتج'}
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {language === 'en' ? 'Drop images!' : 'اسحب الصور!'}
                    </span>
                  </div>
                </th>
                <th className="text-left px-6 py-4 text-dark-600 font-medium">
                  {t('admin.articleNumber')}
                </th>
                <th className="text-left px-6 py-4 text-dark-600 font-medium">
                  {t('admin.category')}
                </th>
                <th className="text-left px-6 py-4 text-dark-600 font-medium">
                  {t('admin.price')}
                </th>
                <th className="text-left px-6 py-4 text-dark-600 font-medium">
                  {t('admin.stock')}
                </th>
                <th className="text-right px-6 py-4 text-dark-600 font-medium">
                  {language === 'en' ? 'Actions' : 'إجراءات'}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const totalStock = getTotalStock(product.sizes)
                const category = categories.find(c => c.id === product.category)
                
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-dark-200 hover:bg-dark-200/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Drag & Drop Image Zone */}
                        <ProductImageDropzone 
                          product={product} 
                          onImageDrop={handleImageDrop}
                        />
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate max-w-[200px]">
                            {product.name[language]}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {product.isNew && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                {t('product.new')}
                              </span>
                            )}
                            {product.images.length === 0 && (
                              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                                {language === 'en' ? 'No image' : 'بدون صورة'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-dark-600 font-mono text-sm">
                        {product.articleNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">
                        {category?.name[language]}
                      </span>
                      <span className="text-dark-600 text-sm block">
                        {subcategories[product.subcategory]?.[language]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-primary font-bold">
                        {product.price.toLocaleString()} {t('common.currency')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        totalStock === 0 ? 'text-red-500' :
                        totalStock <= 10 ? 'text-orange-500' :
                        'text-green-500'
                      }`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 bg-dark-300 hover:bg-primary text-white hover:text-dark rounded-lg transition-colors"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 bg-dark-300 hover:bg-red-500 text-white rounded-lg transition-colors"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl block mb-4">📦</span>
            <p className="text-dark-600">
              {language === 'en' ? 'No products found' : 'لا توجد منتجات'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-100 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {t('admin.deleteProduct')}
                </h3>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-dark-600 hover:text-white transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-dark-600 mb-6">
                {language === 'en'
                  ? 'Are you sure you want to delete this product? This action cannot be undone.'
                  : 'هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.'}
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-dark-200 hover:bg-dark-300 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  {language === 'en' ? 'Delete' : 'حذف'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
