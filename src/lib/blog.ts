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

// Enhanced fallback data using custom MDX components
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
    content: `As a pet owner, one of the most important decisions you'll make for your furry friend's health is ensuring they receive proper vaccinations. Vaccines are one of the most effective ways to protect your pets from serious, potentially life-threatening diseases. Yet many pet owners have questions about when vaccines are needed, which ones are essential, and how they work.

In this comprehensive guide, we'll break down everything you need to know about pet vaccinations to help you make informed decisions about your pet's healthcare.

## What Are Pet Vaccines and How Do They Work?

Pet vaccines work similarly to human vaccines – they contain small amounts of modified or killed disease-causing organisms that stimulate your pet's immune system to produce antibodies. These antibodies provide protection against specific diseases without causing the actual illness.

When your pet encounters the real disease later, their immune system recognizes it and quickly produces the antibodies needed to fight off the infection. This process is much faster and more effective than if your pet encountered the disease for the first time without vaccination.

## Core vs. Non-Core Vaccines: Understanding the Difference

Veterinarians categorize pet vaccines into two main groups:

### Core Vaccines (Essential for All Pets)

<InfoBox title="For Dogs">

- **Rabies**: Required by law in most areas and fatal if contracted
- **DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)**: Protects against multiple serious viral diseases
- **Parvovirus**: Particularly dangerous for puppies and can be fatal

</InfoBox>

<InfoBox title="For Cats">

- **Rabies**: Legally required and fatal disease
- **FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)**: Protects against common respiratory and gastrointestinal diseases
- **Feline Leukemia (FeLV)**: Especially important for outdoor cats

</InfoBox>

### Non-Core Vaccines (Risk-Based)

These vaccines are recommended based on your pet's lifestyle, age, and risk factors:

**For Dogs:**
- Bordetella (kennel cough)
- Lyme disease
- Canine influenza
- Leptospirosis

**For Cats:**
- Feline immunodeficiency virus (FIV)
- Chlamydia
- Bordetella

## Vaccination Schedule: When Should Your Pet Be Vaccinated?

### Puppies and Kittens

Young animals require a series of vaccinations because antibodies from their mother's milk can interfere with vaccine effectiveness. The typical schedule includes:

<VaccineSchedule>

- **8-10 weeks**: First round of core vaccines
- **12-14 weeks**: Second round of core vaccines
- **16-18 weeks**: Final puppy/kitten vaccines, including rabies

</VaccineSchedule>

<ImportantNote>
Puppies and kittens aren't fully protected until 1-2 weeks after their final vaccination in the series.
</ImportantNote>

### Adult Pets

After the initial puppy or kitten series, adult pets typically need:

- **Annual vaccines**: Some vaccines like Bordetella may need yearly boosters
- **Every 3 years**: Many core vaccines (like rabies) can be given every three years after the initial series
- **Risk-based schedule**: Non-core vaccines based on exposure risk and veterinary recommendation

## Common Vaccination Myths Debunked

<MythBuster
  myth="Indoor pets don't need vaccines"
  truth="Even indoor pets can be exposed to diseases through open windows, visitors, or emergency vet visits. Core vaccines are essential for all pets."
/>

<MythBuster
  myth="Vaccines cause autism in pets"
  truth="There is no scientific evidence linking vaccines to autism-like conditions in pets. The benefits of vaccination far outweigh the minimal risks."
/>

<MythBuster
  myth="Natural immunity is better than vaccination"
  truth="While natural immunity can be strong, the diseases that vaccines prevent are often severe or fatal. The risk of serious illness far outweighs vaccination risks."
/>

<MythBuster
  myth="One vaccine lasts a lifetime"
  truth="Immunity wanes over time, which is why booster shots are necessary to maintain protection."
/>

## Potential Side Effects and What to Watch For

Most pets experience no side effects from vaccinations, but mild reactions can occur:

**Normal reactions (24-48 hours post-vaccination):**
- Mild fever
- Decreased appetite
- Lethargy
- Soreness at injection site

**Seek immediate veterinary care if you notice:**
- Severe vomiting or diarrhea
- Difficulty breathing
- Swelling of face or legs
- Persistent vomiting
- Collapse or severe lethargy

**Pro Tip**: Schedule vaccinations for times when you can monitor your pet for several hours afterward, and avoid strenuous activity for 24 hours post-vaccination.

## The Cost-Benefit Analysis

While vaccinations represent an upfront cost, they're significantly less expensive than treating the diseases they prevent. For example:

<CostComparison>

- Treating parvovirus can cost **RM2,000-5,000**
- Annual core vaccines typically cost **RM150-300**
- Treatment for rabies exposure requires immediate, intensive intervention

</CostComparison>

## Finding the Right Veterinary Care

When choosing a veterinary clinic for your pet's vaccinations, consider:

- **Experience**: Look for clinics with experienced veterinarians
- **Services**: Ensure they offer comprehensive preventive care
- **Location**: Choose a convenient location for regular visits
- **Emergency care**: Check if they provide emergency services
- **Reviews**: Read reviews from other pet owners

## The Bottom Line

Vaccinations are one of the most important investments you can make in your pet's health. They protect not only your individual pet but also contribute to community health by preventing disease outbreaks.

<KeyTakeaways>

- Core vaccines are essential for all pets, regardless of lifestyle
- Follow your veterinarian's recommended schedule for optimal protection
- Monitor your pet after vaccinations for any unusual reactions
- Keep detailed records of all vaccinations
- Discuss your pet's specific needs with your veterinarian

</KeyTakeaways>

Remember, every pet is unique, and vaccination needs can vary based on age, health status, lifestyle, and local disease risks. Regular consultation with your veterinarian ensures your pet receives the most appropriate protection.`,
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
    content: `Pet dental health is often overlooked, but it's crucial for your pet's overall wellbeing. Poor dental hygiene can lead to serious health problems beyond just bad breath.

## Why Dental Health Matters

Dental disease affects more than 80% of dogs and 70% of cats by age 3. Without proper care, bacteria from dental disease can enter the bloodstream and affect the heart, liver, and kidneys.

<ImportantNote>
Dental disease can lead to serious systemic health problems if left untreated. Regular dental care is essential for your pet's overall health.
</ImportantNote>

## Signs of Dental Problems

<InfoBox title="Warning Signs to Watch For">

- Bad breath that gets progressively worse
- Yellow or brown tartar buildup on teeth
- Red, swollen, or bleeding gums
- Difficulty eating or chewing
- Pawing at the face or mouth
- Loose or missing teeth

</InfoBox>

## Home Care Tips

Maintaining your pet's dental health at home is crucial:

- **Regular Brushing**: Use pet-specific toothpaste (never human toothpaste)
- **Dental Chews**: Provide appropriate dental treats and toys
- **Diet**: Consider dental-specific food formulations
- **Water Additives**: Use veterinarian-approved dental water additives

<ImportantNote>
Never use human toothpaste on pets as it contains xylitol, which is toxic to dogs and cats.
</ImportantNote>

## Professional Dental Care

Your veterinarian can provide comprehensive dental care including:

- Professional dental cleanings under anesthesia
- Dental X-rays to check for hidden problems
- Treatment for dental disease and infections
- Tooth extractions when necessary
- Oral surgery for advanced cases

<KeyTakeaways>

- Start dental care early in your pet's life
- Brush your pet's teeth regularly with pet-safe toothpaste
- Schedule professional dental cleanings as recommended by your vet
- Watch for signs of dental disease and seek treatment promptly
- Good dental care contributes to overall health and longevity

</KeyTakeaways>

Remember, good dental care is an investment in your pet's long-term health and comfort. Regular home care combined with professional veterinary dental services will help keep your pet's mouth healthy throughout their life.`,
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
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    console.log('Checking path:', fullPath);

    if (fs.existsSync(fullPath)) {
      console.log('Found MDX file:', fullPath);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        content: matterResult.content,
        ...matterResult.data,
      } as BlogPost;
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
    // Return fallback post if available
    const fallbackPost = fallbackPosts.find((post) => post.slug === slug);
    return fallbackPost || null;
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
