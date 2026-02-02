-- ============================================
-- ALBASEET SUPABASE SETUP
-- Run this in your Supabase SQL Editor
-- This is SEPARATE from Playmaker tables
-- ============================================

-- Create ALBASEET products table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_albaseet_products_category ON albaseet_products(category);
CREATE INDEX IF NOT EXISTS idx_albaseet_products_created ON albaseet_products(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE albaseet_products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for website)
CREATE POLICY "Allow public read access" ON albaseet_products
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (for admin)
CREATE POLICY "Allow authenticated insert" ON albaseet_products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON albaseet_products
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON albaseet_products
  FOR DELETE USING (true);

-- ============================================
-- STORAGE BUCKET FOR ALBASEET IMAGES
-- ============================================
-- Go to Storage in Supabase Dashboard and:
-- 1. Click "New bucket"
-- 2. Name: albaseet-images
-- 3. Make it PUBLIC
-- 4. Click Create

-- Or run this (if you have permissions):
INSERT INTO storage.buckets (id, name, public)
VALUES ('albaseet-images', 'albaseet-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for public access
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'albaseet-images');

CREATE POLICY "Allow uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'albaseet-images');

CREATE POLICY "Allow updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'albaseet-images');

CREATE POLICY "Allow deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'albaseet-images');

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
/*
INSERT INTO albaseet_products (article_number, name, description, category, subcategory, price, sizes, is_new, featured)
VALUES 
  ('PD-SH-001', 
   '{"en": "Pro Padel Court Shoes", "ar": "حذاء ملعب بادل برو"}',
   '{"en": "Professional padel court shoes", "ar": "أحذية ملعب بادل احترافية"}',
   'padel', 'shoes', 2499,
   '[{"size": "40", "stock": 5}, {"size": "41", "stock": 10}, {"size": "42", "stock": 8}]',
   true, true),
   
  ('PD-RC-001',
   '{"en": "Carbon Pro Padel Racket", "ar": "مضرب بادل كربون برو"}',
   '{"en": "High-performance carbon fiber padel racket", "ar": "مضرب بادل من ألياف الكربون عالي الأداء"}',
   'padel', 'rackets', 3999,
   '[{"size": "One Size", "stock": 15}]',
   false, true);
*/
