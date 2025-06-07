import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/blog';

// This is a catch-all route handler
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    // Get the slug from the params array
    const slug = params.slug?.[0];

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    console.log('API: Looking for post with slug:', slug);

    const post = getPostBySlug(slug);

    if (!post) {
      console.log('API: Post not found for slug:', slug);
      return NextResponse.json(
        { error: 'Post not found', slug },
        { status: 404 }
      );
    }

    console.log('API: Found post:', post.title);
    return NextResponse.json(post);
  } catch (error) {
    console.error('API: Error loading post:', error);
    return NextResponse.json(
      {
        error: 'Failed to load post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
