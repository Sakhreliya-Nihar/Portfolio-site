import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    console.log('Fetching location history from database: findmy, collection: device_locations');

    // Calculate timestamp for 24 hours ago
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    // Fetch locations from the last 24 hours
    const locationHistory = await collection
      .find({
        timestamp: { $gte: oneDayAgo }
      })
      .sort({ timestamp: -1 })
      .toArray();

    console.log('Found history documents (last 24h):', locationHistory.length);

    if (!locationHistory || locationHistory.length === 0) {
      console.log('No location history found in the last 24 hours');
      return NextResponse.json(
        {
          success: false,
          message: 'No location history found in the last 24 hours'
        },
        { status: 404, headers: corsHeaders }
      );
    }

    // Filter out duplicate locations - only show when location has changed significantly
    // (more than ~50 meters, which is roughly 0.0005 degrees)
    const filteredHistory = [];
    let lastLat = null;
    let lastLon = null;

    for (const location of locationHistory) {
      if (!location.location_data?.latitude || !location.location_data?.longitude) {
        continue; // Skip invalid entries
      }

      const currentLat = location.location_data.latitude;
      const currentLon = location.location_data.longitude;

      // If this is the first location or if the location has changed significantly
      if (
        lastLat === null ||
        lastLon === null ||
        Math.abs(currentLat - lastLat) > 0.0005 ||
        Math.abs(currentLon - lastLon) > 0.0005
      ) {
        filteredHistory.push(location);
        lastLat = currentLat;
        lastLon = currentLon;
      }
    }

    console.log('Filtered to significant location changes:', filteredHistory.length);

    if (filteredHistory.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No significant location changes in the last 24 hours'
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredHistory
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching location history:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch location history',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
