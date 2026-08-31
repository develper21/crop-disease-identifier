import { db } from './db';
import { users, products, diseaseSolutions, scans } from './db/schema';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    console.log('🧹 Cleaning existing data...');
    await db.delete(scans);
    await db.delete(products);
    await db.delete(diseaseSolutions);
    await db.delete(users);

    // Seed Users
    console.log('👤 Seeding users...');
    const hashedPassword = await bcrypt.hash('rahul123', 10);
    
    const [user] = await db.insert(users).values({
      email: 'rahul@gmail.com',
      password: hashedPassword,
      fullName: 'Rahul Kumar',
      preferredLanguage: 'hi',
    }).returning();

    console.log(`✅ Created user: ${user.email}`);

    // Seed Disease Solutions
    console.log('🌾 Seeding disease solutions...');
    const diseaseData = [
      {
        name: 'Late Blight',
        description: 'A fungal disease that affects tomatoes and potatoes, causing dark lesions on leaves and stems.',
        commonNames: ['Phytophthora infestans', 'टमाटर का देर से ब्लाइट', ' potato blight'],
        solutions: [
          'Remove infected plants immediately',
          'Apply copper-based fungicides',
          'Ensure proper plant spacing for air circulation',
          'Avoid overhead irrigation',
          'Use resistant varieties'
        ]
      },
      {
        name: 'Powdery Mildew',
        description: 'A fungal disease that creates white powdery spots on leaves, stems, and flowers.',
        commonNames: ['Erysiphales', 'चूर्णमय फफूंद', ' white mold'],
        solutions: [
          'Apply neem oil spray',
          'Use sulfur-based fungicides',
          'Improve air circulation around plants',
          'Water at the base of plants, not leaves',
          'Remove affected leaves'
        ]
      },
      {
        name: 'Leaf Rust',
        description: 'A fungal disease causing orange-brown pustules on leaf surfaces.',
        commonNames: ['Puccinia', 'पत्ती जंग', ' brown rust'],
        solutions: [
          'Apply fungicides containing triazole',
          'Remove infected plant debris',
          'Rotate crops annually',
          'Use resistant wheat varieties',
          'Avoid excessive nitrogen fertilization'
        ]
      },
      {
        name: 'Bacterial Leaf Spot',
        description: 'Bacterial infection causing water-soaked spots that turn brown or black.',
        commonNames: ['Xanthomonas', 'बैक्टीरियल लीफ स्पॉट', ' leaf spot'],
        solutions: [
          'Use copper-based bactericides',
          'Avoid working with wet plants',
          'Remove infected plant material',
          'Use disease-free seeds',
          'Practice crop rotation'
        ]
      },
      {
        name: 'Downy Mildew',
        description: 'Fungal disease causing yellow patches on leaf tops with gray mold underneath.',
        commonNames: ['Peronospora', 'डाउनी मिल्ड्यू', ' false mildew'],
        solutions: [
          'Apply mancozeb or copper fungicides',
          'Improve drainage and air circulation',
          'Remove infected plant parts',
          'Avoid overhead watering',
          'Use resistant varieties'
        ]
      }
    ];

    const insertedDiseases = await db.insert(diseaseSolutions).values(diseaseData).returning();
    console.log(`✅ Created ${insertedDiseases.length} disease solutions`);

    // Seed Products
    console.log('🛒 Seeding products...');
    const productData = [
      {
        name: 'Copper Fungicide',
        category: 'Fungicide',
        description: 'Effective organic fungicide for treating various fungal diseases including blight and mildew.',
        price: 45000, // ₹450
        imageUrl: 'https://example.com/copper-fungicide.jpg',
        targetDiseases: ['Late Blight', 'Powdery Mildew', 'Downy Mildew', 'Bacterial Leaf Spot']
      },
      {
        name: 'Neem Oil Spray',
        category: 'Organic Pesticide',
        description: 'Natural neem oil extract for controlling pests and fungal diseases.',
        price: 35000, // ₹350
        imageUrl: 'https://example.com/neem-oil.jpg',
        targetDiseases: ['Powdery Mildew', 'Leaf Rust']
      },
      {
        name: 'Sulfur Dust',
        category: 'Fungicide',
        description: 'Sulfur-based fungicide effective against powdery mildew and rust.',
        price: 28000, // ₹280
        imageUrl: 'https://example.com/sulfur-dust.jpg',
        targetDiseases: ['Powdery Mildew', 'Leaf Rust']
      },
      {
        name: 'Mancozeb 75%',
        category: 'Fungicide',
        description: 'Broad-spectrum fungicide for controlling downy mildew and leaf spots.',
        price: 55000, // ₹550
        imageUrl: 'https://example.com/mancozeb.jpg',
        targetDiseases: ['Downy Mildew', 'Late Blight', 'Bacterial Leaf Spot']
      },
      {
        name: 'Bio-Fertilizer Mix',
        category: 'Fertilizer',
        description: 'Organic bio-fertilizer to improve soil health and plant immunity.',
        price: 32000, // ₹320
        imageUrl: 'https://example.com/bio-fertilizer.jpg',
        targetDiseases: []
      },
      {
        name: 'Trichoderma Biocontrol',
        category: 'Biocontrol',
        description: 'Beneficial fungi that suppress soil-borne pathogens and promote plant growth.',
        price: 40000, // ₹400
        imageUrl: 'https://example.com/trichoderma.jpg',
        targetDiseases: ['Late Blight', 'Bacterial Leaf Spot']
      },
      {
        name: 'Systemic Fungicide',
        category: 'Fungicide',
        description: 'Triazole-based systemic fungicide for comprehensive disease control.',
        price: 68000, // ₹680
        imageUrl: 'https://example.com/systemic-fungicide.jpg',
        targetDiseases: ['Leaf Rust', 'Powdery Mildew', 'Downy Mildew']
      },
      {
        name: 'Plant Growth Promoter',
        category: 'Growth Promoter',
        description: 'Organic growth promoter to enhance plant resistance against diseases.',
        price: 25000, // ₹250
        imageUrl: 'https://example.com/growth-promoter.jpg',
        targetDiseases: []
      }
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();
    console.log(`✅ Created ${insertedProducts.length} products`);

    // Seed Sample Scans for the user
    console.log('📸 Seeding sample scans...');
    const scanData = [
      {
        userId: user.id,
        imageUrl: 'https://example.com/scan1.jpg',
        prediction: { disease: 'Late Blight', confidence: 0.92 },
        confidence: 92,
        notes: 'Found on tomato plants in the north field',
        isLowConf: false
      },
      {
        userId: user.id,
        imageUrl: 'https://example.com/scan2.jpg',
        prediction: { disease: 'Powdery Mildew', confidence: 0.78 },
        confidence: 78,
        notes: 'Early stage infection on cucumber leaves',
        isLowConf: false
      },
      {
        userId: user.id,
        imageUrl: 'https://example.com/scan3.jpg',
        prediction: { disease: 'Unknown', confidence: 0.45 },
        confidence: 45,
        notes: 'Low confidence - needs manual inspection',
        isLowConf: true
      }
    ];

    const insertedScans = await db.insert(scans).values(scanData).returning();
    console.log(`✅ Created ${insertedScans.length} sample scans`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Users: 1`);
    console.log(`   Disease Solutions: ${insertedDiseases.length}`);
    console.log(`   Products: ${insertedProducts.length}`);
    console.log(`   Sample Scans: ${insertedScans.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log(`   Email: rahul@gmail.com`);
    console.log(`   Password: rahul123`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
