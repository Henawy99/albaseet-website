// Use existing uploaded images for products without images
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://upooyypqhftzzwjrfyra.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb295eXBxaGZ0enp3anJmeXJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI1Mzc4MiwiZXhwIjoyMDc2ODI5NzgyfQ.su0cUrb0PsMWdjVfhjfGOfKsadheKVB0ygatYJdCx5o'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function useExistingImages() {
  console.log('🔍 Looking for uploaded images in Supabase Storage...\n')

  // List all files in the albaseet-images bucket
  const { data: files, error: listError } = await supabase.storage
    .from('albaseet-images')
    .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

  if (listError) {
    console.log('❌ Error listing files:', listError.message)
    return
  }

  console.log('📁 Files in storage:')
  
  // Collect all image URLs from storage
  let uploadedImages = []
  
  for (const file of files) {
    if (file.name && !file.name.startsWith('.')) {
      // Check if it's a folder
      const { data: folderFiles } = await supabase.storage
        .from('albaseet-images')
        .list(file.name, { limit: 100 })
      
      if (folderFiles && folderFiles.length > 0) {
        // It's a folder, get files inside
        for (const innerFile of folderFiles) {
          if (innerFile.name && !innerFile.name.startsWith('.')) {
            const path = `${file.name}/${innerFile.name}`
            const { data: urlData } = supabase.storage.from('albaseet-images').getPublicUrl(path)
            uploadedImages.push(urlData.publicUrl)
            console.log(`   ✅ ${path}`)
          }
        }
      } else if (file.metadata) {
        // It's a file
        const { data: urlData } = supabase.storage.from('albaseet-images').getPublicUrl(file.name)
        uploadedImages.push(urlData.publicUrl)
        console.log(`   ✅ ${file.name}`)
      }
    }
  }

  if (uploadedImages.length === 0) {
    console.log('\n❌ No uploaded images found in storage bucket.')
    console.log('Looking for images already in products...\n')
    
    // Get images from products that already have them
    const { data: productsWithImages } = await supabase
      .from('albaseet_products')
      .select('images')
      .not('images', 'eq', '{}')
    
    if (productsWithImages) {
      for (const p of productsWithImages) {
        if (p.images && p.images.length > 0) {
          for (const img of p.images) {
            if (img && img.startsWith('http') && img.includes('unsplash')) {
              // Skip placeholder images
              continue
            }
            if (img && img.startsWith('http')) {
              uploadedImages.push(img)
            }
          }
        }
      }
    }
  }

  console.log(`\n📷 Found ${uploadedImages.length} uploaded images`)

  if (uploadedImages.length === 0) {
    console.log('\n⚠️  No real uploaded images found. Using first available images from products...')
    
    // Just get any images that aren't placeholders
    const { data: allProducts } = await supabase
      .from('albaseet_products')
      .select('*')
    
    // Find products with non-unsplash images
    const realImages = []
    for (const p of allProducts) {
      if (p.images && p.images.length > 0) {
        for (const img of p.images) {
          if (img && !img.includes('unsplash') && !img.includes('placeholder')) {
            realImages.push(img)
          }
        }
      }
    }
    
    if (realImages.length > 0) {
      uploadedImages = realImages
      console.log(`Found ${realImages.length} real product images`)
    } else {
      console.log('No real images found. Please upload images first.')
      return
    }
  }

  // Get all products
  const { data: products, error: fetchError } = await supabase
    .from('albaseet_products')
    .select('*')

  if (fetchError) {
    console.log('❌ Error fetching products:', fetchError.message)
    return
  }

  console.log(`\n📦 Updating ${products.length} products with existing images...\n`)

  let updated = 0
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    
    // Use uploaded images in rotation
    const imageIndex = i % uploadedImages.length
    const imageUrl = uploadedImages[imageIndex]

    const { error: updateError } = await supabase
      .from('albaseet_products')
      .update({ images: [imageUrl] })
      .eq('id', product.id)

    if (updateError) {
      console.log(`❌ Error updating ${product.article_number}:`, updateError.message)
    } else {
      console.log(`✅ ${product.article_number} - ${product.name.en} - Using image ${imageIndex + 1}`)
      updated++
    }
  }

  console.log(`\n🎉 Done! Updated ${updated}/${products.length} products`)
}

useExistingImages().catch(console.error)
