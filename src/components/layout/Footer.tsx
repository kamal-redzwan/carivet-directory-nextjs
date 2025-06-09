// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import {
  PawPrint,
  Facebook,
  Twitter,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram';
  href: string;
  label?: string;
}

interface FooterProps {
  /** Custom brand name */
  brandName?: string;
  /** Custom logo component */
  logo?: React.ReactNode;
  /** Brand description */
  description?: string;
  /** Footer sections with links */
  sections?: FooterSection[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Additional CSS classes */
  className?: string;
  /** Copyright text (year will be auto-generated) */
  copyrightText?: string;
  /** Hide social media section */
  hideSocial?: boolean;
  /** Custom background color */
  bgColor?: string;
  /** Compact variant */
  variant?: 'default' | 'compact';
}

const defaultSections: FooterSection[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Find Clinics', href: '/clinics' },
      { label: 'Pet Care Tips', href: '/tips' },
      { label: 'Veterinary Blog', href: '/blog' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Pet Care Tips', href: '/tips' },
      { label: 'Veterinary Blog', href: '/blog' },
      { label: 'Emergency Services', href: '/emergency' },
      { label: 'Add Your Clinic', href: '/add-clinic' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  { platform: 'facebook', href: '#', label: 'Follow us on Facebook' },
  { platform: 'twitter', href: '#', label: 'Follow us on Twitter' },
  { platform: 'instagram', href: '#', label: 'Follow us on Instagram' },
];

const SocialIcon = ({ platform }: { platform: SocialLink['platform'] }) => {
  const iconProps = { className: 'h-5 w-5' };

  switch (platform) {
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'twitter':
      return <Twitter {...iconProps} />;
    case 'instagram':
      return <Instagram {...iconProps} />;
    default:
      return <ExternalLink {...iconProps} />;
  }
};

const DefaultLogo = ({ brandName }: { brandName: string }) => (
  <div className='flex items-center mb-4'>
    <PawPrint className='h-6 w-6 mr-2' />
    <span className='text-lg font-bold'>{brandName}</span>
  </div>
);

export function Footer({
  brandName = 'CariVet',
  logo,
  description = 'Helping pet owners in Malaysia find the right veterinary care for their beloved animals.',
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  className,
  copyrightText,
  hideSocial = false,
  bgColor = 'bg-emerald-600',
  variant = 'default',
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyright =
    copyrightText ||
    `© ${currentYear} ${brandName} Malaysia. All rights reserved.`;

  const footerClasses = cn(
    'text-white py-12',
    bgColor,
    variant === 'compact' && 'py-8',
    className
  );

  const containerClasses = cn(
    'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    variant === 'compact' ? 'space-y-6' : 'space-y-0'
  );

  if (variant === 'compact') {
    return (
      <footer className={footerClasses}>
        <div className={containerClasses}>
          {/* Compact layout */}
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            {/* Brand */}
            <div className='flex items-center'>
              {logo || <DefaultLogo brandName={brandName} />}
            </div>

            {/* Quick Links */}
            <nav className='flex flex-wrap justify-center gap-6'>
              {sections[0]?.links.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='text-sm hover:text-white transition-colors opacity-90 hover:opacity-100'
                  {...(link.external && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social Links */}
            {!hideSocial && socialLinks.length > 0 && (
              <div className='flex space-x-4'>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className='text-white/70 hover:text-white transition-colors'
                    aria-label={social.label || `${social.platform} link`}
                    {...(social.href.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className='pt-6 border-t border-white/20 text-center'>
            <p className='text-sm opacity-90'>{copyright}</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={footerClasses}>
      <div className={containerClasses}>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div>
            {logo || <DefaultLogo brandName={brandName} />}
            <p className='text-emerald-100 text-sm leading-relaxed mb-4'>
              {description}
            </p>
            {!hideSocial && socialLinks.length > 0 && (
              <div className='flex space-x-4'>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className='text-emerald-200 hover:text-white transition-colors'
                    aria-label={social.label || `${social.platform} link`}
                    {...(social.href.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className='text-lg font-semibold mb-4'>{section.title}</h4>
              <ul className='space-y-2'>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-emerald-100 hover:text-white transition-colors text-sm'
                      {...(link.external && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className='inline h-3 w-3 ml-1' />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className='border-t border-emerald-500 mt-8 pt-8 text-center text-emerald-100'>
          <p className='text-sm'>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}

// Export pre-configured variants for convenience
export const MainFooter = () => <Footer />;

export const CompactFooter = () => <Footer variant='compact' />;

export const CustomFooter = (props: Partial<FooterProps>) => (
  <Footer {...props} />
);

// Export types for external use
export type { FooterProps, FooterSection, FooterLink, SocialLink };
