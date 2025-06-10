import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

// Types for feature items
export interface FeatureItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  link?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
}

export interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
  variant?: 'default' | 'cards' | 'minimal';
  columns?: 2 | 3 | 4;
  iconColor?: 'emerald' | 'blue' | 'purple' | 'gray';
  className?: string;
  sectionClassName?: string;
}

// Main FeatureGrid component
export function FeatureGrid({
  title,
  subtitle,
  items,
  variant = 'default',
  columns = 3,
  iconColor = 'emerald',
  className,
  sectionClassName
}: FeatureGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const iconColors = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  const iconSize = variant === 'minimal' ? 'w-10 h-10' : 'w-12 h-12';
  const iconInnerSize = variant === 'minimal' ? 'h-5 w-5' : 'h-6 w-6';

  return (
    <section className={cn('py-16', sectionClassName)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={cn('grid gap-8', gridCols[columns], className)}>
          {items.map((item) => (
            <FeatureItem
              key={item.id}
              item={item}
              variant={variant}
              iconColor={iconColor}
              iconSize={iconSize}
              iconInnerSize={iconInnerSize}
              iconColorClass={iconColors[iconColor]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Individual feature item component
interface FeatureItemProps {
  item: FeatureItem;
  variant: 'default' | 'cards' | 'minimal';
  iconColor: string;
  iconSize: string;
  iconInnerSize: string;
  iconColorClass: string;
}

function FeatureItem({
  item,
  variant,
  iconSize,
  iconInnerSize,
  iconColorClass
}: FeatureItemProps) {
  const Icon = item.icon;

  if (variant === 'cards') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className={cn(
            iconSize,
            iconColorClass,
            'rounded-full flex items-center justify-center mb-4'
          )}>
            <Icon className={iconInnerSize} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {item.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {item.description}
          </p>
          {item.link && (
            <div className="mt-auto">
              {item.link.href ? (
                <Button asChild variant="outline" size="sm">
                  <a href={item.link.href}>{item.link.text}</a>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={item.link.onClick}
                >
                  {item.link.text}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="text-center">
        <div className={cn(
          iconSize,
          iconColorClass,
          'rounded-full flex items-center justify-center mx-auto mb-3'
        )}>
          <Icon className={iconInnerSize} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm">
          {item.description}
        </p>
      </div>
    );
  }

  // Default variant
  return (
    <div className="text-center p-6">
      <div className={cn(
        iconSize,
        iconColorClass,
        'rounded-full flex items-center justify-center mx-auto mb-4'
      )}>
        <Icon className={iconInnerSize} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {item.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        {item.description}
      </p>
      {item.link && (
        <div>
          {item.link.href ? (
            <Button asChild variant="link" size="sm" className="p-0">
              <a href={item.link.href}>{item.link.text}</a>
            </Button>
          ) : (
            <Button
              variant="link"
              size="sm"
              className="p-0"
              onClick={item.link.onClick}
            >
              {item.link.text}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Specialized "Why Choose Us" component
export interface WhyChooseUsItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface WhyChooseUsProps {
  title?: string;
  items: WhyChooseUsItem[];
  className?: string;
  sectionClassName?: string;
  iconColor?: 'emerald' | 'blue' | 'purple' | 'gray';
}

export function WhyChooseUs({
  title = "Why Choose Us?",
  items,
  className,
  sectionClassName = "py-16 bg-emerald-50",
  iconColor = 'emerald'
}: WhyChooseUsProps) {
  const featureItems: FeatureItem[] = items.map(item => ({
    ...item,
    link: undefined
  }));

  return (
    <FeatureGrid
      title={title}
      items={featureItems}
      variant="default"
      columns={3}
      iconColor={iconColor}
      className={className}
      sectionClassName={sectionClassName}
    />
  );
}

// Specialized Services Grid component
export interface ServiceItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  searchUrl?: string;
  onClick?: () => void;
}

export interface ServicesGridProps {
  title?: string;
  subtitle?: string;
  services: ServiceItem[];
  className?: string;
  sectionClassName?: string;
  linkText?: string;
}

export function ServicesGrid({
  title = "Our Services",
  subtitle,
  services,
  className,
  sectionClassName = "py-16 bg-white",
  linkText = "Find clinics"
}: ServicesGridProps) {
  const featureItems: FeatureItem[] = services.map(service => ({
    ...service,
    link: service.searchUrl || service.onClick ? {
      text: linkText,
      href: service.searchUrl,
      onClick: service.onClick
    } : undefined
  }));

  return (
    <FeatureGrid
      title={title}
      subtitle={subtitle}
      items={featureItems}
      variant="default"
      columns={3}
      iconColor="emerald"
      className={className}
      sectionClassName={sectionClassName}
    />
  );
}

// Export all components
export { FeatureItem as ServiceFeatureItem };