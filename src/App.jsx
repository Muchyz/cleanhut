import { useState, useEffect, useRef, useCallback } from "react";

// ─── IMAGE PATHS GUIDE ────────────────────────────────────────────────────────
// All images live in /public/images/ inside your project.
// Folder structure:
//   /public/images/hero/        → hero-slide-1.jpg, hero-slide-2.jpg, hero-slide-3.jpg
//   /public/images/mosaic/      → mosaic-1.jpg … mosaic-6.jpg
//   /public/images/products/    → one .jpg per product (see filenames below)
//
// To use: save your downloaded Pinterest photos with the exact filenames listed.
// ─────────────────────────────────────────────────────────────────────────────

// ─── PRODUCT DATA ────────────────────────────────────────────────────────────
const PRODUCTS = [
  // LIQUIDS
  { id: 1,  name: "Dish Washing Liquid – Lemon",         category: "Liquids",        price: 100,  sizes: ["500ML","1LTR","5LTR","20LTR"],              prices: [100,160,650,2200],   image: "/images/products/dish-wash-lemon.jpg",        description: "Powerful lemon-scented formula cuts through grease effortlessly.",                    badge: "Best Seller", featured: true  },
  { id: 2,  name: "Dish Washing Liquid – Lime (Premium)",category: "Liquids",        price: 110,  sizes: ["500ML","1LTR","5LTR","20LTR"],              prices: [110,190,750,2600],   image: "/images/products/dish-wash-lime.jpg",         description: "Premium lime variant for a streak-free, fresh finish.",                               badge: "Premium",    featured: false },
  { id: 3,  name: "Handwash – Strawberry",               category: "Liquids",        price: 100,  sizes: ["500ML Pump","5LTR","20LTR"],                prices: [100,650,2400],      image: "/images/products/handwash-strawberry.jpg",    description: "Gentle strawberry-scented handwash, moisturises as it cleans.",                       badge: "Best Seller", featured: true  },
  { id: 4,  name: "Handwash Cream – Lemon",              category: "Liquids",        price: 160,  sizes: ["500ML Pump","5LTR","20LTR"],                prices: [160,700,2560],      image: "/images/products/handwash-cream-lemon.jpg",   description: "Luxurious cream handwash with added moisturisers.",                                   badge: null,         featured: false },
  { id: 5,  name: "Pine Antibacterial Handwash",         category: "Liquids",        price: 140,  sizes: ["500ML Pump"],                               prices: [140],               image: "/images/products/handwash-pine.jpg",          description: "Kills 99.9% of bacteria with a refreshing pine fragrance.",                           badge: "Antibacterial", featured: true },
  { id: 6,  name: "Multipurpose Liquid Detergent – Lemon",category: "Liquids",       price: 100,  sizes: ["500ML","1LTR","5LTR","20LTR"],              prices: [100,180,500,1600],  image: "/images/products/multipurpose-lemon.jpg",     description: "Versatile cleaner for floors, surfaces, and fabrics.",                                badge: null,         featured: false },
  { id: 7,  name: "Disinfectant Liquid – Pine",          category: "Liquids",        price: 130,  sizes: ["500ML","1LTR","5LTR","20LTR"],              prices: [130,180,700,2600],  image: "/images/products/disinfectant-pine.jpg",      description: "Hospital-grade pine disinfectant for all surfaces.",                                  badge: "Best Seller", featured: true  },
  { id: 8,  name: "Disinfectant Liquid – Lavender",      category: "Liquids",        price: 130,  sizes: ["500ML","1LTR","5LTR","20LTR"],              prices: [130,160,600,2400],  image: "/images/products/disinfectant-lavender.jpg",  description: "Calming lavender disinfectant, leaves spaces smelling fresh.",                        badge: null,         featured: false },
  { id: 9,  name: "Bleach Regular White",                category: "Liquids",        price: 100,  sizes: ["500ML","1LTR","5LTR","20LTR"],              prices: [100,200,600,2200],  image: "/images/products/bleach-white.jpg",           description: "Sodium Hypochlorite bleach for white clothes and floor disinfection.",                 badge: null,         featured: false },
  { id: 10, name: "Bleach Colour Safe",                  category: "Liquids",        price: 130,  sizes: ["500ML","1LTR","5LTR","20LTR"],              prices: [130,250,700,2400],  image: "/images/products/bleach-colour-safe.jpg",     description: "Safe for coloured clothes, removes stains without fading.",                           badge: null,         featured: false },
  { id: 11, name: "Stain Remover / Toilet Cleaner",      category: "Liquids",        price: 200,  sizes: ["500ML","750ML","1LTR","5LTR","20LTR"],      prices: [200,300,350,1200,4600], image: "/images/products/toilet-cleaner.jpg",      description: "Powerful toilet cleaner that dissolves stains and limescale.",                        badge: "Best Seller", featured: true  },
  { id: 12, name: "Glass Cleaner – Lavender",            category: "Liquids",        price: 160,  sizes: ["500ML","5LTR","20LTR"],                     prices: [160,850,3100],      image: "/images/products/glass-cleaner.jpg",          description: "Streak-free glass and window cleaner, sparkling results.",                            badge: null,         featured: false },
  { id: 13, name: "Oven Cleaner",                        category: "Liquids",        price: 350,  sizes: ["500ML","5LTR","20LTR"],                     prices: [350,1600,6200],     image: "/images/products/oven-cleaner.jpg",           description: "Heavy-duty oven degreaser, removes baked-on oil and grease.",                         badge: null,         featured: false },
  { id: 14, name: "Shower Gel – Flora Fresh",            category: "Liquids",        price: 300,  sizes: ["400ML","800ML","5LTR","20LTR"],             prices: [300,450,860,5600],  image: "/images/products/shower-gel.jpg",             description: "Refreshing floral shower gel for a luxurious bath experience.",                       badge: "Premium",    featured: true  },
  { id: 15, name: "Fabric Softener – Flora Fresh",       category: "Liquids",        price: 300,  sizes: ["1LTR","5LTR","20LTR"],                      prices: [300,1100,4350],     image: "/images/products/fabric-softener.jpg",        description: "Leaves laundry soft, fluffy, and smelling beautifully fresh.",                        badge: null,         featured: false },
  { id: 16, name: "Machine Wash Liquid",                 category: "Liquids",        price: 300,  sizes: ["1LTR","5LTR","20LTR"],                      prices: [300,800,3000],      image: "/images/products/machine-wash-liquid.jpg",    description: "High-efficiency laundry detergent for washing machines.",                             badge: null,         featured: false },
  { id: 17, name: "Degreaser – Industrial",              category: "Liquids",        price: 200,  sizes: ["1LTR","5LTR","20LTR"],                      prices: [200,760,2322],      image: "/images/products/degreaser.jpg",              description: "Industrial-strength degreaser removes oil and grease instantly.",                     badge: null,         featured: false },
  { id: 18, name: "Car Wash Shampoo – Strawberry",       category: "Liquids",        price: 200,  sizes: ["1LTR","5LTR","20LTR"],                      prices: [200,700,2400],      image: "/images/products/car-wash-shampoo.jpg",       description: "pH-balanced car shampoo for a spotless, shiny finish.",                               badge: null,         featured: false },
  { id: 19, name: "Salad Wash",                          category: "Liquids",        price: 650,  sizes: ["1LTR","5LTR"],                              prices: [650,3000],          image: "/images/products/salad-wash.jpg",             description: "Food-safe wash for fruits and vegetables, removes pesticides.",                       badge: null,         featured: false },
  { id: 20, name: "Hand Sanitizer Gel/Liquid",           category: "Liquids",        price: 90,   sizes: ["100ML","500ML","5LTR","20LTR"],             prices: [90,266,1936,7670],  image: "/images/products/hand-sanitizer.jpg",         description: "70% alcohol formula kills germs on contact, quick-dry.",                              badge: "Best Seller", featured: true  },
  // POWDERS
  { id: 21, name: "Scouring Powder – Multi-Surface",     category: "Powders",        price: 90,   sizes: ["500G","1KG","5KG","20KG"],                  prices: [90,160,700,2000],   image: "/images/products/scouring-powder.jpg",        description: "Abrasive powder for toilets, ceramics, and floor whitening.",                         badge: null,         featured: false },
  { id: 22, name: "Laundry Powder",                      category: "Powders",        price: 2500, sizes: ["5KG","20KG"],                               prices: [2500,9500],         image: "/images/products/laundry-powder.jpg",         description: "High-performance laundry powder for washing machines.",                               badge: "Best Seller", featured: true  },
  { id: 23, name: "GX 730 Detergent – Reclaim Whiteness",category: "Powders",        price: 2200, sizes: ["5KG"],                                      prices: [2200],              image: "/images/products/gx730-detergent.jpg",        description: "Powerful whitening detergent restores brilliant white to fabrics.",                   badge: null,         featured: false },
  { id: 24, name: "Hand Washing Powder",                 category: "Powders",        price: 200,  sizes: ["1KG","10KG"],                               prices: [200,1400],          image: "/images/products/hand-washing-powder.jpg",    description: "Gentle on hands, tough on stains for hand-wash laundry.",                             badge: null,         featured: false },
  { id: 25, name: "Drain Cleaner Powder",                category: "Powders",        price: 70,   sizes: ["50G","100G","200G","500G","5KG","20KG"],    prices: [70,125,200,300,2000,7800], image: "/images/products/drain-cleaner.jpg",    description: "Unblocks clogged sinks and pipes fast without harsh chemicals.",                      badge: null,         featured: false },
  { id: 50, name: "Bar Soap",                            category: "Powders",        price: 200,  sizes: ["1KG (10pc)"],                               prices: [200],               image: "/images/products/bar-soap.jpg",               description: "Traditional bar soap for laundry and general cleaning.",                              badge: null,         featured: false },
  // CLEANING TOOLS
  { id: 26, name: "Mop Super (No Handle)",               category: "Cleaning Tools", price: 145,  sizes: ["L1"],                                       prices: [145],               image: "/images/products/mop-super.jpg",              description: "Heavy-duty mop head for large surface cleaning.",                                     badge: null,         featured: false },
  { id: 27, name: "Jumbo Mop with Metal Socket",         category: "Cleaning Tools", price: 400,  sizes: ["L11FH"],                                    prices: [400],               image: "/images/products/mop-jumbo.jpg",              description: "Professional jumbo mop with durable metal socket.",                                   badge: null,         featured: false },
  { id: 28, name: "Soft Broom 11.5\"",                   category: "Cleaning Tools", price: 400,  sizes: ["C10FH"],                                    prices: [400],               image: "/images/products/broom-soft.jpg",             description: "Soft-bristle broom for indoor sweeping on delicate floors.",                          badge: null,         featured: false },
  { id: 29, name: "Broom 18\" Heavy Duty",               category: "Cleaning Tools", price: 595,  sizes: ["E7FH"],                                     prices: [595],               image: "/images/products/broom-heavy.jpg",            description: "Large 18-inch broom for outdoor and commercial use.",                                 badge: null,         featured: false },
  { id: 30, name: "Dustpan with Handle",                 category: "Cleaning Tools", price: 400,  sizes: ["F3"],                                       prices: [400],               image: "/images/products/dustpan.jpg",                description: "Ergonomic dustpan with long handle, no bending required.",                            badge: null,         featured: false },
  { id: 31, name: "Squeegee Floor/Window 17\"",          category: "Cleaning Tools", price: 400,  sizes: ["K5FH"],                                     prices: [400],               image: "/images/products/squeegee.jpg",               description: "Versatile squeegee for sparkling floors and windows.",                                badge: null,         featured: false },
  { id: 32, name: "Scrubbing Brush",                     category: "Cleaning Tools", price: 136,  sizes: ["A1"],                                       prices: [136],               image: "/images/products/scrubbing-brush.jpg",        description: "Stiff-bristle brush for stubborn dirt and grime removal.",                            badge: null,         featured: false },
  { id: 33, name: "Scouring Pad Green (12pc)",           category: "Cleaning Tools", price: 400,  sizes: ["12PC"],                                     prices: [400],               image: "/images/products/scouring-pad.jpg",           description: "Non-scratch scouring pads ideal for pots and pans.",                                 badge: "Best Seller", featured: false },
  { id: 34, name: "Industrial Gloves",                   category: "Cleaning Tools", price: 200,  sizes: ["Black","Green","Red"],                      prices: [200,250,300],       image: "/images/products/gloves.jpg",                 description: "Heavy-duty gloves for safe chemical and cleaning use.",                               badge: null,         featured: false },
  { id: 35, name: "Mop Bucket No.2",                     category: "Cleaning Tools", price: 550,  sizes: ["Standard"],                                 prices: [550],               image: "/images/products/mop-bucket.jpg",             description: "Durable mop bucket with wringer for efficient mopping.",                              badge: null,         featured: false },
  { id: 49, name: "Microfiber Towel",                    category: "Cleaning Tools", price: 200,  sizes: ["Single"],                                   prices: [200],               image: "/images/products/microfiber-towel.jpg",       description: "Ultra-absorbent microfiber cloth, perfect for streak-free cleaning.",                 badge: null,         featured: false },
  // AIR FRESHENERS
  { id: 36, name: "Air Freshener Spray",                 category: "Air Fresheners", price: 220,  sizes: ["300ML"],                                    prices: [220],               image: "/images/products/air-freshener-spray.jpg",    description: "Instant room freshener, long-lasting fragrance burst.",                               badge: null,         featured: false },
  { id: 37, name: "Auto Toilet Cleaner & Air Freshener", category: "Air Fresheners", price: 350,  sizes: ["4pc PKT"],                                  prices: [350],               image: "/images/products/auto-toilet-freshener.jpg",  description: "Automatic toilet freshener, cleans and deodorises with every flush.",                 badge: "Best Seller", featured: true  },
  { id: 38, name: "Blue Bubble – Ocean/Lavender",        category: "Air Fresheners", price: 200,  sizes: ["2pc PKT"],                                  prices: [200],               image: "/images/products/blue-bubble.jpg",            description: "Toilet cistern block for a fresh scent with every flush.",                            badge: null,         featured: false },
  { id: 39, name: "AIRFRESHNER Semi-Auto Machine",       category: "Air Fresheners", price: 1800, sizes: ["Machine+Bottle"],                           prices: [1800],              image: "/images/products/air-freshener-machine.jpg",  description: "Wall-mounted semi-automatic air freshener dispenser.",                                badge: "Premium",    featured: false },
  { id: 40, name: "Car Air Freshener (30 days)",         category: "Air Fresheners", price: 400,  sizes: ["Single"],                                   prices: [400],               image: "/images/products/car-air-freshener.jpg",      description: "Long-lasting car freshener, keeps your car smelling great for 30 days.",              badge: null,         featured: false },
  // PAPER & TISSUE
  { id: 41, name: "Tissue Rolls 200-Sheet (10 Pack)",    category: "Paper & Tissue", price: 250,  sizes: ["10 Pack"],                                  prices: [250],               image: "/images/products/tissue-rolls-10pack.jpg",    description: "Soft, strong 2-ply toilet rolls, 200 sheets per roll.",                               badge: "Best Seller", featured: true  },
  { id: 42, name: "Tissue Rolls Bale (40pc)",            category: "Paper & Tissue", price: 900,  sizes: ["40PC Bale"],                                prices: [900],               image: "/images/products/tissue-rolls-bale.jpg",      description: "Bulk value bale of 40 tissue rolls for offices and homes.",                           badge: null,         featured: false },
  { id: 43, name: "Jumbo Tissue 800-Sheet",              category: "Paper & Tissue", price: 1105, sizes: ["Recycled","Blended"],                       prices: [1105,1690],         image: "/images/products/jumbo-tissue.jpg",           description: "Large jumbo roll for commercial bathrooms and restrooms.",                             badge: null,         featured: false },
  { id: 44, name: "Hand Towel Tissue",                   category: "Paper & Tissue", price: 360,  sizes: ["PKT 12"],                                   prices: [360],               image: "/images/products/hand-towel-tissue.jpg",      description: "Absorbent hand towel tissues for washrooms and kitchens.",                            badge: null,         featured: false },
  // SPECIALTY
  { id: 45, name: "Tyre Shine",                          category: "Specialty",      price: 300,  sizes: ["500ML","1LTR","5LTR","20LTR"],              prices: [300,400,1600,6000], image: "/images/products/tyre-shine.jpg",             description: "Long-lasting tyre shine gives a rich, wet-look finish.",                              badge: null,         featured: false },
  { id: 46, name: "Carpet Shampoo – Lavender",           category: "Specialty",      price: 200,  sizes: ["1LTR","5LTR","20LTR"],                      prices: [200,700,2600],      image: "/images/products/carpet-shampoo.jpg",         description: "Deep-cleaning carpet shampoo removes stains and odours.",                             badge: null,         featured: false },
  { id: 47, name: "Tiles Cleaner (HCL Acid)",            category: "Specialty",      price: 250,  sizes: ["1LTR","5LTR","20LTR"],                      prices: [250,1000,3500],     image: "/images/products/tiles-cleaner.jpg",          description: "Acid-based tiles cleaner dissolves mineral deposits and grout stains.",                badge: null,         featured: false },
  { id: 48, name: "Stubborn Stain Remover (Acid)",       category: "Specialty",      price: 300,  sizes: ["125ML","250ML","500ML","1LTR"],             prices: [300,600,1100,2100], image: "/images/products/stain-remover-acid.jpg",     description: "Industrial acid stain remover for stubborn toilet and tile stains.",                  badge: null,         featured: false },
];

