'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield } from 'lucide-react';
import { useState } from 'react';

export function AdminHeader() {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) return null;

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <div className='flex items-center'>
            <Shield className='h-8 w-8 text-emerald-600 mr-3' />
            <h1 className='text-xl font-semibold text-gray-900'>
              CariVet Admin
            </h1>
          </div>

          <div className='flex items-center space-x-4'>
            {/* User Info */}
            <div className='flex items-center space-x-3'>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-900'>
                  {user.user.email}
                </p>
                <p className='text-xs text-gray-500'>
                  {user.role.display_name}
                </p>
              </div>

              {/* User Avatar */}
              <div className='relative'>
                <Button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className='w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors'
                >
                  <User className='h-4 w-4 text-emerald-600' />
                </Button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
                    <div className='px-4 py-2 border-b border-gray-100'>
                      <p className='text-sm font-medium text-gray-900'>
                        {user.user.email}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {user.role.display_name}
                      </p>
                    </div>

                    <Button
                      onClick={handleSignOut}
                      className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'
                    >
                      <LogOut className='h-4 w-4 mr-2' />
                      Sign out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
