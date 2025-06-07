import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';

// This is a catch-all route handler
export async function GET() {
  try {
    const posts = getAllPosts();

    // Split posts into featured and latest
    const featuredPosts = posts.slice(0, 2);
    const latestPosts = posts.slice(2, 6);

    return NextResponse.json({
      featuredPosts,
      latestPosts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to load blog posts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
