'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, RotateCcw, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OperatingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface OperatingHoursInputProps {
  hours: OperatingHours;
  onChange: (hours: OperatingHours) => void;
  error?: string;
}

const defaultHours: OperatingHours = {
  monday: '09:00 - 18:00',
  tuesday: '09:00 - 18:00',
  wednesday: '09:00 - 18:00',
  thursday: '09:00 - 18:00',
  friday: '09:00 - 18:00',
  saturday: '09:00 - 14:00',
  sunday: 'Closed',
};

const quickPresets = [
  { name: 'Standard', hours: defaultHours },
  {
    name: 'Extended',
    hours: {
      ...defaultHours,
      monday: '08:00 - 20:00',
      tuesday: '08:00 - 20:00',
      wednesday: '08:00 - 20:00',
      thursday: '08:00 - 20:00',
      friday: '08:00 - 20:00',
      saturday: '08:00 - 16:00',
    },
  },
  {
    name: '24/7',
    hours: Object.keys(defaultHours).reduce(
      (acc, day) => ({ ...acc, [day]: '24 Hours' }),
      {} as OperatingHours
    ),
  },
];

export function OperatingHoursInput({
  hours,
  onChange,
  error,
}: OperatingHoursInputProps) {
  const [showPresets, setShowPresets] = useState(false);

  const handleDayChange = (day: keyof OperatingHours, value: string) => {
    onChange({ ...hours, [day]: value });
  };

  const copyToAllDays = (sourceDay: keyof OperatingHours) => {
    const sourceHours = hours[sourceDay];
    const newHours = Object.keys(hours).reduce((acc, day) => {
      acc[day as keyof OperatingHours] = sourceHours;
      return acc;
    }, {} as OperatingHours);
    onChange(newHours);
  };

  const applyPreset = (preset: OperatingHours) => {
    onChange(preset);
    setShowPresets(false);
  };

  const resetToDefault = () => {
    onChange(defaultHours);
  };

  return (
    <Card className={cn(error && 'border-red-300')}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            Operating Hours
          </CardTitle>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setShowPresets(!showPresets)}
            >
              Quick Presets
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={resetToDefault}
            >
              <RotateCcw className='h-4 w-4 mr-1' />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Quick Presets */}
        {showPresets && (
          <div className='grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-lg'>
            {quickPresets.map((preset) => (
              <Button
                key={preset.name}
                type='button'
                variant='outline'
                size='sm'
                onClick={() => applyPreset(preset.hours)}
                className='text-xs'
              >
                {preset.name}
              </Button>
            ))}
          </div>
        )}

        {/* Days Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.entries(hours).map(([day, time]) => (
            <div key={day} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700 capitalize'>
                  {day}
                </label>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => copyToAllDays(day as keyof OperatingHours)}
                  className='text-xs h-6 px-2'
                  title={`Copy ${day} hours to all days`}
                >
                  <Copy className='h-3 w-3' />
                </Button>
              </div>

              <div className='flex gap-2'>
                <input
                  type='text'
                  value={time}
                  onChange={(e) =>
                    handleDayChange(day as keyof OperatingHours, e.target.value)
                  }
                  className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='e.g., 09:00 - 18:00 or Closed'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    handleDayChange(day as keyof OperatingHours, 'Closed')
                  }
                  className='text-xs'
                >
                  Closed
                </Button>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
            {error}
          </div>
        )}

        {/* Format Help */}
        <div className='text-xs text-gray-500 bg-blue-50 p-3 rounded-md'>
          <strong>Format examples:</strong>
          <ul className='mt-1 space-y-1'>
            <li>• Regular hours: &quot;09:00 - 18:00&quot;</li>
            <li>• Split hours: &quot;09:00 - 12:00, 14:00 - 18:00&quot;</li>
            <li>
              • 24 hours: &quot;24 Hours&quot; or &quot;00:00 - 23:59&quot;
            </li>
            <li>• Closed: &quot;Closed&quot;</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
