export interface Clinic {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  hours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
    special_notes?: string;
  };
  services: {
    emergency: boolean;
    emergency_hours?: string;
    emergency_details?: string;
    animals_treated: string[];
    specializations: string[];
    services_offered: string[];
  };
  social: {
    facebook?: string;
    instagram?: string;
  };
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
