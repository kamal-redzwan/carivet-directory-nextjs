import { supabase } from './supabase';
import { sampleClinics } from '@/data/sampleClinics';

export async function seedDatabase() {
  try {
    // First, check if we already have data
    const { data: existingClinics, error: checkError } = await supabase
      .from('clinics')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return { success: false, error: checkError.message };
    }

    if (existingClinics && existingClinics.length > 0) {
      return { success: true, message: 'Database already seeded' };
    }

    // Transform our sample data to match the database schema
    const clinicsToInsert = sampleClinics.map((clinic) => ({
      name: clinic.name,
      street: clinic.street,
      city: clinic.city,
      state: clinic.state,
      postcode: clinic.postcode,
      phone: clinic.phone,
      email: 'email' in clinic ? clinic.email : null,
      website: clinic.website || null,
      hours: clinic.hours,
      emergency: clinic.emergency,
      emergency_hours:
        'emergency_hours' in clinic ? clinic.emergency_hours : null,
      emergency_details:
        'emergency_details' in clinic ? clinic.emergency_details : null,
      animals_treated: clinic.animals_treated,
      specializations: clinic.specializations,
      services_offered: clinic.services_offered,
      facebook_url: 'facebook_url' in clinic ? clinic.facebook_url : null,
      instagram_url: 'instagram_url' in clinic ? clinic.instagram_url : null,
    }));

    // Insert the data
    const { data, error } = await supabase
      .from('clinics')
      .insert(clinicsToInsert)
      .select();

    if (error) {
      console.error('Error inserting data:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: `Successfully added ${data?.length} clinics to database`,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
