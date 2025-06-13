import { supabase } from '@/lib/supabase';

export class SimpleAuthService {
  static async signIn(email: string, password: string) {
    try {
      // Just do basic auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return { user: data.user };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Sign in failed',
      };
    }
  }

  static async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static async checkAdminUser(userId: string) {
    try {
      // Simple query without joins first
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error checking admin user:', error);
      return { data: null, error };
    }
  }
}
