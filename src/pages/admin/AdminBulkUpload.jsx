import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { useLanguage } from '../../context/LanguageContext'
import { useProductStore, categories, subcategories } from '../../store/productStore'
import toast from 'react-hot-toast'
import { 
  HiOutlineDocumentText, 
  HiOutlineDownload, 
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineExclamation
} from 'react-icons/hi'

export default function AdminBulkUpload() {
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const { addProducts } = useProductStore()
  
  const [parsedData, setParsedData] = useState([])
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('upload') // upload, preview, complete

  const parseFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase()
    
    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          validateAndSetData(results.data)
        },
        error: (error) => {
          toast.error(language === 'en' ? 'Error parsing CSV file' : 'خطأ في قراءة ملف CSV')
          console.error(error)
        }
      })
    } else if (['xlsx', 'xls'].includes(extension)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet)
          validateAndSetData(data)
        } catch (error) {
          toast.error(language === 'en' ? 'Error parsing Excel file' : 'خطأ في قراءة ملف Excel')
          console.error(error)
        }
      }
      reader.readAsBinaryString(file)
    } else {
      toast.error(language === 'en' ? 'Unsupported file format' : 'صيغة ملف غير مدعومة')
    }
  }

  const validateAndSetData = (data) => {
    const validationErrors = []
    const validProducts = []

    // Helper to get value from row with multiple possible column names
    const getValue = (row, ...keys) => {
      for (const key of keys) {
        // Try exact match
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') return row[key]
        // Try case-insensitive match
        const lowerKey = key.toLowerCase()
        for (const rowKey of Object.keys(row)) {
          if (rowKey.toLowerCase() === lowerKey || rowKey.toLowerCase().includes(lowerKey)) {
            if (row[rowKey] !== undefined && row[rowKey] !== null && row[rowKey] !== '') {
              return row[rowKey]
            }
          }
        }
      }
      return null
    }

    // Helper to detect category from product name
    const detectCategory = (name) => {
      const lowerName = (name || '').toLowerCase()
      if (lowerName.includes('padel') || lowerName.includes('court')) return 'padel'
      if (lowerName.includes('football') || lowerName.includes('soccer')) return 'football'
      if (lowerName.includes('swim') || lowerName.includes('goggle')) return 'swimming'
      if (lowerName.includes('tennis') || lowerName.includes('racket')) return 'tennis'
      return 'padel' // Default to padel
    }

    // Helper to detect subcategory from product name
    const detectSubcategory = (name) => {
      const lowerName = (name || '').toLowerCase()
      if (lowerName.includes('shoe') || lowerName.includes('court s') || lowerName.includes('boot')) return 'shoes'
      if (lowerName.includes('racket') || lowerName.includes('racquet')) return 'rackets'
      if (lowerName.includes('ball')) return 'balls'
      if (lowerName.includes('shirt') || lowerName.includes('jersey') || lowerName.includes('short')) return 'apparel'
      if (lowerName.includes('strap') || lowerName.includes('bag') || lowerName.includes('grip')) return 'accessories'
      return 'accessories' // Default
    }

    data.forEach((row, index) => {
      const rowNum = index + 2 // +2 because header is row 1 and array is 0-indexed

      // Try to get values with flexible column name matching
      const articleNumber = getValue(row, 'articleNumber', 'Article', 'article', 'Article Number', 'ArticleNumber', 'SKU', 'sku', 'Code', 'code', 'EAN Code', 'EAN')
      const productName = getValue(row, 'nameEn', 'Description', 'description', 'Name', 'name', 'Product', 'product', 'Product Name', 'Title', 'title')
      const productNameAr = getValue(row, 'nameAr', 'Arabic Name', 'arabicName', 'Name Arabic', 'الاسم') || productName
      const price = getValue(row, 'price', 'Price', 'Final Price', 'FinalPrice', 'final price', 'Cost', 'cost', 'السعر')
      const category = getValue(row, 'category', 'Category', 'cat', 'القسم')
      const subcategory = getValue(row, 'subcategory', 'Subcategory', 'sub', 'Sub Category', 'القسم الفرعي')
      const sizes = getValue(row, 'sizes', 'Sizes', 'Size', 'size', 'المقاسات')
      const stock = getValue(row, 'stock', 'Stock', 'Q', 'Qty', 'Quantity', 'quantity', 'المخزون')
      const images = getValue(row, 'images', 'Images', 'Image', 'image', 'Photo', 'photo', 'الصور')
      const descEn = getValue(row, 'descriptionEn', 'Description En', 'Desc', 'desc') || productName
      const descAr = getValue(row, 'descriptionAr', 'Description Ar', 'الوصف') || productNameAr
      const isNew = getValue(row, 'isNew', 'New', 'new', 'جديد')
      const featured = getValue(row, 'featured', 'Featured', 'مميز')

      // Skip empty rows
      if (!articleNumber && !productName && !price) {
        return
      }

      // Validate required fields - be more lenient
      const rowErrors = []
      if (!productName) rowErrors.push(`Row ${rowNum}: Missing product name`)
      
      // Parse price - handle formatted numbers like "14,900.00"
      let parsedPrice = 0
      if (price) {
        const cleanPrice = String(price).replace(/,/g, '').replace(/[^\d.]/g, '')
        parsedPrice = parseFloat(cleanPrice)
        if (isNaN(parsedPrice)) {
          rowErrors.push(`Row ${rowNum}: Invalid price "${price}"`)
        }
      }

      if (rowErrors.length === 0) {
        // Parse sizes (format: "S:10,M:15,L:8" or just use stock as default)
        const parsedSizes = []
        if (sizes) {
          const sizeParts = String(sizes).split(',')
          sizeParts.forEach(part => {
            const [size, sizeStock] = part.trim().split(':')
            if (size) {
              parsedSizes.push({ 
                size: size.trim(), 
                stock: sizeStock ? Number(sizeStock) : (stock ? Number(stock) : 10) 
              })
            }
          })
        }

        // If no sizes parsed, add a default with stock
        if (parsedSizes.length === 0) {
          parsedSizes.push({ 
            size: 'One Size', 
            stock: stock ? Number(stock) : 10 
          })
        }

        // Auto-detect category if not provided
        const finalCategory = category || detectCategory(productName)
        const finalSubcategory = subcategory || detectSubcategory(productName)

        // Generate article number if not provided
        const finalArticleNumber = articleNumber || `PROD-${Date.now()}-${index}`

        validProducts.push({
          articleNumber: String(finalArticleNumber),
          name: { en: productName, ar: productNameAr },
          description: { 
            en: descEn || productName, 
            ar: descAr || productNameAr 
          },
          category: finalCategory,
          subcategory: finalSubcategory,
          price: parsedPrice,
          images: images ? String(images).split(',').map(url => url.trim()).filter(Boolean) : [],
          sizes: parsedSizes,
          isNew: isNew === 'true' || isNew === '1' || isNew === true,
          featured: featured === 'true' || featured === '1' || featured === true,
        })
      } else {
        validationErrors.push(...rowErrors)
      }
    })

    setErrors(validationErrors)
    setParsedData(validProducts)
    
    if (validProducts.length > 0) {
      setStep('preview')
      toast.success(language === 'en' ? `${validProducts.length} products ready to import!` : `${validProducts.length} منتج جاهز للاستيراد!`)
    } else if (validationErrors.length > 0) {
      toast.error(language === 'en' ? 'No valid products found. Check the errors below.' : 'لم يتم العثور على منتجات صالحة. تحقق من الأخطاء أدناه.')
    } else {
      toast.error(language === 'en' ? 'No data found in file' : 'لا توجد بيانات في الملف')
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      parseFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  })

  const handleImport = async () => {
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    addProducts(parsedData)
    setStep('complete')
    setLoading(false)
    toast.success(
      language === 'en' 
        ? `${parsedData.length} products imported!` 
        : `تم استيراد ${parsedData.length} منتج!`
    )
  }

  const downloadTemplate = () => {
    // Create a template that matches common Excel formats
    const template = [
      {
        'Article': '190981',
        'Description': 'COURT PADEL X3 / yellow',
        'Final Price': 430.00,
        'Category': 'padel',
        'Subcategory': 'shoes',
        'Sizes': '40:10,41:15,42:12,43:8',
        'Stock': 10,
        'Arabic Name': 'كورت بادل X3 / أصفر',
        'Is New': 'true',
        'Featured': 'false',
      },
      {
        'Article': '206641',
        'Description': 'WRIST STRAP PADEL / black',
        'Final Price': 500.00,
        'Category': 'padel',
        'Subcategory': 'accessories',
        'Sizes': 'One Size:20',
        'Stock': 20,
        'Arabic Name': 'سوار معصم بادل / أسود',
        'Is New': 'false',
        'Featured': 'false',
      },
      {
        'Article': '216447',
        'Description': 'TECHNICAL VIPER 2.5 / no color',
        'Final Price': 14900.00,
        'Category': 'padel',
        'Subcategory': 'rackets',
        'Sizes': 'One Size:5',
        'Stock': 5,
        'Arabic Name': 'تيكنيكال فايبر 2.5',
        'Is New': 'true',
        'Featured': 'true',
      },
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    
    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, // Article
      { wch: 35 }, // Description
      { wch: 12 }, // Final Price
      { wch: 12 }, // Category
      { wch: 15 }, // Subcategory
      { wch: 25 }, // Sizes
      { wch: 8 },  // Stock
      { wch: 30 }, // Arabic Name
      { wch: 8 },  // Is New
      { wch: 10 }, // Featured
    ]
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')
    XLSX.writeFile(wb, 'albaseet_products_template.xlsx')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('admin.bulkUpload')}
        </h1>
        <p className="text-dark-600">
          {language === 'en' 
            ? 'Upload multiple products at once using CSV or Excel files'
            : 'ارفع منتجات متعددة مرة واحدة باستخدام ملفات CSV أو Excel'}
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center mb-12">
        {['upload', 'preview', 'complete'].map((s, index) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step === s
                ? 'bg-primary text-dark'
                : step === 'complete' || (step === 'preview' && s === 'upload')
                ? 'bg-green-500 text-white'
                : 'bg-dark-300 text-dark-600'
            }`}>
              {step === 'complete' || (step === 'preview' && s === 'upload') ? (
                <HiOutlineCheck className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            {index < 2 && (
              <div className={`w-20 h-1 ${
                (step === 'preview' && index === 0) || step === 'complete'
                  ? 'bg-green-500'
                  : 'bg-dark-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Upload Step */}
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Download Template */}
            <div className="bg-dark-100 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold mb-1">
                    {t('admin.downloadTemplate')}
                  </h3>
                  <p className="text-dark-600 text-sm">
                    {language === 'en' 
                      ? 'Download our Excel template to get started'
                      : 'حمّل قالب Excel للبدء'}
                  </p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 bg-dark-200 hover:bg-dark-300 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <HiOutlineDownload className="w-5 h-5" />
                  {language === 'en' ? 'Download' : 'تحميل'}
                </button>
              </div>
            </div>

            {/* Dropzone */}
            <div className="bg-dark-100 rounded-2xl p-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-300 hover:border-primary'
                }`}
              >
                <input {...getInputProps()} />
                <HiOutlineDocumentText className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">{t('admin.dragDrop')}</p>
                <p className="text-dark-600 mb-4">{t('admin.or')}</p>
                <button className="bg-primary hover:bg-yellow-400 text-dark font-bold px-6 py-2 rounded-lg transition-colors">
                  {t('admin.browse')}
                </button>
                <p className="text-dark-600 text-sm mt-4">
                  {language === 'en' ? 'Supported formats: CSV, XLSX, XLS' : 'الصيغ المدعومة: CSV, XLSX, XLS'}
                </p>
              </div>
            </div>

            {/* Format Guide */}
            <div className="bg-dark-100 rounded-2xl p-6 mt-6">
              <h3 className="text-white font-bold mb-4">
                {language === 'en' ? 'Supported Column Names' : 'أسماء الأعمدة المدعومة'}
              </h3>
              <div className="text-dark-600 text-sm space-y-2">
                <p><strong className="text-primary">Article / Article Number / SKU:</strong> {language === 'en' ? 'Product code' : 'رمز المنتج'}</p>
                <p><strong className="text-primary">Description / Name / Product:</strong> {language === 'en' ? 'Product name (English)' : 'اسم المنتج'}</p>
                <p><strong className="text-primary">Final Price / Price / Cost:</strong> {language === 'en' ? 'Price in EGP' : 'السعر بالجنيه'}</p>
                <p><strong className="text-primary">Category:</strong> {language === 'en' ? 'Auto-detected from name if empty (padel, football, swimming, tennis)' : 'يتم اكتشافه تلقائياً من الاسم'}</p>
                <p><strong className="text-primary">Sizes:</strong> {language === 'en' ? 'Format: 40:10,41:15,42:12 (size:stock) or leave empty' : 'الصيغة: 40:10,41:15,42:12'}</p>
                <p><strong className="text-primary">Stock / Q / Qty:</strong> {language === 'en' ? 'Default stock quantity' : 'كمية المخزون'}</p>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
                <p className="text-primary text-sm">
                  {language === 'en' 
                    ? '✨ Smart Import: Category & subcategory are auto-detected from product names!'
                    : '✨ استيراد ذكي: يتم اكتشاف القسم تلقائياً من اسم المنتج!'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiOutlineExclamation className="w-6 h-6 text-red-500" />
                  <h3 className="text-red-500 font-bold">
                    {errors.length} {language === 'en' ? 'errors found' : 'أخطاء'}
                  </h3>
                </div>
                <ul className="text-red-400 text-sm space-y-1 max-h-40 overflow-auto">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview Table */}
            <div className="bg-dark-100 rounded-2xl overflow-hidden mb-6">
              <div className="p-6 border-b border-dark-200">
                <h3 className="text-white font-bold">
                  {parsedData.length} {language === 'en' ? 'products ready to import' : 'منتج جاهز للاستيراد'}
                </h3>
              </div>
              
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-dark-200 sticky top-0">
                    <tr>
                      <th className="text-left px-6 py-3 text-dark-600 font-medium text-sm">
                        {t('admin.articleNumber')}
                      </th>
                      <th className="text-left px-6 py-3 text-dark-600 font-medium text-sm">
                        {language === 'en' ? 'Name' : 'الاسم'}
                      </th>
                      <th className="text-left px-6 py-3 text-dark-600 font-medium text-sm">
                        {t('admin.category')}
                      </th>
                      <th className="text-left px-6 py-3 text-dark-600 font-medium text-sm">
                        {t('admin.price')}
                      </th>
                      <th className="text-left px-6 py-3 text-dark-600 font-medium text-sm">
                        {t('admin.sizes')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.map((product, index) => (
                      <tr key={index} className="border-t border-dark-200">
                        <td className="px-6 py-3 text-dark-600 font-mono text-sm">
                          {product.articleNumber}
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-white text-sm">{product.name.en}</p>
                          <p className="text-dark-600 text-sm">{product.name.ar}</p>
                        </td>
                        <td className="px-6 py-3 text-white text-sm">
                          {categories.find(c => c.id === product.category)?.name[language]}
                        </td>
                        <td className="px-6 py-3 text-primary font-bold text-sm">
                          {product.price.toLocaleString()} {t('common.currency')}
                        </td>
                        <td className="px-6 py-3 text-dark-600 text-sm">
                          {product.sizes.map(s => `${s.size}(${s.stock})`).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep('upload')
                  setParsedData([])
                  setErrors([])
                }}
                className="flex-1 bg-dark-200 hover:bg-dark-300 text-white font-bold py-4 rounded-lg transition-colors"
              >
                {t('admin.cancel')}
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleImport}
                disabled={loading || parsedData.length === 0}
                className="flex-1 bg-primary hover:bg-yellow-400 text-dark font-bold py-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <HiOutlineCheck className="w-5 h-5" />
                    {t('admin.import')} ({parsedData.length})
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'en' ? 'Import Complete!' : 'اكتمل الاستيراد!'}
            </h2>
            <p className="text-dark-600 mb-8">
              {parsedData.length} {language === 'en' ? 'products have been added to your store' : 'منتج تمت إضافتهم إلى متجرك'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setStep('upload')
                  setParsedData([])
                  setErrors([])
                }}
                className="bg-dark-200 hover:bg-dark-300 text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                {language === 'en' ? 'Import More' : 'استيراد المزيد'}
              </button>
              <button
                onClick={() => navigate('/admin/products')}
                className="bg-primary hover:bg-yellow-400 text-dark font-bold px-6 py-3 rounded-lg transition-colors"
              >
                {language === 'en' ? 'View Products' : 'عرض المنتجات'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
