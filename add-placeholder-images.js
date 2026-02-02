// Add placeholder images to all products
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://upooyypqhftzzwjrfyra.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb295eXBxaGZ0enp3anJmeXJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI1Mzc4MiwiZXhwIjoyMDc2ODI5NzgyfQ.su0cUrb0PsMWdjVfhjfGOfKsadheKVB0ygatYJdCx5o'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Free placeholder images from Unsplash (sports themed)
const categoryImages = {
  padel: [
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80', // Padel court
    'https://images.unsplash.com/photo-1617083934555-ac7d4e4b4c67?w=800&q=80', // Racket sports
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80', // Tennis/padel
  ],
  football: [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', // Football
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', // Soccer ball
    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80', // Football boots
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', // Soccer
  ],
  swimming: [
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80', // Swimming
    'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80', // Pool
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', // Swimmer
  ],
  tennis: [
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80', // Tennis
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80', // Tennis racket
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80', // Tennis court
    'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80', // Tennis balls
  ]
}

async function addPlaceholderImages() {
  console.log('🖼️  Adding placeholder images to products...\n')

  // Get all products
  const { data: products, error: fetchError } = await supabase
    .from('albaseet_products')
    .select('*')

  if (fetchError) {
    console.log('❌ Error fetching products:', fetchError.message)
    return
  }

  console.log(`📦 Found ${products.length} products\n`)

  let updated = 0
  for (const product of products) {
    // Get images for this category
    const images = categoryImages[product.category] || categoryImages.football
    
    // Pick a random image from the category
    const randomIndex = Math.floor(Math.random() * images.length)
    const imageUrl = images[randomIndex]

    // Update product with placeholder image
    const { error: updateError } = await supabase
      .from('albaseet_products')
      .update({ images: [imageUrl] })
      .eq('id', product.id)

    if (updateError) {
      console.log(`❌ Error updating ${product.article_number}:`, updateError.message)
    } else {
      console.log(`✅ ${product.article_number} - ${product.name.en} - Added image`)
      updated++
    }
  }

  console.log(`\n🎉 Done! Updated ${updated}/${products.length} products with images`)
}

addPlaceholderImages().catch(console.error)
