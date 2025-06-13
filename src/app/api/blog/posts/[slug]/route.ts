import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/blog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;

    const post = getPostBySlug(resolvedParams.slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found', slug: resolvedParams.slug },
        { status: 404 }
      );
    }

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