const CATEGORIES = ["All", "Liquids", "Powders", "Cleaning Tools", "Air Fresheners", "Paper & Tissue", "Specialty"];
const formatPrice = (p) => `KSh ${p.toLocaleString()}`;
const WHATSAPP_NUMBER = "254727374142";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Cart: ({ n }) => (
    <div className="relative">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {n > 0 && <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">{n}</span>}
    </div>
  ),
  Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  X: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Minus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  WhatsApp: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.842L.057 23.428a.5.5 0 00.609.61l5.629-1.475A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.016-1.375l-.36-.213-3.727.976.999-3.633-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>,
  Star: () => <svg className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  ArrowDown: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Sparkle: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>,
  Shield: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  Truck: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM1 1h4l2.68 13.39a2 2 0 001.98 1.61H17a2 2 0 001.98-1.71l1.38-9.09H2"/></svg>,
  Tag: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>,
  Chat: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  Award: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>,
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    {toasts.map(t => (
      <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium pointer-events-auto transform transition-all duration-300 ${t.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}>
        {t.type === "success" ? <Icon.Check /> : <Icon.X />}
        {t.message}
      </div>
    ))}
  </div>
);

// ─── SKELETON ─────────────────────────────────────────────────────────────────
const SkeletonCard = ({ dark }) => (
  <div className={`rounded-2xl overflow-hidden shadow ${dark ? "bg-gray-800" : "bg-white"} animate-pulse`}>
    <div className={`h-48 ${dark ? "bg-gray-700" : "bg-gray-200"}`} />
    <div className="p-4 space-y-3">
      <div className={`h-4 rounded ${dark ? "bg-gray-700" : "bg-gray-200"} w-3/4`} />
      <div className={`h-3 rounded ${dark ? "bg-gray-700" : "bg-gray-200"} w-1/2`} />
      <div className={`h-8 rounded-xl ${dark ? "bg-gray-700" : "bg-gray-200"}`} />
    </div>
  </div>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAdd, dark, added }) => {
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const currentPrice = product.prices ? product.prices[selectedSizeIdx] : product.price;
  const currentSize = product.sizes ? product.sizes[selectedSizeIdx] : null;
  const badgeColor = { "Best Seller": "bg-amber-400 text-amber-900", "Premium": "bg-purple-500 text-white", "Antibacterial": "bg-blue-500 text-white" }[product.badge] || "bg-emerald-500 text-white";

  return (
    <div className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col ${dark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}>
      <div className="relative overflow-hidden h-48">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
          onError={e => { e.target.src = "/images/products/placeholder.jpg"; }} />
        {product.badge && <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full ${badgeColor}`}>{product.badge}</span>}
        {product.featured && <span className="absolute top-3 right-3 bg-white/90 text-xs font-bold px-2 py-1 rounded-full text-gray-700">⭐ Featured</span>}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className={`font-bold text-sm leading-tight line-clamp-2 ${dark ? "text-white" : "text-gray-900"}`}>{product.name}</h3>
        <p className={`text-xs line-clamp-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>{product.description}</p>
        <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Icon.Star key={i} />)}<span className={`text-xs ml-1 ${dark ? "text-gray-400" : "text-gray-400"}`}>(4.8)</span></div>
        {product.sizes && product.sizes.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.sizes.map((s, i) => (
              <button key={s} onClick={() => setSelectedSizeIdx(i)} className={`text-xs px-2 py-1 rounded-lg border font-medium transition-all ${i === selectedSizeIdx ? "bg-emerald-600 border-emerald-600 text-white" : dark ? "border-gray-600 text-gray-300 hover:border-emerald-500" : "border-gray-200 text-gray-600 hover:border-emerald-400"}`}>{s}</button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-emerald-600 font-extrabold text-lg">{formatPrice(currentPrice)}</span>
            {currentSize && <span className={`text-xs ml-1 ${dark ? "text-gray-400" : "text-gray-400"}`}>/{currentSize}</span>}
          </div>
          <button onClick={() => onAdd(product, currentSize, currentPrice)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${added ? "bg-emerald-100 text-emerald-700 scale-95" : "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 active:scale-95"}`}>
            {added ? <><Icon.Check /> Added</> : <><Icon.Plus /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── CART SIDEBAR ─────────────────────────────────────────────────────────────
const CartSidebar = ({ cart, open, onClose, onUpdate, onRemove, onCheckout, dark }) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"} ${dark ? "bg-gray-900" : "bg-white"}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>🛒 Your Cart ({cart.reduce((s, i) => s + i.qty, 0)})</h2>
          <button onClick={onClose} className={`p-2 rounded-full hover:bg-gray-100 ${dark ? "hover:bg-gray-800 text-gray-300" : "text-gray-600"}`}><Icon.X /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-6xl">🛒</div>
              <p className={`font-semibold ${dark ? "text-gray-300" : "text-gray-600"}`}>Your cart is empty</p>
              <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>Add some cleaning products to get started!</p>
            </div>
          ) : cart.map(item => (
            <div key={item.cartId} className={`flex gap-3 p-3 rounded-xl ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" onError={e => { e.target.src = "/images/products/placeholder.jpg"; }} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{item.name}</p>
                {item.size && <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{item.size}</p>}
                <p className="text-emerald-600 font-bold text-sm">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => onUpdate(item.cartId, item.qty - 1)} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-emerald-100 transition-colors"><Icon.Minus /></button>
                  <span className={`text-sm font-bold w-6 text-center ${dark ? "text-white" : ""}`}>{item.qty}</span>
                  <button onClick={() => onUpdate(item.cartId, item.qty + 1)} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-emerald-100 transition-colors"><Icon.Plus /></button>
                  <button onClick={() => onRemove(item.cartId)} className="ml-auto text-red-400 hover:text-red-600 transition-colors"><Icon.Trash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className={`p-5 border-t ${dark ? "border-gray-700 bg-gray-900" : "border-gray-100 bg-white"}`}>
            <div className="flex justify-between mb-4">
              <span className={`font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>Total</span>
              <span className="text-emerald-600 font-extrabold text-xl">{formatPrice(total)}</span>
            </div>
            <button onClick={onCheckout} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-200">Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
};

// ─── CHECKOUT MODAL ───────────────────────────────────────────────────────────
const CheckoutModal = ({ cart, open, onClose, dark }) => {
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.location) { alert("Please fill in all fields."); return; }
    const items = cart.map(i => `• ${i.name}${i.size ? ` (${i.size})` : ""} x${i.qty} = ${formatPrice(i.price * i.qty)}`).join("\n");
    const msg = encodeURIComponent(`🧴 *CleanHut Detergents Order*\n\n*Customer:* ${form.name}\n*Phone:* ${form.phone}\n*Location:* ${form.location}\n\n*Order Summary:*\n${items}\n\n*TOTAL: ${formatPrice(total)}*\n\nPlease confirm my order. Thank you!`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    onClose();
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${dark ? "bg-gray-900" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>Checkout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Icon.X /></button>
        </div>
        <div className={`rounded-xl p-3 mb-5 space-y-1 max-h-32 overflow-y-auto ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
          {cart.map(i => (
            <div key={i.cartId} className="flex justify-between text-sm">
              <span className={`truncate mr-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>{i.name}{i.size ? ` (${i.size})` : ""} x{i.qty}</span>
              <span className="font-bold text-emerald-600 flex-shrink-0">{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3 mb-5">
          {[["name","Your Name","text"],["phone","Phone Number","tel"],["location","Delivery Location","text"]].map(([k,p,t]) => (
            <input key={k} type={t} placeholder={p} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${dark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 text-gray-900"}`} />
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className={`font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>Total to Pay</span>
          <span className="text-emerald-600 font-extrabold text-xl">{formatPrice(total)}</span>
        </div>
        <button onClick={handleSubmit} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-200">
          <Icon.WhatsApp /> Send Order via WhatsApp
        </button>
        <p className={`text-xs text-center mt-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>You'll be redirected to WhatsApp to confirm your order</p>
      </div>
    </div>
  );
};

// ─── REDESIGNED HERO SECTION ──────────────────────────────────────────────────
const HeroSection = ({ onShop, dark }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const slides = [
    {
      bg: "/images/hero/hero-slide-1.jpg",
      accent: "#10b981",
      accentDark: "#059669",
      eyebrow: "Kenya's Favourite Cleaning Brand",
      headline: "Clean Smarter.",
      subheadline: "Live Better.",
      sub: "Premium detergents & disinfectants, delivered across Kenya.",
    },
    {
      bg: "/images/hero/hero-slide-2.jpg",
      accent: "#0ea5e9",
      accentDark: "#0284c7",
      eyebrow: "Hospital-Grade Protection",
      headline: "Kills 99.9%",
      subheadline: "of All Germs.",
      sub: "Professional disinfectants trusted by businesses and families alike.",
    },
    {
      bg: "/images/hero/hero-slide-3.jpg",
      accent: "#8b5cf6",
      accentDark: "#7c3aed",
      eyebrow: "Fresh Laundry Every Time",
      headline: "Whites Whiter.",
      subheadline: "Colors Brighter.",
      sub: "Powerful laundry powders and liquids for outstanding results.",
    },
  ];

  const goToSlide = (idx) => {
    if (idx === activeSlide || transitioning) return;
    setTransitioning(true);
    setPrevSlide(activeSlide);
    setActiveSlide(idx);
    setTimeout(() => { setPrevSlide(null); setTransitioning(false); }, 900);
  };

  useEffect(() => {
    const t = setInterval(() => {
      const next = (activeSlide + 1) % slides.length;
      goToSlide(next);
    }, 6000);
    return () => clearInterval(t);
  }, [activeSlide, transitioning]);

  const slide = slides[activeSlide];

  const mosaic = [
    { src: "/images/mosaic/mosaic-1.jpg", label: "Handwash", price: "KSh 100" },
    { src: "/images/mosaic/mosaic-2.jpg", label: "Sanitizer", price: "KSh 90" },
    { src: "/images/mosaic/mosaic-3.jpg", label: "Laundry", price: "KSh 2,500" },
    { src: "/images/mosaic/mosaic-4.jpg", label: "Toilet Cleaner", price: "KSh 200" },
    { src: "/images/mosaic/mosaic-5.jpg", label: "Disinfectant", price: "KSh 130" },
    { src: "/images/mosaic/mosaic-6.jpg", label: "Shower Gel", price: "KSh 300" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');

        .ch-hero { font-family: 'DM Sans', system-ui, sans-serif; }
        .ch-headline { font-family: 'Bebas Neue', Impact, sans-serif; line-height: 0.88; letter-spacing: 0.01em; }

        /* Slide BG crossfade */
        .ch-slide-bg { position: absolute; inset: 0; transition: opacity 0.9s cubic-bezier(0.4,0,0.2,1); }

        /* Content reveal on slide change */
        @keyframes ch-reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .ch-reveal { animation: ch-reveal 0.75s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ch-reveal-1 { animation-delay: 0.05s; }
        .ch-reveal-2 { animation-delay: 0.15s; }
        .ch-reveal-3 { animation-delay: 0.25s; }
        .ch-reveal-4 { animation-delay: 0.35s; }
        .ch-reveal-5 { animation-delay: 0.45s; }

        /* Mosaic float */
        @keyframes ch-float { 0%,100% { transform: translateY(0px) rotate(var(--r,0deg)); } 50% { transform: translateY(-10px) rotate(var(--r,0deg)); } }
        .ch-float { animation: ch-float 7s ease-in-out infinite; }
        .ch-float-2 { animation-duration: 8.5s; animation-delay: 1s; }
        .ch-float-3 { animation-duration: 6.5s; animation-delay: 2s; }
        .ch-float-4 { animation-duration: 9s; animation-delay: 0.5s; }

        /* CTA shimmer sweep */
        .ch-cta-primary { position: relative; overflow: hidden; }
        .ch-cta-primary::after { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.25) 50%, transparent 65%); transform: translateX(-100%) skewX(-10deg); transition: none; }
        .ch-cta-primary:hover::after { transform: translateX(200%) skewX(-10deg); transition: transform 0.55s cubic-bezier(0.4,0,0.2,1); }

        /* Ticker */
        @keyframes ch-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ch-ticker { animation: ch-ticker 22s linear infinite; }

        /* Stat bar grow */
        @keyframes ch-bar { from { width: 0; } to { width: var(--w); } }
        .ch-bar { animation: ch-bar 1.4s cubic-bezier(0.22,1,0.36,1) 0.5s forwards; width: 0; }

        /* Scroll cue */
        @keyframes ch-scroll { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(7px); opacity: 1; } }
        .ch-scroll { animation: ch-scroll 2.2s ease-in-out infinite; }

        /* Noise grain */
        .ch-grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E"); }

        /* Pill tags pop */
        @keyframes ch-pop { from { opacity: 0; transform: scale(0.7) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .ch-pop { opacity: 0; animation: ch-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        /* Mosaic label slide */
        @keyframes ch-label { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .ch-label { animation: ch-label 0.5s ease forwards; }

        /* Divider line */
        .ch-divider { height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent); }

        /* Number counter font */
        .ch-numeral { font-family: 'Bebas Neue', Impact, sans-serif; letter-spacing: 0.05em; }

        /* Review dots */
        @keyframes ch-star-in { from { opacity: 0; transform: scale(0) rotate(-20deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        .ch-star { animation: ch-star-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; opacity: 0; }

        /* Vertical slide number */
        .ch-slide-num { writing-mode: vertical-rl; text-orientation: mixed; }

        /* Mobile hero adjustments */
        @media (max-width: 767px) {
          .ch-mosaic-wrap { display: none; }
          .ch-headline { font-size: clamp(58px, 14vw, 80px) !important; }
        }
      `}</style>

      <section className="ch-hero relative min-h-screen overflow-hidden bg-gray-950">

        {/* ── BG SLIDES ── */}
        {slides.map((s, i) => (
          <div key={i} className="ch-slide-bg" style={{ opacity: i === activeSlide ? 1 : 0, zIndex: 0 }}>
            <img src={s.bg} alt="" className="w-full h-full object-cover"
              style={{ transform: i === activeSlide ? "scale(1.04)" : "scale(1)", transition: "transform 9s ease" }}
              onError={e => { e.target.style.display = "none"; }} />
            {/* Multi-layer cinematic overlay */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.60) 45%, rgba(0,0,0,0.20) 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.10) 40%, transparent 70%)" }} />
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 65% 40%, ${s.accent}1a 0%, transparent 55%)` }} />
          </div>
        ))}

        {/* Grain overlay */}
        <div className="ch-grain absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

        {/* Accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] z-10"
          style={{ background: `linear-gradient(to right, ${slide.accent}, ${slide.accentDark}, transparent)`, transition: "background 0.8s ease" }} />

        {/* ── VERTICAL SLIDE COUNTER (desktop) ── */}
        <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-3">
          <span className="ch-slide-num text-white/30 text-xs font-medium tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            0{activeSlide + 1} / 0{slides.length}
          </span>
          <div className="flex flex-col gap-2 mt-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goToSlide(i)}
                className="transition-all duration-500 rounded-full"
                style={{
                  width: 3,
                  height: i === activeSlide ? 32 : 12,
                  background: i === activeSlide ? slide.accent : "rgba(255,255,255,0.25)",
                }} />
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 min-h-screen flex flex-col">

          {/* Top eyebrow row */}
          <div className="flex items-center justify-between pt-7 pb-2">
            <div key={`eyebrow-${activeSlide}`} className="ch-reveal ch-reveal-1 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide text-white/90"
              style={{ borderColor: `${slide.accent}55`, background: `${slide.accent}18`, backdropFilter: "blur(12px)" }}>
              <span style={{ color: slide.accent }}>◆</span>
              {slide.eyebrow}
            </div>
            {/* Dot nav (mobile + desktop) */}
            <div className="flex lg:hidden items-center gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => goToSlide(i)}
                  className="rounded-full transition-all duration-500"
                  style={{ height: 6, width: i === activeSlide ? 24 : 6, background: i === activeSlide ? slide.accent : "rgba(255,255,255,0.30)" }} />
              ))}
            </div>
          </div>

          {/* Core layout */}
          <div className="flex-1 flex flex-col md:flex-row items-center gap-8 md:gap-12 py-6 md:py-10">

            {/* ── LEFT: Text block ── */}
            <div className="flex-1 max-w-2xl">
              <div key={`content-${activeSlide}`}>

                {/* Giant headline */}
                <h1 className="ch-headline ch-reveal ch-reveal-1 text-white mb-0"
                  style={{ fontSize: "clamp(68px, 10.5vw, 138px)" }}>
                  {slide.headline}
                </h1>
                <h1 className="ch-headline ch-reveal ch-reveal-2 mb-5"
                  style={{
                    fontSize: "clamp(68px, 10.5vw, 138px)",
                    color: slide.accent,
                    textShadow: `0 0 80px ${slide.accent}66`,
                    WebkitTextStroke: "0px"
                  }}>
                  {slide.subheadline}
                </h1>

                {/* Subtext */}
                <p className="ch-reveal ch-reveal-3 text-white/65 text-base md:text-lg font-light leading-relaxed max-w-md mb-7"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {slide.sub}
                </p>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Disinfectants","Handwash","Laundry","Air Fresheners","Tools","Glass Cleaner"].map((tag, i) => (
                    <span key={tag} className="ch-pop text-xs px-3 py-1.5 rounded-full border text-white/75 font-medium"
                      style={{
                        animationDelay: `${0.3 + i * 0.07}s`,
                        borderColor: "rgba(255,255,255,0.18)",
                        background: "rgba(255,255,255,0.07)",
                        backdropFilter: "blur(8px)"
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="ch-reveal ch-reveal-4 flex flex-col sm:flex-row gap-3 mb-10">
                  <button onClick={onShop}
                    className="ch-cta-primary group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                    style={{ background: slide.accent, boxShadow: `0 10px 40px ${slide.accent}44` }}>
                    Shop All Products
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
                    className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                    style={{ borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.10)", backdropFilter: "blur(10px)" }}>
                    <Icon.WhatsApp />
                    WhatsApp Us
                  </a>
                </div>

                {/* Divider */}
                <div className="ch-divider mb-7" />

                {/* Stats row */}
                <div className="ch-reveal ch-reveal-5 flex gap-7 sm:gap-10">
                  {[
                    { value: "50+", label: "Products", w: "88%" },
                    { value: "10K+", label: "Customers", w: "72%" },
                    { value: "24h", label: "Delivery", w: "58%" }
                  ].map(({ value, label, w }) => (
                    <div key={label} className="flex-1">
                      <div className="ch-numeral text-white font-black mb-0.5" style={{ fontSize: "clamp(22px, 3.5vw, 34px)" }}>{value}</div>
                      <div className="text-white/45 text-xs font-medium mb-2 tracking-wide uppercase">{label}</div>
                      <div className="h-px bg-white/10 overflow-hidden rounded-full">
                        <div className="ch-bar h-full rounded-full" style={{ "--w": w, background: slide.accent }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Mosaic card grid ── */}
            <div className="ch-mosaic-wrap flex-shrink-0 relative w-[340px] h-[440px] md:w-[400px] md:h-[500px]">

              {/* Central large card */}
              <div className="ch-float absolute inset-x-10 inset-y-8 rounded-3xl overflow-hidden shadow-2xl"
                style={{ boxShadow: "0 30px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)" }}>
                <img src={mosaic[0].src} alt={mosaic[0].label} className="w-full h-full object-cover"
                  onError={e => { e.target.style.background = "#111827"; e.target.src = ""; }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-white text-xs font-bold tracking-wide uppercase opacity-70">{mosaic[0].label}</p>
                    <p className="text-white font-black text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>{mosaic[0].price}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 border border-white/30">
                    <Icon.Plus />
                  </div>
                </div>
              </div>

              {/* Top-right card */}
              <div className="ch-float ch-float-2 absolute top-0 right-0 w-[120px] h-[130px] md:w-[140px] md:h-[150px] rounded-2xl overflow-hidden shadow-xl"
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.45)", outline: "1px solid rgba(255,255,255,0.10)" }}>
                <img src={mosaic[1].src} alt={mosaic[1].label} className="w-full h-full object-cover"
                  onError={e => { e.target.style.background = "#1f2937"; e.target.src = ""; }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)" }} />
                <p className="absolute bottom-2 left-3 text-white text-xs font-bold tracking-wide">{mosaic[1].label}</p>
              </div>

              {/* Bottom-left card */}
              <div className="ch-float ch-float-3 absolute bottom-0 left-0 w-[110px] h-[115px] md:w-[128px] md:h-[132px] rounded-2xl overflow-hidden shadow-xl"
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.45)", outline: "1px solid rgba(255,255,255,0.10)" }}>
                <img src={mosaic[2].src} alt={mosaic[2].label} className="w-full h-full object-cover"
                  onError={e => { e.target.style.background = "#1f2937"; e.target.src = ""; }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)" }} />
                <p className="absolute bottom-2 left-3 text-white text-xs font-bold tracking-wide">{mosaic[2].label}</p>
              </div>

              {/* Bottom-right card */}
              <div className="ch-float ch-float-4 absolute bottom-1 right-1 w-[95px] h-[100px] md:w-[110px] md:h-[116px] rounded-2xl overflow-hidden shadow-xl"
                style={{ boxShadow: "0 14px 40px rgba(0,0,0,0.45)", outline: "1px solid rgba(255,255,255,0.10)" }}>
                <img src={mosaic[5].src} alt={mosaic[5].label} className="w-full h-full object-cover"
                  onError={e => { e.target.style.background = "#1f2937"; e.target.src = ""; }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)" }} />
                <p className="absolute bottom-2 left-2 text-white text-xs font-bold">{mosaic[5].label}</p>
              </div>

              {/* Floating badge: Premium Quality */}
              <div className="absolute -top-4 left-8 px-4 py-2 rounded-full text-xs font-bold text-white shadow-xl"
                style={{ background: slide.accent, boxShadow: `0 8px 24px ${slide.accent}55`, transition: "background 0.6s ease" }}>
                ✨ Premium Quality
              </div>

              {/* Floating card: price */}
              <div className="ch-float ch-float-2 absolute top-14 -left-10 px-4 py-3 rounded-2xl bg-white shadow-2xl text-left min-w-[110px]"
                style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}>
                <div className="text-gray-400 text-xs font-medium mb-0.5">Starting from</div>
                <div className="font-black text-xl" style={{ color: slide.accent, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>KSh 90</div>
              </div>

              {/* Floating card: delivery */}
              <div className="ch-float ch-float-3 absolute bottom-20 -right-6 md:-right-8 px-4 py-3 rounded-2xl bg-white shadow-2xl"
                style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.18)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚚</span>
                  <div>
                    <div className="font-bold text-gray-800 text-xs leading-tight">Same Day</div>
                    <div className="text-gray-400 text-xs">Nairobi delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: reviews + scroll */}
          <div className="flex items-end justify-between pb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {/* Stars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="ch-star w-4 h-4 fill-amber-400" style={{ animationDelay: `${0.6 + i * 0.08}s` }} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <div>
                <span className="text-white font-bold text-sm">4.9</span>
                <span className="text-white/50 text-xs ml-1">· 2,400+ reviews</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 pl-4 ml-2 border-l border-white/15">
                <div className="flex -space-x-2">
                  {["#10b981","#0ea5e9","#8b5cf6","#f59e0b"].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: c }}>
                      {["N","A","M","K"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-white/50 text-xs">Trusted across Kenya</span>
              </div>
            </div>

            {/* Scroll cue */}
            <button onClick={onShop} className="ch-scroll flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors group">
              <span className="text-xs font-medium tracking-widest uppercase">Explore</span>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
                <Icon.ArrowDown />
              </div>
            </button>
          </div>
        </div>

        {/* ── TICKER STRIP ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden flex items-center"
          style={{ height: 40, background: slide.accent, transition: "background 0.8s ease" }}>
          <div className="ch-ticker flex whitespace-nowrap items-center h-full">
            {[...Array(4)].map((_, rep) => (
              <span key={rep} className="inline-flex items-center gap-8 px-6 text-white text-xs font-bold tracking-widest uppercase">
                {["🧴 Dish Wash","🧼 Handwash","🦠 Disinfectants","👕 Laundry Powder","✨ Glass Cleaner","🚿 Shower Gel","🌿 Fabric Softener","🚗 Car Shampoo"].map(t => (
                  <span key={t} className="inline-flex items-center gap-5">{t}<span className="opacity-30">◆</span></span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// ─── FEATURED SECTION ─────────────────────────────────────────────────────────
const FeaturedSection = ({ onAdd, addedIds, dark }) => {
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);
  return (
    <section className={`py-12 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">⭐</span>
          <div>
            <h2 className={`text-2xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>Featured Products</h2>
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>Our most popular picks</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} dark={dark} added={addedIds.has(p.id)} />)}
        </div>
      </div>
    </section>
  );
};

// ─── REDESIGNED WHY CHOOSE CLEANHUT ──────────────────────────────────────────
const WhyChooseSection = ({ dark }) => {
  const pillars = [
    {
      icon: <Icon.Award />,
      accent: "#10b981",
      label: "Premium Quality",
      headline: "Certified & Tested",
      body: "Every product undergoes rigorous quality testing. You get professional-grade formulations, every single order.",
      stat: "50+", statLabel: "Products",
    },
    {
      icon: <Icon.Truck />,
      accent: "#0ea5e9",
      label: "Fast Delivery",
      headline: "Same-Day Nairobi",
      body: "Order before noon, receive before evening. We deliver across Nairobi and ship nationwide within 24 hours.",
      stat: "24h", statLabel: "Delivery",
    },
    {
      icon: <Icon.Tag />,
      accent: "#f59e0b",
      label: "Best Prices",
      headline: "Wholesale for All",
      body: "Skip the middlemen. Whether you're a home buyer or a business, you get factory-direct pricing on every order.",
      stat: "KSh 90", statLabel: "Starting from",
    },
    {
      icon: <Icon.Chat />,
      accent: "#8b5cf6",
      label: "24/7 Support",
      headline: "Always on WhatsApp",
      body: "Got a question? Drop us a WhatsApp any time of day. A real person responds fast — no bots, no waiting.",
      stat: "< 5min", statLabel: "Response time",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .wc-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease; }
        .wc-card:hover { transform: translateY(-6px); }
        .wc-icon-ring { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .wc-card:hover .wc-icon-ring { transform: scale(1.12) rotate(-6deg); }
        @keyframes wc-reveal { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        .wc-reveal { opacity: 0; animation: wc-reveal 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
        .wc-bar { animation: wc-bar 1.3s cubic-bezier(0.22,1,0.36,1) 0.4s forwards; transform-origin: left; transform: scaleX(0); }
        @keyframes wc-bar { to { transform: scaleX(1); } }
        .wc-numeral { font-family: 'Bebas Neue', Impact, sans-serif; letter-spacing: 0.04em; }
        .wc-header-line { height: 3px; border-radius: 2px; }
      `}</style>

      <section className={`relative py-20 md:py-28 overflow-hidden ${dark ? "bg-gray-950" : "bg-white"}`}>

        {/* Subtle BG pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Emerald glow blob (decorative) */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #10b98118 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #0ea5e914 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

          {/* ── Section header ── */}
          <div className="mb-14 md:mb-18">
            <div className="flex items-center gap-3 mb-4">
              <div className="wc-header-line w-8 bg-emerald-500" />
              <span className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-emerald-400" : "text-emerald-600"}`}>
                Why CleanHut
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div>
                <h2 className={`text-4xl md:text-5xl font-black leading-tight mb-3 ${dark ? "text-white" : "text-gray-950"}`}
                  style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: "0.01em" }}>
                  Trusted By Thousands<br />
                  <span className="text-emerald-500">Across Kenya.</span>
                </h2>
                <p className={`text-base max-w-lg leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  From homes in Westlands to factories in Industrial Area — CleanHut is the cleaning partner Kenya relies on every day.
                </p>
              </div>
              {/* CTA */}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
                className="flex-shrink-0 self-start md:self-auto flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-200">
                <Icon.WhatsApp /> Order on WhatsApp
              </a>
            </div>
          </div>

          {/* ── 4 pillar cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, i) => (
              <div key={p.label}
                className={`wc-card wc-reveal relative rounded-3xl p-6 flex flex-col gap-5 overflow-hidden ${dark ? "bg-gray-900 border border-gray-800" : "bg-gray-50 border border-gray-100"}`}
                style={{ animationDelay: `${0.1 + i * 0.1}s`, boxShadow: dark ? "none" : "0 2px 20px rgba(0,0,0,0.05)" }}>

                {/* Corner accent glow */}
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${p.accent}22 0%, transparent 70%)` }} />

                {/* Icon ring */}
                <div className="wc-icon-ring w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${p.accent}18`, color: p.accent, border: `1.5px solid ${p.accent}30` }}>
                  {p.icon}
                </div>

                {/* Label badge */}
                <div className="flex items-center gap-2">
                  <div className="wc-bar h-[2px] w-6 rounded-full flex-shrink-0" style={{ background: p.accent }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: p.accent }}>{p.label}</span>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className={`font-extrabold text-lg mb-2 leading-snug ${dark ? "text-white" : "text-gray-900"}`}>{p.headline}</h3>
                  <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>{p.body}</p>
                </div>

                {/* Stat */}
                <div className={`pt-4 mt-auto border-t ${dark ? "border-gray-800" : "border-gray-100"}`}>
                  <div className="wc-numeral leading-none mb-0.5" style={{ fontSize: 28, color: p.accent }}>{p.stat}</div>
                  <div className={`text-xs font-medium uppercase tracking-wide ${dark ? "text-gray-500" : "text-gray-400"}`}>{p.statLabel}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Social proof band ── */}
          <div className={`mt-12 rounded-3xl px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-5 ${dark ? "bg-gray-900 border border-gray-800" : "bg-emerald-50 border border-emerald-100"}`}>
            <div className="flex items-center gap-4">
              {/* Avatar stack */}
              <div className="flex -space-x-3">
                {["#10b981","#0ea5e9","#f59e0b","#8b5cf6","#ef4444"].map((c, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-extrabold text-white"
                    style={{ background: c, borderColor: dark ? "#030712" : "#f0fdf4" }}>
                    {["N","A","W","M","J"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>10,000+ happy customers</p>
                <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Homes, offices & businesses across Kenya</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_,i) => <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
                <span className={`text-xs font-semibold ${dark ? "text-gray-300" : "text-gray-600"}`}>4.9 average rating</span>
              </div>
              <div className={`w-px h-10 ${dark ? "bg-gray-700" : "bg-emerald-200"}`} />
              <div className="text-center">
                <div className="wc-numeral text-2xl font-black text-emerald-500">2,400+</div>
                <div className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [addedIds, setAddedIds] = useState(new Set());
  const shopRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const handleAdd = useCallback((product, size, price) => {
    const cartId = `${product.id}-${size || "default"}`;
    setCart(prev => {
      const existing = prev.find(i => i.cartId === cartId);
      if (existing) return prev.map(i => i.cartId === cartId ? {...i, qty: i.qty + 1} : i);
      return [...prev, { cartId, id: product.id, name: product.name, image: product.image, price, size, qty: 1 }];
    });
    setAddedIds(prev => new Set([...prev, product.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n; }), 1500);
    addToast(`✓ ${product.name} added to cart!`);
  }, [addToast]);

  const handleUpdate = useCallback((cartId, qty) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.cartId !== cartId)); return; }
    setCart(prev => prev.map(i => i.cartId === cartId ? {...i, qty} : i));
  }, []);

  const handleRemove = useCallback((cartId) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
    addToast("Item removed from cart", "error");
  }, [addToast]);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-gray-900" : "bg-gray-50"}`} style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <Toast toasts={toasts} />

      <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-300 ${dark ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-100"} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-200">C</div>
            <div>
              <div className={`font-black text-lg leading-none ${dark ? "text-white" : "text-gray-900"}`}>CleanHut</div>
              <div className="text-emerald-600 text-xs font-semibold leading-none">Detergents</div>
            </div>
          </div>
          <div className="hidden md:flex flex-1 max-w-lg">
            <div className={`flex items-center w-full px-4 py-2 rounded-xl border gap-2 transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 ${dark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200"}`}>
              <Icon.Search />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className={`flex-1 bg-transparent outline-none text-sm ${dark ? "text-white placeholder-gray-500" : "text-gray-900"}`} />
              {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600"><Icon.X /></button>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(d => !d)} className={`p-2 rounded-xl transition-all hover:scale-110 ${dark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {dark ? <Icon.Sun /> : <Icon.Moon />}
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-all hover:scale-105">
              <Icon.WhatsApp /> Order
            </a>
            <button onClick={() => setCartOpen(true)} className={`p-2 rounded-xl transition-all hover:scale-110 relative ${dark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              <Icon.Cart n={cartCount} />
            </button>
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <div className={`flex items-center px-3 py-2 rounded-xl border gap-2 ${dark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200"}`}>
            <Icon.Search />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className={`flex-1 bg-transparent outline-none text-sm ${dark ? "text-white placeholder-gray-500" : "text-gray-900"}`} />
            {search && <button onClick={() => setSearch("")} className="text-gray-400"><Icon.X /></button>}
          </div>
        </div>
      </header>

      <HeroSection onShop={() => shopRef.current?.scrollIntoView({ behavior: "smooth" })} dark={dark} />
      <FeaturedSection onAdd={handleAdd} addedIds={addedIds} dark={dark} />

      <section ref={shopRef} className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className={`text-2xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>All Products</h2>
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{filtered.length} products found</p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${category === cat ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200" : dark ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-400" : "bg-white border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-700"}`}>
              {cat}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} dark={dark} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`text-xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>No products found</h3>
            <button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} dark={dark} added={addedIds.has(p.id)} />)}
          </div>
        )}
      </section>

      {/* REDESIGNED WHY CHOOSE SECTION */}
      <WhyChooseSection dark={dark} />

      <footer className={`py-12 ${dark ? "bg-gray-900 border-t border-gray-800" : "bg-gray-900"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl">C</div>
                <div>
                  <div className="font-black text-xl text-white leading-none">CleanHut</div>
                  <div className="text-emerald-400 text-xs font-semibold">Detergents Kenya</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Your trusted source for premium cleaning products across Kenya.</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-all hover:scale-105">
                <Icon.WhatsApp /> Chat on WhatsApp
              </a>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["All Products","Liquids","Powders","Cleaning Tools","Air Fresheners"].map(l => (
                  <li key={l}><button onClick={() => { setCategory(l === "All Products" ? "All" : l); shopRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-1"><Icon.ChevronRight />{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>📞 0727 374 142</p>
                <p>📞 0734 999 958</p>
                <p>📧 info.cleanhut@yahoo.com</p>
                <p>📍 Nairobi, Kenya</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-gray-500 text-sm">© 2026 CleanHut Detergents. All rights reserved.</p>
            <p className="text-gray-600 text-xs">Pricelist dated 09.04.26</p>
          </div>
        </div>
      </footer>

      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-400/50 hover:scale-110 transition-all duration-200 animate-bounce">
        <Icon.WhatsApp />
      </a>

      <CartSidebar cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onUpdate={handleUpdate} onRemove={handleRemove} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} dark={dark} />
      <CheckoutModal cart={cart} open={checkoutOpen} onClose={() => setCheckoutOpen(false)} dark={dark} />
    </div>
  );
}
