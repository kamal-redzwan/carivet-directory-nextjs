import { createClient } from '@supabase/supabase-js';
import { AdminUser, AdminRole, UserWithRole } from '@/types/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class AuthService {
  /**
   * Sign in admin user
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // Check if user has admin access
      const adminUser = await this.getAdminUser(data.user.id);
      if (!adminUser || !adminUser.is_active) {
        await supabase.auth.signOut();
        return { error: 'Access denied. Admin privileges required.' };
      }

      // Update last login
      await this.updateLastLogin(adminUser.id);

      return { user: data.user };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Sign in failed',
      };
    }
  }

  /**
   * Sign out user
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get current user with role information
   */
  static async getCurrentUserWithRole(): Promise<UserWithRole | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const adminUser = await this.getAdminUserWithRole(user.id);
      if (!adminUser) return null;

      return {
        user: adminUser,
        role: adminUser.role!,
        permissions: adminUser.role!.permissions,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get admin user by user_id
   */
  static async getAdminUser(userId: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;
    return data;
  }

  /**
   * Get admin user with role information
   */
  static async getAdminUserWithRole(
    userId: string
  ): Promise<(AdminUser & { role: AdminRole }) | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select(
        `
        *,
        role:admin_roles(*)
      `
      )
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;
    return data as AdminUser & { role: AdminRole };
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(adminUserId: string) {
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUserId);
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(
    userPermissions: Record<string, string[]>,
    resource: string,
    action: string
  ): boolean {
    const resourcePermissions = userPermissions[resource];
    if (!resourcePermissions) return false;
    return resourcePermissions.includes(action);
  }

  /**
   * Check if user has specific role
   */
  static isRole(userRole: string, targetRole: AdminRole['name']): boolean {
    return userRole === targetRole;
  }

  /**
   * Get all admin roles
   */
  static async getAllRoles(): Promise<AdminRole[]> {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  /**
   * Create new admin user
   */
  static async createAdminUser(
    email: string,
    roleId: string
  ): Promise<AdminUser> {
    // First invite the user
    const { data: authData, error: authError } =
      await supabase.auth.admin.inviteUserByEmail(email, {
        data: { is_admin: true },
        redirectTo: `${window.location.origin}/admin/auth/callback`,
      });

    if (authError) throw authError;

    // Create admin user record
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        user_id: authData.user.id,
        email,
        role_id: roleId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update admin user role
   */
  static async updateAdminUserRole(
    userId: string,
    roleId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .update({ role_id: roleId })
      .eq('id', userId);

    if (error) throw error;
  }

  /**
   * Deactivate admin user
   */
  static async deactivateAdminUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: false })
      .eq('id', userId);

    if (error) throw error;
  }

  /**
   * Get all admin users
   */
  static async getAllAdminUsers(): Promise<
    (AdminUser & { role: AdminRole })[]
  > {
    const { data, error } = await supabase
      .from('admin_users')
      .select(
        `
        *,
        role:admin_roles(*)
      `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as (AdminUser & { role: AdminRole })[];
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: UserWithRole | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          const userWithRole = await this.getCurrentUserWithRole();
          callback(userWithRole);
        } else if (event === 'SIGNED_OUT') {
          callback(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        callback(null);
      }
    });
  }
}
