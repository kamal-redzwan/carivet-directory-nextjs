'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common/FormField';
import { FormLoading } from '@/components/ui/LoadingComponents';
import { Shield, Mail, Lock } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { adminSignInSchema } from '@/utils/validators';

interface SignInFormData {
  email: string;
  password: string;
}

const initialValues: SignInFormData = {
  email: '',
  password: '',
};

export function SignInForm() {
  const { signIn } = useAuth();
  const router = useRouter();

  const form = useForm({
    initialValues,
    validationSchema: adminSignInSchema,
    onSubmit: async (values) => {
      const result = await signIn(values.email, values.password);

      if (result.error) {
        // Set form-level error
        form.setFieldError('email', result.error);
      } else {
        router.push('/admin/dashboard');
      }
    },
  });

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Shield className='h-8 w-8 text-emerald-600' />
          </div>
          <h2 className='text-3xl font-bold text-gray-900'>Admin Sign In</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Access the CariVet administration panel
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={form.handleSubmit}>
          <div className='space-y-4'>
            <FormField
              label='Email Address'
              type='email'
              placeholder='admin@carivet.my'
              value={form.values.email}
              onChange={(value) => form.handleChange('email', value)}
              onBlur={() => form.handleBlur('email')}
              error={form.errors.email}
              required
              className='relative'
            />

            <FormField
              label='Password'
              type='password'
              placeholder='Enter your password'
              value={form.values.password}
              onChange={(value) => form.handleChange('password', value)}
              onBlur={() => form.handleBlur('password')}
              error={form.errors.password}
              required
              className='relative'
            />
          </div>

          <Button
            type='submit'
            fullWidth
            size='lg'
            loading={form.loading}
            disabled={!form.isValid}
            className='relative'
          >
            {form.loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Form Status */}
          <FormLoading
            loading={form.loading}
            success={false}
            error={form.errors.email || form.errors.password}
          />

          <div className='text-center'>
            <p className='text-xs text-gray-500'>
              Need access? Contact your system administrator
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
