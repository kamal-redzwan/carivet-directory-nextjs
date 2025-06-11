'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormSection {
  id: string;
  name: string;
  required: boolean;
  completed: boolean;
  hasErrors: boolean;
}

interface FormProgressProps {
  sections: FormSection[];
  className?: string;
}

export function FormProgress({ sections, className }: FormProgressProps) {
  const stats = useMemo(() => {
    const total = sections.length;
    const completed = sections.filter((s) => s.completed).length;
    const withErrors = sections.filter((s) => s.hasErrors).length;
    const required = sections.filter((s) => s.required).length;
    const requiredCompleted = sections.filter(
      (s) => s.required && s.completed
    ).length;

    return {
      total,
      completed,
      withErrors,
      required,
      requiredCompleted,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      requiredPercentage:
        required > 0 ? Math.round((requiredCompleted / required) * 100) : 100,
    };
  }, [sections]);

  return (
    <Card className={cn('sticky top-4', className)}>
      <CardContent className='p-4 space-y-4'>
        <div>
          <h3 className='font-medium text-gray-900 mb-2'>Form Progress</h3>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Overall completion</span>
              <span>{stats.percentage}%</span>
            </div>
            <Progress value={stats.percentage} className='h-2' />
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>Required fields</span>
            <span>
              {stats.requiredCompleted}/{stats.required}
            </span>
          </div>
          <Progress value={stats.requiredPercentage} className='h-2' />
        </div>

        {stats.withErrors > 0 && (
          <div className='text-sm text-red-600 bg-red-50 p-2 rounded'>
            {stats.withErrors} section{stats.withErrors > 1 ? 's' : ''} with
            errors
          </div>
        )}

        <div className='space-y-2'>
          <h4 className='text-sm font-medium text-gray-700'>Sections</h4>
          {sections.map((section) => (
            <div key={section.id} className='flex items-center gap-2 text-sm'>
              {section.hasErrors ? (
                <AlertCircle className='h-4 w-4 text-red-500' />
              ) : section.completed ? (
                <CheckCircle className='h-4 w-4 text-green-500' />
              ) : (
                <Circle className='h-4 w-4 text-gray-400' />
              )}
              <span
                className={cn(
                  section.completed && !section.hasErrors && 'text-green-700',
                  section.hasErrors && 'text-red-700',
                  !section.completed && !section.hasErrors && 'text-gray-600'
                )}
              >
                {section.name}
                {section.required && (
                  <span className='text-red-500 ml-1'>*</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
