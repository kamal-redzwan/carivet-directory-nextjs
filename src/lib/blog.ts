// STEP 1: Update src/lib/blog.ts to handle your structure correctly
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

// Fallback data in case MDX files are not found
const fallbackPosts: BlogPost[] = [
  {
    slug: 'understanding-vaccinations',
    title: 'Understanding Vaccinations: A Guide for Pet Owners',
    excerpt:
      "Learn about essential vaccinations for dogs and cats, when they should be administered, and why they're crucial for your pet's health.",
    date: '2023-05-15',
    author: 'CariVet Editorial Team',
    readTime: '5 min read',
    category: 'Preventive Care',
    categoryColor: 'bg-emerald-100 text-emerald-800',
    content: 'This is fallback content. Please check your MDX file.',
  },
  {
    slug: 'dental-health-pets',
    title: 'Dental Health in Pets: More Important Than You Think',
    excerpt:
      "Discover why dental care is vital for your pet's overall health and learn practical tips for maintaining good oral hygiene at home.",
    date: '2023-04-28',
    author: 'CariVet Editorial Team',
    readTime: '4 min read',
    category: 'Wellness',
    categoryColor: 'bg-blue-100 text-blue-800',
    content: 'This is fallback content for dental health.',
  },
];

function ensureBlogDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    console.log('Creating blog directory:', postsDirectory);
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

export function getAllPosts(): BlogPost[] {
  ensureBlogDirectory();

  try {
    console.log('Reading from directory:', postsDirectory);

    if (!fs.existsSync(postsDirectory)) {
      console.log('Blog directory does not exist, using fallback posts');
      return fallbackPosts;
    }

    const fileNames = fs.readdirSync(postsDirectory);
    console.log('Found files:', fileNames);

    const mdxFiles = fileNames.filter((name) => name.endsWith('.mdx'));
    console.log('MDX files:', mdxFiles);

    if (mdxFiles.length === 0) {
      console.log('No MDX files found, using fallback posts');
      return fallbackPosts;
    }

    const allPostsData = mdxFiles.map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);

      console.log('Reading file:', fullPath);

      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      console.log('Parsed frontmatter for', slug, ':', matterResult.data);

      return {
        slug,
        content: matterResult.content,
        ...matterResult.data,
      } as BlogPost;
    });

    const sortedPosts = allPostsData.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    console.log('Returning', sortedPosts.length, 'posts');
    return sortedPosts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    console.log('Falling back to static posts');
    return fallbackPosts;
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  ensureBlogDirectory();

  try {
    console.log('Looking for post with slug:', slug);

    // First try to find the exact MDX file
    const possibleFiles = [
      `${slug}.mdx`,
      `${slug.replace(
        'understanding-vaccinations',
        'understanding-vaccination'
      )}.mdx`, // Handle your specific filename
    ];

    for (const fileName of possibleFiles) {
      const fullPath = path.join(postsDirectory, fileName);
      console.log('Checking path:', fullPath);

      if (fs.existsSync(fullPath)) {
        console.log('Found file:', fullPath);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
          slug,
          content: matterResult.content,
          ...matterResult.data,
        } as BlogPost;
      }
    }

    // If no MDX file found, check fallback posts
    console.log('No MDX file found, checking fallback posts');
    const fallbackPost = fallbackPosts.find((post) => post.slug === slug);
    if (fallbackPost) {
      console.log('Found fallback post:', fallbackPost.title);
      return fallbackPost;
    }

    console.log('Post not found:', slug);
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
