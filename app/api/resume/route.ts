import { supabase } from '@/lib/supabase-client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {

    let query = supabase
      .from('resume')
      .select('resume_url')
      .order('created_at', { ascending: false })
      .limit(1);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resume: data?.[0] ?? null }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}
