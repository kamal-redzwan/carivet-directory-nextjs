import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Updated to match your actual directory structure
const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  categoryColor: string;
  content: string;
}

function ensureBlogDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

export function getAllPosts(): BlogPost[] {
  ensureBlogDirectory();

  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const mdxFiles = fileNames.filter((name) => name.endsWith('.mdx'));

    if (mdxFiles.length === 0) {
      return [];
    }

    const allPostsData = mdxFiles.map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);

      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        content: matterResult.content,
        ...matterResult.data,
      } as BlogPost;
    });

    const sortedPosts = allPostsData.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sortedPosts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  ensureBlogDirectory();

  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      return {
        slug,
        content: matterResult.content,
        ...matterResult.data,
      } as BlogPost;
    }

    return null;
  } catch (error) {
    console.error('Error reading blog post:', error);
    return null;
  }
}

export function getFeaturedPosts(): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, 2);
}

export function getLatestPosts(): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.slice(2, 6);
}
