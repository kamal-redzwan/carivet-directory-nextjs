'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface HeroSectionProps {
  /** Main heading text */
  title: string;
  /** Subtitle or description text */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
  /** Hero variant */
  variant?: 'default' | 'gradient' | 'pattern' | 'image';
  /** Background color (for default variant) */
  bgColor?: string;
  /** Gradient colors (for gradient variant) */
  gradientFrom?: string;
  gradientTo?: string;
  /** Background image URL (for image variant) */
  backgroundImage?: string;
  /** Text color variant */
  textColor?: 'white' | 'dark' | 'auto';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Custom content (search form, buttons, etc.) */
  children?: ReactNode;
  /** Container max width */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  /** Show decorative elements */
  showDecoration?: boolean;
}

const sizeClasses = {
  sm: 'py-12',
  md: 'py-16',
  lg: 'py-20',
  xl: 'py-24',
};

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function HeroSection({
  title,
  subtitle,
  className,
  variant = 'default',
  bgColor = 'bg-emerald-600',
  gradientFrom = 'from-emerald-500',
  gradientTo = 'to-emerald-600',
  backgroundImage,
  textColor = 'white',
  size = 'md',
  align = 'center',
  children,
  maxWidth = '7xl',
  showDecoration = false,
}: HeroSectionProps) {
  // Determine background classes based on variant
  const getBackgroundClasses = () => {
    switch (variant) {
      case 'gradient':
        return `bg-gradient-to-br ${gradientFrom} ${gradientTo}`;
      case 'pattern':
        return `${bgColor} relative overflow-hidden`;
      case 'image':
        return 'relative bg-cover bg-center bg-no-repeat';
      default:
        return bgColor;
    }
  };

  // Determine text color classes
  const getTextColorClasses = () => {
    if (textColor === 'auto') {
      // Auto-detect based on background (simplified)
      return 'text-white';
    }
    return textColor === 'white' ? 'text-white' : 'text-gray-900';
  };

  const textColorClass = getTextColorClasses();
  const subtitleColorClass =
    textColor === 'white' ? 'text-emerald-100' : 'text-gray-600';

  return (
    <section
      className={cn(
        getBackgroundClasses(),
        sizeClasses[size],
        textColorClass,
        'relative',
        className
      )}
      style={
        variant === 'image' && backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
            }
          : undefined
      }
    >
      {/* Pattern Decoration */}
      {variant === 'pattern' && showDecoration && (
        <div className='absolute inset-0 opacity-10'>
          <svg
            className='absolute top-0 left-0 w-full h-full'
            viewBox='0 0 100 100'
            preserveAspectRatio='none'
          >
            <pattern
              id='hero-pattern'
              x='0'
              y='0'
              width='10'
              height='10'
              patternUnits='userSpaceOnUse'
            >
              <circle cx='1' cy='1' r='1' fill='currentColor' />
            </pattern>
            <rect width='100' height='100' fill='url(#hero-pattern)' />
          </svg>
        </div>
      )}

      <div
        className={cn(
          'relative z-10 mx-auto px-4 sm:px-6 lg:px-8',
          maxWidthClasses[maxWidth],
          alignClasses[align]
        )}
      >
        <h1
          className={cn(
            'font-bold mb-4',
            size === 'sm' && 'text-2xl sm:text-3xl',
            size === 'md' && 'text-3xl sm:text-4xl',
            size === 'lg' && 'text-4xl sm:text-5xl',
            size === 'xl' && 'text-5xl sm:text-6xl'
          )}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={cn(
              subtitleColorClass,
              'mb-8',
              size === 'sm' && 'text-lg',
              size === 'md' && 'text-xl',
              size === 'lg' && 'text-2xl',
              size === 'xl' && 'text-3xl'
            )}
          >
            {subtitle}
          </p>
        )}

        {children && <div className='relative z-10'>{children}</div>}
      </div>

      {/* Bottom Wave Decoration */}
      {showDecoration && variant !== 'image' && (
        <div className='absolute bottom-0 left-0 right-0'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='relative block w-full h-12'
          >
            <path
              d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
              className='fill-white'
            />
          </svg>
        </div>
      )}
    </section>
  );
}

// Specialized Hero with Search Form
interface HeroWithSearchProps extends Omit<HeroSectionProps, 'children'> {
  /** Search form configuration */
  searchConfig?: {
    /** Placeholder text for search input */
    placeholder?: string;
    /** Filter options */
    filters?: Array<{
      name: string;
      label: string;
      options: Array<{ value: string; label: string }>;
    }>;
    /** Search button text */
    buttonText?: string;
    /** Search handler */
    onSearch: (searchData: any) => void;
  };
}

export function HeroWithSearch({
  searchConfig,
  ...heroProps
}: HeroWithSearchProps) {
  const {
    placeholder,
    filters = [],
    buttonText = 'Search',
    onSearch,
  } = searchConfig || {};

  return (
    <HeroSection {...heroProps}>
      {searchConfig && (
        <div className='max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-lg'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const searchData = Object.fromEntries(formData);
              onSearch(searchData);
            }}
          >
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              {filters.map((filter) => (
                <div key={filter.name}>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {filter.label}
                  </label>
                  <select
                    name={filter.name}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900'
                  >
                    <option value=''>All {filter.label}</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className='text-center'>
              <button
                type='submit'
                className='bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 font-medium transition-colors'
              >
                {buttonText}
              </button>
            </div>
          </form>
        </div>
      )}
    </HeroSection>
  );
}

// Pre-configured variants for common use cases
export const SimpleHero = (props: Omit<HeroSectionProps, 'variant'>) => (
  <HeroSection variant='default' {...props} />
);

export const GradientHero = (
  props: Omit<HeroSectionProps, 'variant' | 'gradientFrom' | 'gradientTo'>
) => (
  <HeroSection
    variant='gradient'
    gradientFrom='from-emerald-500'
    gradientTo='to-emerald-600'
    {...props}
  />
);

export const PatternHero = (props: Omit<HeroSectionProps, 'variant'>) => (
  <HeroSection variant='pattern' showDecoration {...props} />
);

// Export types for external use
export type { HeroSectionProps, HeroWithSearchProps };
