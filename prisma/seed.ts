import { PrismaClient, ProductType, ProductStatus, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Maison Noir database seeding with high-res images...')

  // 1. Clear existing data
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.product.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create Users
  const adminPassword = await hash('admin123', 10)
  const customerPassword = await hash('user123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Autoroma Admin',
      email: 'admin@autoroma.com',
      passwordHash: adminPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  })

  const customer = await prisma.user.create({
    data: {
      name: 'Ankit Kumar',
      email: 'user@autoroma.com',
      passwordHash: customerPassword,
      role: UserRole.CUSTOMER,
      isActive: true,
    },
  })

  console.log(`✅ Created Admin (${admin.email} / admin123) and Customer (${customer.email} / user123)`)

  // 3. Create Collections
  const orientalCol = await prisma.collection.create({
    data: {
      name: 'The Leather & Oud Series',
      slug: 'leather-and-oud',
      description: 'Rich, opulent fragrance notes engineered for luxury sedan and SUV interiors.',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    },
  })

  const coastalCol = await prisma.collection.create({
    data: {
      name: 'The Coastal Series',
      slug: 'coastal-series',
      description: 'Invigorating aquatic and citrus compositions for daily commutes and coastal road trips.',
      imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    },
  })

  const woodsCol = await prisma.collection.create({
    data: {
      name: 'The Woods & Cedar Edition',
      slug: 'woods-and-cedar',
      description: 'Earthy, sophisticated vetiver and cedarwood accords crafted for refined cabin elegance.',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
    },
  })

  console.log('✅ Created 3 Collections')

  // 4. Create Car Fragrance Products with High-Res Unsplash Images
  const productsData = [
    {
      name: 'Ocean Drive Vent Clip',
      slug: 'ocean-drive-vent-clip',
      description: 'An invigorating blast of sea spray, Calabrian bergamot, and sun-bleached driftwood. Attaches securely to any automotive AC vent with a weighted anodized aluminum casing.',
      shortDescription: 'Crisp coastal sea spray & bergamot for AC vents.',
      collectionId: coastalCol.id,
      status: ProductStatus.ACTIVE,
      productType: ProductType.VENT_CLIP,
      price: 49900, // ₹499
      compareAtPrice: 59900,
      sku: 'MN-VC-001',
      stock: 45,
      lowStockThreshold: 10,
      images: [
        '/images/car-vent-perfume-clip.png',
        '/images/hero-woman-perfume-perfect.png',
      ],
      scentFamily: 'Fresh Aquatic',
      intensity: 'Strong',
      longevity: '2–4 Weeks',
      season: ['Summer', 'All-Season'],
      occasion: ['Daily Commute', 'Road Trip'],
      topNotes: ['Sea Spray', 'Calabrian Bergamot', 'Grapefruit'],
      heartNotes: ['Jasmine', 'Neroli', 'Saline Accords'],
      baseNotes: ['Driftwood', 'White Musk', 'Ambergris'],
      compatible: ['All Cars', 'AC Vent Compatible'],
      mountType: ['AC Vent'],
      variants: [
        { id: 'v1', label: 'Single Pack (Vent Clip)', sku: 'MN-VC-001-S', price: 49900, stock: 30 },
        { id: 'v2', label: 'Duo Pack (2 Vent Clips)', sku: 'MN-VC-001-D', price: 89900, stock: 15 },
      ],
      averageRating: 4.8,
      reviewCount: 34,
      salesCount: 140,
      isNew: true,
      isFeatured: true,
    },
    {
      name: 'Royal Oud Interior Spray',
      slug: 'royal-oud-interior-spray',
      description: 'A concentrated luxury cabin mist featuring Cambodian oud, smoky incense, and warm amber. Spray onto car mats and headliners for instant cabin atmosphere.',
      shortDescription: 'Opulent Cambodian oud & amber interior cabin mist (100ml).',
      collectionId: orientalCol.id,
      status: ProductStatus.ACTIVE,
      productType: ProductType.SPRAY,
      price: 89900, // ₹899
      compareAtPrice: 119900,
      sku: 'MN-SP-002',
      stock: 28,
      lowStockThreshold: 5,
      images: [
        '/images/scent-top-notes.png',
        '/images/hero-woman-perfume-perfect.png',
      ],
      scentFamily: 'Oriental Woody',
      intensity: 'Very Strong',
      longevity: 'Long-Lasting (Mist)',
      season: ['Monsoon', 'Winter', 'All-Season'],
      occasion: ['Evening Drive', 'Formal', 'Executive SUV'],
      topNotes: ['Cardamom', 'Pink Pepper'],
      heartNotes: ['Cambodian Oud', 'Taif Rose'],
      baseNotes: ['Amber', 'Sandalwood', 'Dry Leather'],
      compatible: ['All Cars'],
      mountType: ['Interior Spray'],
      variants: [
        { id: 'v3', label: '100ml Aluminum Bottle', sku: 'MN-SP-002-100', price: 89900, stock: 28 },
      ],
      averageRating: 4.9,
      reviewCount: 52,
      salesCount: 210,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Tuscan Leather Dashboard Gel Jar',
      slug: 'tuscan-leather-gel-jar',
      description: 'Slow-evaporating solid gel jar infused with Italian leather, thyme, and saffron. Sits elegantly on the dashboard or cup holder to release subtle scent over 60 days.',
      shortDescription: 'Rich Tuscan leather & saffron slow-evaporating dashboard gel.',
      collectionId: orientalCol.id,
      status: ProductStatus.ACTIVE,
      productType: ProductType.DASHBOARD_GEL,
      price: 69900, // ₹699
      compareAtPrice: 79900,
      sku: 'MN-GEL-003',
      stock: 60,
      lowStockThreshold: 10,
      images: [
        '/images/scent-heart-notes.png',
        '/images/hero-woman-perfume-perfect.png',
      ],
      scentFamily: 'Leather Woody',
      intensity: 'Moderate',
      longevity: '1–3 Months',
      season: ['All-Season'],
      occasion: ['Daily Commute', 'Executive'],
      topNotes: ['Saffron', 'Raspberry', 'Thyme'],
      heartNotes: ['Olibanum', 'Night Blooming Jasmine'],
      baseNotes: ['Tuscan Leather', 'Black Suede', 'Amberwood'],
      compatible: ['Dashboard', 'Cup Holder'],
      mountType: ['Dashboard', 'Cup Holder'],
      variants: [
        { id: 'v4', label: '150g Matte Glass Jar', sku: 'MN-GEL-003-150', price: 69900, stock: 60 },
      ],
      averageRating: 4.7,
      reviewCount: 19,
      salesCount: 88,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Kyoto Cedar Hanging Diffuser',
      slug: 'kyoto-cedar-hanging-diffuser',
      description: 'Handcrafted wooden cap glass diffuser bottle hanging from the rearview mirror. Natural beechwood cap absorbs and diffuses Japanese cedar and Hinoki cypress.',
      shortDescription: 'Hanging wooden cap diffuser with Japanese cedar & Hinoki wood.',
      collectionId: woodsCol.id,
      status: ProductStatus.ACTIVE,
      productType: ProductType.HANGING,
      price: 39900, // ₹399
      compareAtPrice: 49900,
      sku: 'MN-HG-004',
      stock: 80,
      lowStockThreshold: 15,
      images: [
        '/images/car-perfume-craft.png',
        '/images/hero-woman-perfume-perfect.png',
      ],
      scentFamily: 'Woody Earthy',
      intensity: 'Moderate',
      longevity: '2–4 Weeks',
      season: ['All-Season'],
      occasion: ['Daily Commute', 'Road Trip'],
      topNotes: ['Hinoki Wood', 'Yuzu'],
      heartNotes: ['Kyoto Cedar', 'Pine Needles'],
      baseNotes: ['Vetiver', 'Moss', 'Cedarwood'],
      compatible: ['Rearview Mirror'],
      mountType: ['Rearview Mirror'],
      variants: [
        { id: 'v5', label: '10ml Glass Bottle + Wood Cap', sku: 'MN-HG-004-10', price: 39900, stock: 80 },
      ],
      averageRating: 4.6,
      reviewCount: 27,
      salesCount: 175,
      isNew: true,
      isFeatured: true,
    },
  ]

  for (const prod of productsData) {
    await prisma.product.create({ data: prod })
  }

  console.log(`✅ Seeded ${productsData.length} Car Fragrance Products with High-Res Images`)

  // 5. Create Sample Coupon
  await prisma.coupon.create({
    data: {
      code: 'NOIR20',
      type: 'PERCENTAGE',
      value: 20,
      minOrderValue: 49900,
      maxDiscount: 20000,
      startsAt: new Date(),
      isActive: true,
    },
  })

  console.log('✅ Created Coupon NOIR20')
  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
