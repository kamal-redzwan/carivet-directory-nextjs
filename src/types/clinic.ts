export interface Clinic {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email?: string | null;
  website?: string | null;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  emergency: boolean;
  emergency_hours?: string | null;
  emergency_details?: string | null;
  animals_treated: string[];
  specializations: string[];
  services_offered: string[];
  facebook_url?: string | null;
  instagram_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SearchFilters {
  query: string;
  state: string;
  city: string;
  emergency: boolean;
  animalTypes: string[];
  specializations: string[];
  services: string[];
}
