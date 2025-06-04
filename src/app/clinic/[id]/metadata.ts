import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const { data: clinic } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!clinic) {
      return {
        title: 'Clinic Not Found - CariVet',
        description: 'The requested veterinary clinic could not be found.',
      };
    }

    const title = `${clinic.name} - Veterinary Clinic in ${clinic.city}, ${clinic.state}`;
    const description = `Find contact details, services, and operating hours for ${
      clinic.name
    }, a trusted veterinary clinic in ${clinic.city}, ${clinic.state}. ${
      clinic.emergency ? 'Emergency services available.' : ''
    }`;

    return {
      title,
      description,
      keywords: [
        'veterinary clinic',
        clinic.city,
        clinic.state,
        'pet care',
        'animal hospital',
        ...clinic.services_offered,
        ...clinic.specializations,
        ...clinic.animals_treated,
      ].join(', '),
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'en_MY',
        siteName: 'CariVet Directory',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  } catch (error) {
    return {
      title: 'Veterinary Clinic - CariVet',
      description:
        'Find trusted veterinary clinics across Malaysia with CariVet Directory.',
    };
  }
}
