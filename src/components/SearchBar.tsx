import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search for veterinary clinics...',
}: SearchBarProps) {
  return (
    <div className='relative w-full max-w-2xl mx-auto'>
      <div className='relative'>
        <Search
          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
          size={20}
        />
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500'
        />
      </div>
    </div>
  );
}
