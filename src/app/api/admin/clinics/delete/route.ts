import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables for Supabase');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { clinicId } = await request.json();

    if (!clinicId) {
      return NextResponse.json(
        { error: 'Clinic ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('clinics')
      .delete()
      .eq('id', clinicId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No rows were deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
