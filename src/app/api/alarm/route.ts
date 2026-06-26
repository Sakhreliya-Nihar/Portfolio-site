import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST() {
  try {
    const alarmApiKey = process.env.ALARM_API_KEY;
    const alarmApiUrl = process.env.ALARM_API_URL || 'http://142.67.189.101:5000/alarm';

    if (!alarmApiKey) {
      throw new Error('ALARM_API_KEY is not configured');
    }

    // Make the external API call to trigger the alarm
    const response = await fetch(alarmApiUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': alarmApiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Alarm API returned status ${response.status}`);
    }

    const data = await response.json().catch(() => ({ message: 'Alarm triggered' }));

    return NextResponse.json(
      {
        success: true,
        message: 'Emergency alarm triggered successfully',
        data
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error triggering alarm:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to trigger alarm',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
