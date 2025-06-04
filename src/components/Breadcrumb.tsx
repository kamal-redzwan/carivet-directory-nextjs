import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className='flex items-center space-x-1 text-sm text-gray-500 mb-4'>
      <Link
        href='/'
        className='flex items-center hover:text-gray-700 transition-colors'
      >
        <Home size={16} />
        <span className='ml-1'>Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className='flex items-center'>
          <ChevronRight size={14} className='mx-2' />
          {item.href ? (
            <Link
              href={item.href}
              className='hover:text-gray-700 transition-colors'
            >
              {item.label}
            </Link>
          ) : (
            <span className='text-gray-900 font-medium'>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
