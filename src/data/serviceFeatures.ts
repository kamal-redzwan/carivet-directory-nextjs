import {
  Clock,
  Stethoscope,
  Heart,
  Syringe,
  PawPrint,
  Scissors,
  Search,
  Shield,
  FileText,
  Globe,
  Users,
  Star,
  Phone,
  MapPin,
  Award,
  Calendar,
  Activity
} from 'lucide-react';
import { FeatureItem, WhyChooseUsItem, ServiceItem } from '@/components/ServiceFeatureComponents';

// Specialized Veterinary Services
export const veterinaryServices: ServiceItem[] = [
  {
    id: 'emergency-care',
    icon: Clock,
    title: 'Emergency Care',
    description: '24/7 emergency veterinary services for urgent pet health issues',
    searchUrl: '/clinics?emergency=true'
  },
  {
    id: 'surgery',
    icon: Stethoscope,
    title: 'Surgery',
    description: 'Advanced surgical procedures performed by experienced veterinarians',
    searchUrl: '/clinics?specializations=Surgery'
  },
  {
    id: 'dental-care',
    icon: Heart,
    title: 'Dental Care',
    description: 'Comprehensive dental health services for optimal pet oral hygiene',
    searchUrl: '/clinics?specializations=Dentistry'
  },
  {
    id: 'vaccination',
    icon: Syringe,
    title: 'Vaccination',
    description: 'Essential immunizations to protect your pets from preventable diseases',
    searchUrl: '/clinics?services=Vaccination'
  },
  {
    id: 'exotic-pet-care',
    icon: PawPrint,
    title: 'Exotic Pet Care',
    description: 'Specialized care for birds, reptiles, and other exotic companions',
    searchUrl: '/clinics?animals=Exotic'
  },
  {
    id: 'grooming',
    icon: Scissors,
    title: 'Grooming',
    description: 'Professional pet grooming services for health and appearance',
    searchUrl: '/clinics?services=Grooming'
  }
];

// Why Choose CariVet features
export const whyChooseUsFeatures: WhyChooseUsItem[] = [
  {
    id: 'easy-search',
    icon: Search,
    title: 'Easy Search',
    description: 'Quickly find veterinary clinics near you with our powerful search tools'
  },
  {
    id: 'trusted-information',
    icon: Shield,
    title: 'Trusted Information',
    description: 'Verified and up-to-date clinic information you can rely on'
  },
  {
    id: 'detailed-profiles',
    icon: FileText,
    title: 'Detailed Profiles',
    description: 'Comprehensive clinic profiles with services, hours, and contact details'
  }
];

// Company "What We Do" features
export const whatWeDoFeatures: FeatureItem[] = [
  {
    id: 'veterinary-directory',
    icon: PawPrint,
    title: 'Veterinary Directory',
    description: 'Comprehensive listing of veterinary clinics across Malaysia with detailed information about services, facilities, and expertise.'
  },
  {
    id: 'pet-care-resources',
    icon: Heart,
    title: 'Pet Care Resources',
    description: 'Educational content and resources to help pet owners make informed decisions about their pets\' health and well-being.'
  },
  {
    id: 'community-support',
    icon: Users,
    title: 'Community Support',
    description: 'Building a supportive community of pet owners and veterinary professionals across the region.'
  },
  {
    id: 'nationwide-coverage',
    icon: Globe,
    title: 'Nationwide Coverage',
    description: 'Extensive network covering urban and rural areas to ensure pet care accessibility everywhere.'
  }
];

// Company Values
export const companyValues: WhyChooseUsItem[] = [
  {
    id: 'trust-reliability',
    icon: Shield,
    title: 'Trust & Reliability',
    description: 'We provide accurate, verified information about veterinary clinics to help you make confident decisions about your pet\'s care.'
  },
  {
    id: 'accessibility',
    icon: Globe,
    title: 'Accessibility',
    description: 'Our platform is designed to be accessible to all pet owners, regardless of location or technical expertise.'
  },
  {
    id: 'community',
    icon: Users,
    title: 'Community',
    description: 'We believe in fostering a strong community of pet lovers and supporting the important work of veterinary professionals.'
  }
];

// Pet Care Tips
export const petCareTips: FeatureItem[] = [
  {
    id: 'regular-checkups',
    icon: PawPrint,
    title: 'Regular Check-ups',
    description: 'Schedule routine veterinary visits to catch health issues early and keep your pet healthy.'
  },
  {
    id: 'proper-nutrition',
    icon: Heart,
    title: 'Proper Nutrition',
    description: 'Feed your pet a balanced diet appropriate for their age, size, and health condition.'
  },
  {
    id: 'regular-exercise',
    icon: Clock,
    title: 'Regular Exercise',
    description: 'Ensure your pet gets adequate physical activity to maintain a healthy weight and mental well-being.'
  },
  {
    id: 'safety-first',
    icon: Shield,
    title: 'Safety First',
    description: 'Keep your pet safe with proper identification, secure environments, and hazard awareness.'
  }
];

// Advanced Services (for premium clinics)
export const advancedServices: ServiceItem[] = [
  {
    id: 'specialist-care',
    icon: Star,
    title: 'Specialist Care',
    description: 'Board-certified specialists in cardiology, oncology, and other advanced fields',
    searchUrl: '/clinics?specializations=Cardiology,Oncology'
  },
  {
    id: 'telemedicine',
    icon: Phone,
    title: 'Telemedicine',
    description: 'Remote consultations and follow-up care for your convenience',
    searchUrl: '/clinics?services=Telemedicine'
  },
  {
    id: 'mobile-services',
    icon: MapPin,
    title: 'Mobile Services',
    description: 'Home visits and mobile clinic services for pets that need special care',
    searchUrl: '/clinics?services=Mobile'
  },
  {
    id: 'preventive-care',
    icon: Calendar,
    title: 'Preventive Care',
    description: 'Comprehensive wellness programs to keep your pet healthy year-round',
    searchUrl: '/clinics?services=Wellness'
  }
];

// Quality Indicators
export const qualityFeatures: WhyChooseUsItem[] = [
  {
    id: 'certified-professionals',
    icon: Award,
    title: 'Certified Professionals',
    description: 'All listed clinics are staffed by licensed veterinarians and certified professionals'
  },
  {
    id: 'modern-facilities',
    icon: Activity,
    title: 'Modern Facilities',
    description: 'State-of-the-art equipment and facilities for the best possible care'
  },
  {
    id: 'emergency-ready',
    icon: Clock,
    title: 'Emergency Ready',
    description: '24/7 emergency services available when your pet needs immediate care'
  }
];