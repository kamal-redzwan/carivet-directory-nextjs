export interface AdminRole {
  id: string;
  name: 'super_admin' | 'admin' | 'moderator' | 'clinic_owner';
  display_name: string;
  description: string | null;
  permissions: Record<string, string[]>;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role_id: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  role?: AdminRole;
}

export interface UserWithRole {
  user: AdminUser;
  role: AdminRole;
  permissions: Record<string, string[]>;
}

export type Permission = {
  resource: string;
  actions: string[];
};

export type RolePermissions = {
  users?: string[];
  clinics?: string[];
  content?: string[];
  analytics?: string[];
  system?: string[];
};

// Authentication context types
export interface AuthContextType {
  user: UserWithRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  isRole: (role: AdminRole['name']) => boolean;
}
