import { supabase } from '@/lib/supabase-client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id,name,short_details,github_url, live_url')
      .not('id', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data ?? [] }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
