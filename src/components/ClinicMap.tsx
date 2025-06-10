import { Button } from '@/components/ui/button';

interface ClinicMapProps {
  clinicName: string;
  address: string;
  city: string;
  state: string;
  className?: string;
}

export default function ClinicMap({
  clinicName,
  address,
  city,
  state,
  className = '',
}: ClinicMapProps) {
  // Create a search query for Google Maps
  const searchQuery = encodeURIComponent(
    `${clinicName} ${address} ${city} ${state} Malaysia`
  );
  const embedUrl = `https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${searchQuery}`;

  // Fallback if no API key is provided
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      <div className='p-4 border-b border-gray-100'>
        <h3 className='font-semibold text-gray-900'>Location</h3>
        <p className='text-sm text-gray-600 mt-1'>
          {address}, {city}, {state}
        </p>
      </div>

      <div className='relative'>
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          // Embedded Google Map (requires API key)
          <iframe
            src={embedUrl}
            width='100%'
            height='300'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            title={`Map showing location of ${clinicName}`}
          />
        ) : (
          // Fallback: Link to Google Maps (no API key needed)
          <div className='h-64 bg-gray-100 flex items-center justify-center'>
            <div className='text-center'>
              <div className='mb-4'>
                <svg
                  className='w-16 h-16 mx-auto text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
              <p className='text-gray-600 mb-4'>
                {address}, {city}, {state}
              </p>
              <Button
                asChild
                variant='info'
                size='sm'
              >
                <a
                  href={mapUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View on Google Maps
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className='p-4 bg-gray-50'>
        <div className='flex gap-2'>
          <Button
            asChild
            variant='info'
            size='sm'
            className='flex-1'
          >
            <a
              href={mapUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              Get Directions
            </a>
          </Button>
          <Button
            onClick={() => {
              const fullAddress = `${address}, ${city}, ${state}, Malaysia`;
              navigator.clipboard.writeText(fullAddress);
              alert('Address copied to clipboard!');
            }}
            variant='outline'
            size='sm'
          >
            Copy Address
          </Button>
        </div>
      </div>
    </div>
  );
}
