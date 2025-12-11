import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Basic guard: ensure id is present; allow Supabase to handle format specifics
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(
        'id,name,short_details,github_url,technologies,overview,features,conclusion,created_at'
      )
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ project: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
