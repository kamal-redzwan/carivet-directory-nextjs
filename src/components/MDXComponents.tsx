import React from 'react';
import { Check, AlertTriangle, Info, Lightbulb } from 'lucide-react';

export const MDXComponents = {
  h1: ({ children, ...props }: any) => (
    <h1
      className='text-4xl font-bold text-gray-900 mb-6 leading-tight'
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className='text-2xl font-bold text-gray-900 mt-8 mb-4' {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className='text-xl font-semibold text-gray-900 mt-6 mb-3' {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className='mb-6 leading-relaxed text-gray-700' {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className='space-y-2 mb-6 ml-6' {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: any) => (
    <li className='list-disc' {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className='font-semibold text-gray-900' {...props}>
      {children}
    </strong>
  ),

  // Custom components for blog content
  KeyTakeaways: ({ children }: { children: React.ReactNode }) => (
    <div className='bg-emerald-50 p-6 rounded-lg mb-8'>
      <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
        <Check size={20} className='text-emerald-600' />
        Key Takeaways:
      </h4>
      <div className='space-y-2'>{children}</div>
    </div>
  ),

  ImportantNote: ({ children }: { children: React.ReactNode }) => (
    <div className='p-4 bg-yellow-100 border-l-4 border-yellow-500 mb-6'>
      <div className='flex items-start gap-3'>
        <AlertTriangle
          size={20}
          className='text-yellow-600 mt-0.5 flex-shrink-0'
        />
        <div className='text-sm font-medium text-yellow-800'>{children}</div>
      </div>
    </div>
  ),

  InfoBox: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className='bg-blue-50 p-6 rounded-lg mb-6'>
      <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
        <Info size={20} className='text-blue-600' />
        {title}
      </h4>
      <div className='text-gray-700'>{children}</div>
    </div>
  ),

  VaccineSchedule: ({ children }: { children: React.ReactNode }) => (
    <div className='bg-emerald-50 p-6 rounded-lg mb-6'>
      <h4 className='font-semibold text-gray-900 mb-4'>
        Vaccination Schedule:
      </h4>
      {children}
    </div>
  ),

  MythBuster: ({ myth, truth }: { myth: string; truth: string }) => (
    <div className='border-l-4 border-red-500 pl-4 mb-4'>
      <h4 className='font-semibold text-gray-900 mb-2'>Myth: "{myth}"</h4>
      <p className='text-sm'>
        <strong className='text-emerald-600'>Truth:</strong> {truth}
      </p>
    </div>
  ),

  CostComparison: ({ children }: { children: React.ReactNode }) => (
    <div className='bg-gray-50 p-6 rounded-lg mb-6'>
      <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
        <Lightbulb size={20} className='text-yellow-600' />
        Cost Comparison:
      </h4>
      {children}
    </div>
  ),
};
