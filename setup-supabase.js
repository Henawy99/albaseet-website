// ALBASEET Supabase Setup Script
// Run with: node setup-supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://upooyypqhftzzwjrfyra.supabase.co'
// Using service role key for admin operations
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb295eXBxaGZ0enp3anJmeXJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI1Mzc4MiwiZXhwIjoyMDc2ODI5NzgyfQ.su0cUrb0PsMWdjVfhjfGOfKsadheKVB0ygatYJdCx5o'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setup() {
  console.log('🚀 Setting up ALBASEET in Supabase...\n')

  // Step 1: Create the albaseet_products table
  console.log('📦 Creating albaseet_products table...')
  
  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS albaseet_products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        article_number TEXT NOT NULL,
        name JSONB NOT NULL DEFAULT '{"en": "", "ar": ""}',
        description JSONB DEFAULT '{"en": "", "ar": ""}',
        category TEXT NOT NULL,
        subcategory TEXT,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        images TEXT[] DEFAULT '{}',
        sizes JSONB DEFAULT '[]',
        is_new BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  })

  if (tableError) {
    // Try direct query if RPC doesn't exist
    const { error: directError } = await supabase
      .from('albaseet_products')
      .select('id')
      .limit(1)
    
    if (directError && directError.code === '42P01') {
      console.log('⚠️  Table does not exist. Please create it manually in Supabase SQL Editor.')
      console.log('   Copy the SQL from SUPABASE_SETUP.sql file.\n')
    } else if (!directError) {
      console.log('✅ Table already exists!\n')
    }
  } else {
    console.log('✅ Table created!\n')
  }

  // Step 2: Create the storage bucket
  console.log('🪣 Creating albaseet-images storage bucket...')
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  
  if (listError) {
    console.log('⚠️  Could not list buckets:', listError.message)
  } else {
    const bucketExists = buckets.some(b => b.name === 'albaseet-images')
    
    if (bucketExists) {
      console.log('✅ Bucket already exists!\n')
    } else {
      const { error: createError } = await supabase.storage.createBucket('albaseet-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      })
      
      if (createError) {
        console.log('⚠️  Could not create bucket:', createError.message)
        console.log('   Please create it manually in Supabase Storage.\n')
      } else {
        console.log('✅ Bucket created!\n')
      }
    }
  }

  // Step 3: Add sample products
  console.log('📝 Adding sample products...')
  
  const sampleProducts = [
    {
      article_number: 'PD-SH-001',
      name: { en: 'Pro Padel Court Shoes', ar: 'حذاء ملعب بادل برو' },
      description: { en: 'Professional padel court shoes with excellent grip.', ar: 'أحذية ملعب بادل احترافية مع قبضة ممتازة.' },
      category: 'padel',
      subcategory: 'shoes',
      price: 2499,
      images: [],
      sizes: [{ size: '40', stock: 5 }, { size: '41', stock: 10 }, { size: '42', stock: 8 }],
      is_new: true,
      featured: true
    },
    {
      article_number: 'PD-RC-001',
      name: { en: 'Carbon Pro Padel Racket', ar: 'مضرب بادل كربون برو' },
      description: { en: 'High-performance carbon fiber padel racket.', ar: 'مضرب بادل من ألياف الكربون عالي الأداء.' },
      category: 'padel',
      subcategory: 'rackets',
      price: 3999,
      images: [],
      sizes: [{ size: 'One Size', stock: 15 }],
      is_new: false,
      featured: true
    },
    {
      article_number: 'FB-SH-001',
      name: { en: 'Elite Football Boots', ar: 'حذاء كرة قدم إيليت' },
      description: { en: 'Professional football boots for elite players.', ar: 'أحذية كرة قدم احترافية للاعبين المحترفين.' },
      category: 'football',
      subcategory: 'shoes',
      price: 3299,
      images: [],
      sizes: [{ size: '39', stock: 3 }, { size: '40', stock: 8 }, { size: '41', stock: 10 }],
      is_new: true,
      featured: true
    },
    {
      article_number: 'SW-GG-001',
      name: { en: 'Competition Goggles', ar: 'نظارات سباحة للمنافسات' },
      description: { en: 'Anti-fog competition swimming goggles.', ar: 'نظارات سباحة للمنافسات مضادة للضباب.' },
      category: 'swimming',
      subcategory: 'accessories',
      price: 449,
      images: [],
      sizes: [{ size: 'Adult', stock: 20 }, { size: 'Junior', stock: 15 }],
      is_new: false,
      featured: true
    },
    {
      article_number: 'TN-RC-001',
      name: { en: 'Tournament Tennis Racket', ar: 'مضرب تنس البطولات' },
      description: { en: 'Professional tournament tennis racket.', ar: 'مضرب تنس احترافي للبطولات.' },
      category: 'tennis',
      subcategory: 'rackets',
      price: 2799,
      images: [],
      sizes: [{ size: 'G2', stock: 8 }, { size: 'G3', stock: 10 }],
      is_new: true,
      featured: false
    }
  ]

  // Check if products already exist
  const { data: existing } = await supabase
    .from('albaseet_products')
    .select('id')
    .limit(1)

  if (existing && existing.length > 0) {
    console.log('✅ Products already exist, skipping sample data.\n')
  } else {
    const { error: insertError } = await supabase
      .from('albaseet_products')
      .insert(sampleProducts)

    if (insertError) {
      console.log('⚠️  Could not insert sample products:', insertError.message)
      console.log('   You may need to create the table first.\n')
    } else {
      console.log('✅ Sample products added!\n')
    }
  }

  console.log('🎉 Setup complete!')
  console.log('\n📋 Next steps:')
  console.log('1. If table creation failed, run SUPABASE_SETUP.sql in SQL Editor')
  console.log('2. Go to your admin panel: http://localhost:5174/admin')
  console.log('3. Upload product images via drag & drop')
  console.log('4. Images will sync to the live website!')
}

setup().catch(console.error)
