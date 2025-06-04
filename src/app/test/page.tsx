'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('count')
          .limit(1);

        if (error) {
          console.error('Connection error:', error);
          setConnected(false);
        } else {
          console.log('Connected successfully!');
          setConnected(true);
        }
      } catch (error) {
        console.error('Error:', error);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>CariVet Setup Test</h1>

      <div className='space-y-4'>
        <div>
          <strong>Next.js:</strong> ✅ Working
        </div>
        <div>
          <strong>TailwindCSS:</strong> ✅ Working
        </div>
        <div>
          <strong>Supabase Connection:</strong>{' '}
          {loading ? '⏳ Testing...' : connected ? '✅ Connected' : '❌ Failed'}
        </div>
      </div>

      {connected && (
        <div className='mt-6 p-4 bg-green-100 border border-green-400 rounded'>
          🎉 Everything is set up correctly! Ready to build CariVet.
        </div>
      )}
    </div>
  );
}
