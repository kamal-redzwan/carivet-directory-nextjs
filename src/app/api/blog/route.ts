import { NextResponse } from 'next/server';
import { getAllPosts, getFeaturedPosts, getLatestPosts } from '@/lib/blog';

export async function GET() {
  try {
    const allPosts = getAllPosts();
    const featuredPosts = getFeaturedPosts();
    const latestPosts = getLatestPosts();

    return NextResponse.json({
      allPosts,
      featuredPosts,
      latestPosts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load blog posts' },
      { status: 500 }
    );
  }
}
