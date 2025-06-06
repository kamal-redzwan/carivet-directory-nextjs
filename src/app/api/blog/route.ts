import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/blog';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('API: Looking for post with slug:', params.slug);

    const post = getPostBySlug(params.slug);

    if (!post) {
      console.log('API: Post not found for slug:', params.slug);
      return NextResponse.json(
        { error: 'Post not found', slug: params.slug },
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
