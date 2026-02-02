// Add products to Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://upooyypqhftzzwjrfyra.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb295eXBxaGZ0enp3anJmeXJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI1Mzc4MiwiZXhwIjoyMDc2ODI5NzgyfQ.su0cUrb0PsMWdjVfhjfGOfKsadheKVB0ygatYJdCx5o'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const products = [
  // PADEL PRODUCTS
  {
    article_number: 'PD-SH-001',
    name: { en: 'Pro Padel Court Shoes', ar: 'حذاء ملعب بادل برو' },
    description: { en: 'Professional padel court shoes with excellent grip and lateral support for quick movements.', ar: 'أحذية ملعب بادل احترافية مع قبضة ممتازة ودعم جانبي للحركات السريعة.' },
    category: 'padel',
    subcategory: 'shoes',
    price: 2499,
    images: [],
    sizes: [{ size: '40', stock: 5 }, { size: '41', stock: 10 }, { size: '42', stock: 8 }, { size: '43', stock: 12 }, { size: '44', stock: 4 }],
    is_new: true,
    featured: true
  },
  {
    article_number: 'PD-RC-001',
    name: { en: 'Carbon Pro Padel Racket', ar: 'مضرب بادل كربون برو' },
    description: { en: 'High-performance carbon fiber padel racket for advanced players. Perfect balance of power and control.', ar: 'مضرب بادل من ألياف الكربون عالي الأداء للاعبين المتقدمين. توازن مثالي بين القوة والتحكم.' },
    category: 'padel',
    subcategory: 'rackets',
    price: 3999,
    images: [],
    sizes: [{ size: 'One Size', stock: 15 }],
    is_new: false,
    featured: true
  },
  {
    article_number: 'PD-BL-001',
    name: { en: 'Premium Padel Balls (3 Pack)', ar: 'كرات بادل فاخرة (عبوة 3)' },
    description: { en: 'Tournament-grade padel balls with consistent bounce and durability.', ar: 'كرات بادل بمستوى البطولات مع ارتداد ثابت ومتانة.' },
    category: 'padel',
    subcategory: 'rackets',
    price: 299,
    images: [],
    sizes: [{ size: '3 Pack', stock: 50 }],
    is_new: false,
    featured: false
  },
  {
    article_number: 'PD-AP-001',
    name: { en: 'Padel Performance Shirt', ar: 'قميص بادل للأداء' },
    description: { en: 'Breathable moisture-wicking padel shirt for maximum comfort during play.', ar: 'قميص بادل قابل للتنفس وماص للرطوبة لأقصى راحة أثناء اللعب.' },
    category: 'padel',
    subcategory: 'apparel',
    price: 449,
    images: [],
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 12 }, { size: 'XL', stock: 8 }],
    is_new: true,
    featured: false
  },
  {
    article_number: 'PD-AC-001',
    name: { en: 'Padel Grip Overgrip (3 Pack)', ar: 'قبضة بادل إضافية (عبوة 3)' },
    description: { en: 'Premium overgrip for enhanced racket control and sweat absorption.', ar: 'قبضة إضافية فاخرة لتحكم أفضل في المضرب وامتصاص العرق.' },
    category: 'padel',
    subcategory: 'accessories',
    price: 99,
    images: [],
    sizes: [{ size: 'One Size', stock: 100 }],
    is_new: false,
    featured: false
  },
  {
    article_number: 'PD-BG-001',
    name: { en: 'Padel Racket Bag', ar: 'حقيبة مضرب بادل' },
    description: { en: 'Professional padel bag with thermal insulation to protect your rackets.', ar: 'حقيبة بادل احترافية مع عزل حراري لحماية مضاربك.' },
    category: 'padel',
    subcategory: 'accessories',
    price: 799,
    images: [],
    sizes: [{ size: 'One Size', stock: 20 }],
    is_new: true,
    featured: true
  },

  // FOOTBALL PRODUCTS
  {
    article_number: 'FB-SH-001',
    name: { en: 'Elite Football Boots', ar: 'حذاء كرة قدم إيليت' },
    description: { en: 'Professional football boots with superior ball control and traction on all surfaces.', ar: 'أحذية كرة قدم احترافية مع تحكم فائق بالكرة وثبات على جميع الأسطح.' },
    category: 'football',
    subcategory: 'shoes',
    price: 3299,
    images: [],
    sizes: [{ size: '39', stock: 3 }, { size: '40', stock: 8 }, { size: '41', stock: 10 }, { size: '42', stock: 12 }, { size: '43', stock: 5 }, { size: '44', stock: 4 }],
    is_new: true,
    featured: true
  },
  {
    article_number: 'FB-SH-002',
    name: { en: 'Indoor Football Shoes', ar: 'أحذية كرة قدم داخلية' },
    description: { en: 'Non-marking indoor football shoes with excellent grip for futsal and indoor games.', ar: 'أحذية كرة قدم داخلية لا تترك علامات مع قبضة ممتازة للفوتسال والألعاب الداخلية.' },
    category: 'football',
    subcategory: 'shoes',
    price: 1899,
    images: [],
    sizes: [{ size: '40', stock: 15 }, { size: '41', stock: 12 }, { size: '42', stock: 10 }, { size: '43', stock: 8 }],
    is_new: false,
    featured: false
  },
  {
    article_number: 'FB-BL-001',
    name: { en: 'Match Football', ar: 'كرة قدم للمباريات' },
    description: { en: 'FIFA-approved match ball with perfect flight and consistent performance.', ar: 'كرة مباريات معتمدة من الفيفا مع طيران مثالي وأداء ثابت.' },
    category: 'football',
    subcategory: 'rackets',
    price: 899,
    images: [],
    sizes: [{ size: 'Size 5', stock: 30 }],
    is_new: false,
    featured: true
  },
  {
    article_number: 'FB-AP-001',
    name: { en: 'Pro Training Jersey', ar: 'قميص تدريب برو' },
    description: { en: 'Lightweight training jersey with Dri-FIT technology for intense workouts.', ar: 'قميص تدريب خفيف مع تقنية دراي-فيت للتمارين المكثفة.' },
    category: 'football',
    subcategory: 'apparel',
    price: 599,
    images: [],
    sizes: [{ size: 'S', stock: 20 }, { size: 'M', stock: 25 }, { size: 'L', stock: 20 }, { size: 'XL', stock: 15 }, { size: 'XXL', stock: 5 }],
    is_new: true,
    featured: false
  },
  {
    article_number: 'FB-AP-002',
    name: { en: 'Football Shorts', ar: 'شورت كرة قدم' },
    description: { en: 'Comfortable football shorts with elastic waistband and side pockets.', ar: 'شورت كرة قدم مريح مع حزام مطاطي وجيوب جانبية.' },
    category: 'football',
    subcategory: 'apparel',
    price: 349,
    images: [],
    sizes: [{ size: 'S', stock: 25 }, { size: 'M', stock: 30 }, { size: 'L', stock: 25 }, { size: 'XL', stock: 15 }],
    is_new: false,
    featured: false
  },
  {
    article_number: 'FB-AC-001',
    name: { en: 'Goalkeeper Gloves', ar: 'قفازات حارس مرمى' },
    description: { en: 'Professional goalkeeper gloves with superior grip and finger protection.', ar: 'قفازات حارس مرمى احترافية مع قبضة فائقة وحماية للأصابع.' },
    category: 'football',
    subcategory: 'accessories',
    price: 699,
    images: [],
    sizes: [{ size: '7', stock: 8 }, { size: '8', stock: 12 }, { size: '9', stock: 10 }, { size: '10', stock: 8 }],
    is_new: false,
    featured: false
  },
  {
    article_number: 'FB-AC-002',
    name: { en: 'Shin Guards', ar: 'واقيات الساق' },
    description: { en: 'Lightweight shin guards with ankle protection for maximum safety.', ar: 'واقيات ساق خفيفة الوزن مع حماية للكاحل لأقصى درجات الأمان.' },
    category: 'football',
    subcategory: 'accessories',
    price: 299,
    images: [],
    sizes: [{ size: 'S', stock: 20 }, { size: 'M', stock: 25 }, { size: 'L', stock: 20 }],
    is_new: false,
    featured: false
  },

  // SWIMMING PRODUCTS
  {
    article_number: 'SW-GG-001',
    name: { en: 'Competition Goggles', ar: 'نظارات سباحة للمنافسات' },
    description: { en: 'Anti-fog competition swimming goggles with UV protection and wide field of view.', ar: 'نظارات سباحة للمنافسات مضادة للضباب مع حماية من الأشعة فوق البنفسجية ومجال رؤية واسع.' },
    category: 'swimming',
    subcategory: 'accessories',
    price: 449,
    images: [],
    sizes: [{ size: 'Adult', stock: 20 }, { size: 'Junior', stock: 15 }],
    is_new: false,
    featured: true
  },
  {
    article_number: 'SW-SW-001',
    name: { en: 'Pro Racing Swimsuit', ar: 'بدلة سباحة للسباقات' },
    description: { en: 'Hydrodynamic racing swimsuit for competitive swimmers. Reduces drag and improves speed.', ar: 'بدلة سباحة هيدروديناميكية للسباحين التنافسيين. تقلل المقاومة وتحسن السرعة.' },
    category: 'swimming',
    subcategory: 'apparel',
    price: 1299,
    images: [],
    sizes: [{ size: 'XS', stock: 5 }, { size: 'S', stock: 10 }, { size: 'M', stock: 12 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 4 }],
    is_new: true,
    featured: false
  },
  {
    article_number: 'SW-CP-001',
    name: { en: 'Silicone Swim Cap', ar: 'قبعة سباحة سيليكون' },
    description: { en: 'Durable silicone swim cap that reduces drag and protects hair.', ar: 'قبعة سباحة سيليكون متينة تقلل المقاومة وتحمي الشعر.' },
    category: 'swimming',
    subcategory: 'accessories',
    price: 149,
    images: [],
    sizes: [{ size: 'One Size', stock: 50 }],
    is_new: false,
    featured: false
  },
  {
    article_number: 'SW-FL-001',
    name: { en: 'Training Fins', ar: 'زعانف تدريب' },
    description: { en: 'Short blade training fins for improving kick technique and leg strength.', ar: 'زعانف تدريب قصيرة لتحسين تقنية الركل وقوة الساق.' },
    category: 'swimming',
    subcategory: 'equipment',
    price: 599,
    images: [],
    sizes: [{ size: '36-37', stock: 8 }, { size: '38-39', stock: 12 }, { size: '40-41', stock: 10 }, { size: '42-43', stock: 8 }],
    is_new: true,
    featured: false
  },
  {
    article_number: 'SW-PB-001',
    name: { en: 'Pull Buoy', ar: 'عوامة السحب' },
    description: { en: 'EVA foam pull buoy for upper body swimming drills.', ar: 'عوامة سحب من رغوة EVA لتمارين السباحة بالجزء العلوي.' },
    category: 'swimming',
    subcategory: 'equipment',
    price: 199,
    images: [],
    sizes: [{ size: 'One Size', stock: 30 }],
    is_new: false,
    featured: false
  },

  // TENNIS PRODUCTS
  {
    article_number: 'TN-RC-001',
    name: { en: 'Tournament Tennis Racket', ar: 'مضرب تنس البطولات' },
    description: { en: 'Professional tournament tennis racket with optimal power and spin control.', ar: 'مضرب تنس احترافي للبطولات مع قوة مثالية وتحكم في الدوران.' },
    category: 'tennis',
    subcategory: 'rackets',
    price: 2799,
    images: [],
    sizes: [{ size: 'G2', stock: 8 }, { size: 'G3', stock: 10 }, { size: 'G4', stock: 5 }],
    is_new: true,
    featured: true
  },
  {
    article_number: 'TN-SH-001',
    name: { en: 'All-Court Tennis Shoes', ar: 'حذاء تنس لجميع الملاعب' },
    description: { en: 'Versatile tennis shoes designed for all court surfaces with excellent stability.', ar: 'أحذية تنس متعددة الاستخدامات مصممة لجميع أسطح الملاعب مع ثبات ممتاز.' },
    category: 'tennis',
    subcategory: 'shoes',
    price: 2299,
    images: [],
    sizes: [{ size: '40', stock: 6 }, { size: '41', stock: 10 }, { size: '42', stock: 12 }, { size: '43', stock: 8 }, { size: '44', stock: 5 }],
    is_new: false,
    featured: true
  },
  {
    article_number: 'TN-BL-001',
    name: { en: 'Championship Tennis Balls (4 Pack)', ar: 'كرات تنس البطولات (عبوة 4)' },
    description: { en: 'ITF approved tennis balls for professional play and training.', ar: 'كرات تنس معتمدة من ITF للعب والتدريب الاحترافي.' },
    category: 'tennis',
    subcategory: 'rackets',
    price: 199,
    images: [],
    sizes: [{ size: '4 Pack', stock: 100 }],
    is_new: false,
    featured: false
  },
  {
    article_number: 'TN-AP-001',
    name: { en: 'Tennis Polo Shirt', ar: 'قميص بولو تنس' },
    description: { en: 'Classic tennis polo with moisture management and UV protection.', ar: 'بولو تنس كلاسيكي مع إدارة الرطوبة وحماية من الأشعة فوق البنفسجية.' },
    category: 'tennis',
    subcategory: 'apparel',
    price: 549,
    images: [],
    sizes: [{ size: 'S', stock: 12 }, { size: 'M', stock: 18 }, { size: 'L', stock: 15 }, { size: 'XL', stock: 10 }],
    is_new: false,
    featured: false
  },
  {
    article_number: 'TN-AP-002',
    name: { en: 'Tennis Skirt', ar: 'تنورة تنس' },
    description: { en: 'Athletic tennis skirt with built-in shorts and ball pocket.', ar: 'تنورة تنس رياضية مع شورت مدمج وجيب للكرة.' },
    category: 'tennis',
    subcategory: 'apparel',
    price: 449,
    images: [],
    sizes: [{ size: 'XS', stock: 8 }, { size: 'S', stock: 12 }, { size: 'M', stock: 15 }, { size: 'L', stock: 10 }],
    is_new: true,
    featured: false
  },
  {
    article_number: 'TN-BG-001',
    name: { en: 'Tennis Racket Bag', ar: 'حقيبة مضرب تنس' },
    description: { en: 'Professional tennis bag with thermal compartment for up to 6 rackets.', ar: 'حقيبة تنس احترافية مع حجرة حرارية تتسع حتى 6 مضارب.' },
    category: 'tennis',
    subcategory: 'accessories',
    price: 899,
    images: [],
    sizes: [{ size: 'One Size', stock: 15 }],
    is_new: false,
    featured: false
  },
  {
    article_number: 'TN-AC-001',
    name: { en: 'Tennis Vibration Dampener (2 Pack)', ar: 'مخمد اهتزاز تنس (عبوة 2)' },
    description: { en: 'Reduces string vibration for a more comfortable feel.', ar: 'يقلل اهتزاز الأوتار لشعور أكثر راحة.' },
    category: 'tennis',
    subcategory: 'accessories',
    price: 49,
    images: [],
    sizes: [{ size: 'One Size', stock: 200 }],
    is_new: false,
    featured: false
  }
]

async function addProducts() {
  console.log('🚀 Adding products to Supabase...\n')

  // First, clear existing products
  console.log('🗑️  Clearing existing products...')
  const { error: deleteError } = await supabase
    .from('albaseet_products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

  if (deleteError) {
    console.log('⚠️  Could not delete existing products:', deleteError.message)
  }

  // Insert new products
  console.log('📦 Inserting', products.length, 'products...')
  
  const { data, error } = await supabase
    .from('albaseet_products')
    .insert(products)
    .select()

  if (error) {
    console.log('❌ Error inserting products:', error.message)
    return
  }

  console.log('✅ Successfully added', data.length, 'products!\n')
  
  // Show summary
  const padel = data.filter(p => p.category === 'padel').length
  const football = data.filter(p => p.category === 'football').length
  const swimming = data.filter(p => p.category === 'swimming').length
  const tennis = data.filter(p => p.category === 'tennis').length
  
  console.log('📊 Summary:')
  console.log(`   Padel: ${padel} products`)
  console.log(`   Football: ${football} products`)
  console.log(`   Swimming: ${swimming} products`)
  console.log(`   Tennis: ${tennis} products`)
  console.log(`   Total: ${data.length} products`)
}

addProducts().catch(console.error)
