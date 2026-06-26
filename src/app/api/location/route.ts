import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('findmy');
    const collection = db.collection('device_locations');

    console.log('Fetching location from database: findmy, collection: device_locations');

    // Fetch the latest location document
    const latestLocation = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    console.log('Found documents:', latestLocation.length);

    if (!latestLocation || latestLocation.length === 0) {
      console.log('No location data found in database');
      return NextResponse.json(
        {
          success: false,
          message: 'No location data found'
        },
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('Returning location data:', latestLocation[0]._id);

    return NextResponse.json(
      {
        success: true,
        data: latestLocation[0]
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching location:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch location data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     // Log request details
//     console.log('=== Incoming Location Request ===');
//     console.log('Method:', request.method);
//     console.log('URL:', request.url);
//     console.log('Headers:', Object.fromEntries(request.headers.entries()));

//     // Get raw body text first for debugging
//     const rawBody = await request.text();
//     console.log('Raw body:', rawBody);
//     console.log('Body length:', rawBody.length);

//     // Fix malformed JSON from iOS Shortcut
//     // 1. Replace ALL literal newlines/control characters with spaces
//     // 2. Remove trailing commas before closing braces/brackets
//     const cleanedBody = rawBody
//       .replace(/\r?\n/g, ' ') // Replace all newlines with spaces
//       .replace(/\s+/g, ' ') // Collapse multiple spaces
//       .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
//       .replace(/"\s*:\s*"/g, '":"') // Clean up spacing around colons
//       .replace(/"\s*,\s*"/g, '","') // Clean up spacing around commas
//       .replace(/{\s+/g, '{') // Remove space after opening brace
//       .replace(/\s+}/g, '}'); // Remove space before closing brace

//     console.log('Cleaned body:', cleanedBody);

//     // Try to parse as JSON
//     let locationData;
//     try {
//       locationData = JSON.parse(cleanedBody);
//       console.log('Parsed JSON successfully:', locationData);
//     } catch (parseError) {
//       console.error('JSON parse error:', parseError);
//       console.log('Body bytes:', Array.from(rawBody).map(c => c.charCodeAt(0)));
//       throw parseError;
//     }

//     // Save to MongoDB
//     try {
//       const client = await clientPromise;
//       const db = client.db('location_tracker');
//       const collection = db.collection('locations');

//       const document = {
//         ...locationData,
//         timestamp: new Date(),
//         userAgent: request.headers.get('user-agent'),
//         ipAddress: request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for'),
//       };

//       const result = await collection.insertOne(document);
//       console.log('Saved to MongoDB:', result.insertedId);
//     } catch (dbError) {
//       console.error('MongoDB error:', dbError);
//       // Continue even if DB save fails
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Location data received successfully',
//         receivedData: locationData
//       },
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (error) {
//     console.error('=== Error in Location Endpoint ===');
//     console.error('Error:', error);
//     console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Request received but could not parse',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 200, headers: corsHeaders }
//     );
//   }
// }
