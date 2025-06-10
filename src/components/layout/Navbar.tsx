'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, IconButton } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  description?: string;
}

interface NavbarProps {
  /** Brand name */
  brandName?: string;
  /** Custom logo component */
  logo?: React.ReactNode;
  /** Navigation items */
  navItems?: NavItem[];
  /** Additional CSS classes */
  className?: string;
  /** Show CTA button */
  showCTA?: boolean;
  /** CTA button text */
  ctaText?: string;
  /** CTA button href */
  ctaHref?: string;
  /** Sticky navbar */
  sticky?: boolean;
}

const defaultNavItems: NavItem[] = [
  { label: 'Pet Care Tips', href: '/tips' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar({
  brandName = 'CariVet',
  logo,
  navItems = defaultNavItems,
  className,
  showCTA = true,
  ctaText = 'Find Clinics',
  ctaHref = '/clinics',
  sticky = true,
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const navbarClasses = cn(
    'w-full bg-white shadow-sm border-b border-gray-200 transition-all duration-300 z-50',
    sticky && 'sticky top-0',
    className
  );

  const DefaultLogo = () => (
    <div className='flex items-center'>
      <PawPrint className='h-8 w-8 text-emerald-600 mr-2' />
      <span className='text-xl font-bold text-gray-900 transition-colors'>
        {brandName}
      </span>
    </div>
  );

  return (
    <header className={navbarClasses}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo */}
          <Link href='/' className='flex-shrink-0'>
            {logo || <DefaultLogo />}
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative font-medium transition-colors duration-200 py-2',
                    active
                      ? 'text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600'
                  )}
                  title={item.description}
                >
                  {item.label}
                  {active && (
                    <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full' />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button (Desktop) */}
          {showCTA && (
            <div className='hidden md:block'>
              <Button asChild>
                <Link href={ctaHref}>{ctaText}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            variant='ghost'
            className='md:hidden text-gray-600 hover:bg-gray-100'
            aria-label='Toggle navigation menu'
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </IconButton>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden transition-all duration-300 ease-in-out overflow-hidden',
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className='bg-white border rounded-lg mx-4 mt-4'>
            <nav className='p-4 space-y-1'>
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 rounded-lg font-medium transition-colors',
                      active
                        ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile CTA */}
              {showCTA && (
                <div className='pt-4'>
                  <Button asChild className='w-full'>
                    <Link href={ctaHref}>{ctaText}</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

// Export variants for different use cases
export const MainNavbar = () => <Navbar />;

export const SimpleNavbar = () => <Navbar showCTA={false} />;
