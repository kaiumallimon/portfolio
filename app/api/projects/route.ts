import { supabase } from '@/lib/supabase-client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');

    let query = supabase
      .from('projects')
      .select('id,name,short_details,github_url, live_url, client')
      .not('id', 'is', null)
      .order('order', { ascending: true });

    if (limitParam) {
      const limit = parseInt(limitParam);
      if (!isNaN(limit)) {
        query = query.limit(limit);
      }
    }

    const { data, error } = await query;

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
