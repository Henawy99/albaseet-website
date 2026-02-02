import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useLanguage } from '../../context/LanguageContext'
import { useProductStore, categories, subcategories } from '../../store/productStore'
import toast from 'react-hot-toast'
import { 
  HiOutlinePhotograph, 
  HiOutlinePlus, 
  HiOutlineX,
  HiOutlineTrash
} from 'react-icons/hi'

export default function AdminAddProduct() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const { getProductById, addProduct, updateProduct } = useProductStore()
  
  const isEditing = !!productId
  const existingProduct = isEditing ? getProductById(productId) : null

  const [formData, setFormData] = useState({
    articleNumber: '',
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    category: '',
    subcategory: '',
    price: '',
    images: [],
    sizes: [{ size: '', stock: '' }],
    isNew: false,
    featured: false,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        articleNumber: existingProduct.articleNumber,
        nameEn: existingProduct.name.en,
        nameAr: existingProduct.name.ar,
        descriptionEn: existingProduct.description.en,
        descriptionAr: existingProduct.description.ar,
        category: existingProduct.category,
        subcategory: existingProduct.subcategory,
        price: existingProduct.price.toString(),
        images: existingProduct.images,
        sizes: existingProduct.sizes.map(s => ({ size: s.size, stock: s.stock.toString() })),
        isNew: existingProduct.isNew,
        featured: existingProduct.featured,
      })
    }
  }, [existingProduct])

  // Drag and drop for images
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
  })

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', stock: '' }]
    }))
  }

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }))
  }

  const updateSize = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((s, i) => 
        i === index ? { ...s, [field]: value } : s
      )
    }))
  }

  const currentCategory = categories.find(c => c.id === formData.category)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.articleNumber || !formData.nameEn || !formData.nameAr || !formData.category || !formData.price) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة')
      setLoading(false)
      return
    }

    const validSizes = formData.sizes.filter(s => s.size && s.stock)
    if (validSizes.length === 0) {
      toast.error(language === 'en' ? 'Please add at least one size' : 'يرجى إضافة مقاس واحد على الأقل')
      setLoading(false)
      return
    }

    const productData = {
      articleNumber: formData.articleNumber,
      name: { en: formData.nameEn, ar: formData.nameAr },
      description: { en: formData.descriptionEn, ar: formData.descriptionAr },
      category: formData.category,
      subcategory: formData.subcategory,
      price: Number(formData.price),
      images: formData.images,
      sizes: validSizes.map(s => ({ size: s.size, stock: Number(s.stock) })),
      isNew: formData.isNew,
      featured: formData.featured,
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (isEditing) {
      updateProduct(productId, productData)
      toast.success(language === 'en' ? 'Product updated!' : 'تم تحديث المنتج!')
    } else {
      addProduct(productData)
      toast.success(language === 'en' ? 'Product added!' : 'تمت إضافة المنتج!')
    }

    setLoading(false)
    navigate('/admin/products')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {isEditing ? t('admin.editProduct') : t('admin.addProduct')}
        </h1>
        <p className="text-dark-600">
          {language === 'en' 
            ? 'Fill in the product details in both languages'
            : 'أدخل تفاصيل المنتج باللغتين'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-dark-100 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-6">
            {language === 'en' ? 'Basic Information' : 'المعلومات الأساسية'}
          </h2>

          {/* Article Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark-600 mb-2">
              {t('admin.articleNumber')} *
            </label>
            <input
              type="text"
              value={formData.articleNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, articleNumber: e.target.value }))}
              className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="e.g., PD-SH-001"
              required
            />
          </div>

          {/* Product Names - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">
                {t('admin.productName')} (English) *
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="Product Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">
                {t('admin.productNameAr')} *
              </label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30 text-right"
                placeholder="اسم المنتج"
                dir="rtl"
                required
              />
            </div>
          </div>

          {/* Descriptions - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">
                {t('admin.description')} (English)
              </label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30 h-32"
                placeholder="Product description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">
                {t('admin.descriptionAr')}
              </label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30 h-32 text-right"
                placeholder="وصف المنتج..."
                dir="rtl"
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">
                {t('admin.category')} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                required
              >
                <option value="">{language === 'en' ? 'Select category' : 'اختر القسم'}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name[language]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">
                {t('admin.subcategory')}
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                disabled={!currentCategory}
              >
                <option value="">{language === 'en' ? 'Select subcategory' : 'اختر القسم الفرعي'}</option>
                {currentCategory?.subcategories.map((subId) => (
                  <option key={subId} value={subId}>
                    {subcategories[subId]?.[language]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark-600 mb-2">
              {t('admin.price')} *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="0"
              min="0"
              required
            />
          </div>

          {/* Badges */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                className="w-5 h-5 rounded bg-dark-200 border-dark-300 text-primary focus:ring-primary"
              />
              <span className="text-white">{t('product.new')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-5 h-5 rounded bg-dark-200 border-dark-300 text-primary focus:ring-primary"
              />
              <span className="text-white">{t('product.featured')}</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-dark-100 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-6">
            {t('admin.images')}
          </h2>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-dark-300 hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <HiOutlinePhotograph className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-white mb-2">{t('admin.dropImages')}</p>
            <p className="text-dark-600 text-sm">PNG, JPG, WEBP</p>
          </div>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {formData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sizes & Stock */}
        <div className="bg-dark-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">
              {t('admin.sizes')}
            </h2>
            <button
              type="button"
              onClick={addSize}
              className="flex items-center gap-2 text-primary hover:text-white transition-colors"
            >
              <HiOutlinePlus className="w-5 h-5" />
              {t('admin.addSize')}
            </button>
          </div>

          <div className="space-y-4">
            {formData.sizes.map((size, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => updateSize(index, 'size', e.target.value)}
                    className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder={language === 'en' ? 'Size (e.g., S, M, 42)' : 'المقاس (مثل S, M, 42)'}
                  />
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={size.stock}
                    onChange={(e) => updateSize(index, 'stock', e.target.value)}
                    className="w-full bg-dark-200 text-white px-4 py-3 rounded-lg border border-dark-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder={t('admin.stock')}
                    min="0"
                  />
                </div>
                {formData.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="flex-1 bg-dark-200 hover:bg-dark-300 text-white font-bold py-4 rounded-lg transition-colors"
          >
            {t('admin.cancel')}
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-yellow-400 text-dark font-bold py-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              t('admin.save')
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
