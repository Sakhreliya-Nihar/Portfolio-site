import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function setupIndexes() {
  console.log('🔧 Setting up MongoDB indexes...\n');

  const client = new MongoClient(MONGODB_URI!);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('findmy');
    const collection = db.collection('device_locations');

    // Check existing indexes
    console.log('\n📋 Checking existing indexes...');
    const existingIndexes = await collection.indexes();
    console.log('Current indexes:', existingIndexes.map(idx => idx.name).join(', '));

    // Create indexes
    console.log('\n🏗️  Creating new indexes...\n');

    // 1. Timestamp index (descending) - CRITICAL for sorting by latest
    console.log('Creating timestamp index...');
    const timestampIndex = await collection.createIndex(
      { timestamp: -1 },
      {
        name: 'timestamp_desc',
        background: true
      }
    );
    console.log(`✅ Created: ${timestampIndex}`);

    // 2. Geospatial index for location queries
    console.log('Creating geospatial index...');
    const geoIndex = await collection.createIndex(
      { location: '2dsphere' },
      {
        name: 'location_2dsphere',
        background: true
      }
    );
    console.log(`✅ Created: ${geoIndex}`);

    // 3. Compound index: device_id + timestamp (for multi-device support)
    console.log('Creating device_id + timestamp compound index...');
    const compoundIndex = await collection.createIndex(
      { device_id: 1, timestamp: -1 },
      {
        name: 'device_timestamp',
        background: true
      }
    );
    console.log(`✅ Created: ${compoundIndex}`);

    // List all indexes after creation
    console.log('\n📊 Final index list:');
    const finalIndexes = await collection.indexes();
    finalIndexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    console.log('\n✨ Index setup completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error setting up indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the setup
setupIndexes().catch(console.error);
