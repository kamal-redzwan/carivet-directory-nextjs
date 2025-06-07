import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/blog';

// This is a catch-all route handler
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const post = getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found', slug },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to load post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
