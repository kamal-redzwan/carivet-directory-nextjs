// Example implementations showing how to use ServiceFeatureComponents
// This file demonstrates how to replace inline feature grids with reusable components

import { useRouter } from 'next/navigation';
import { FeatureGrid, WhyChooseUs, ServicesGrid } from '@/components/ServiceFeatureComponents';
import {
  veterinaryServices,
  whyChooseUsFeatures,
  whatWeDoFeatures,
  companyValues,
  petCareTips,
  advancedServices,
  qualityFeatures
} from '@/data/serviceFeatures';

// Example 1: Replace homepage "Specialized Veterinary Services" section
export function SpecializedServicesSection() {
  const router = useRouter();

  // Convert services to include router navigation
  const servicesWithNavigation = veterinaryServices.map(service => ({
    ...service,
    onClick: () => router.push(service.searchUrl || '/clinics')
  }));

  return (
    <ServicesGrid
      title="Specialized Veterinary Services"
      subtitle="Find clinics that offer specialized care for your pets' specific needs"
      services={servicesWithNavigation}
      sectionClassName="py-16 bg-white"
      linkText="Find clinics"
    />
  );
}

// Example 2: Replace homepage "Why Use CariVet?" section
export function WhyUseCariVetSection() {
  return (
    <WhyChooseUs
      title="Why Use CariVet?"
      items={whyChooseUsFeatures}
      sectionClassName="py-16 bg-emerald-50"
      iconColor="emerald"
    />
  );
}

// Example 3: Replace About page "What We Do" section
export function WhatWeDoSection() {
  return (
    <FeatureGrid
      title="What We Do"
      items={whatWeDoFeatures}
      variant="cards"
      columns={4}
      iconColor="emerald"
      sectionClassName="mb-16"
      className="gap-8"
    />
  );
}

// Example 4: Replace About page "Our Values" section
export function OurValuesSection() {
  return (
    <WhyChooseUs
      title="Our Values"
      items={companyValues}
      sectionClassName="py-16 bg-gray-50"
      iconColor="blue"
    />
  );
}

// Example 5: Replace Tips page grid
export function PetCareTipsSection() {
  return (
    <FeatureGrid
      title="Essential Pet Care Tips"
      subtitle="Follow these guidelines to keep your pet healthy and happy"
      items={petCareTips}
      variant="cards"
      columns={4}
      iconColor="emerald"
      sectionClassName="py-16 bg-white"
    />
  );
}

// Example 6: Advanced services for premium clinics
export function AdvancedServicesSection() {
  const router = useRouter();

  const advancedServicesWithNavigation = advancedServices.map(service => ({
    ...service,
    onClick: () => router.push(service.searchUrl || '/clinics')
  }));

  return (
    <ServicesGrid
      title="Advanced Veterinary Services"
      subtitle="Cutting-edge care from our premium partner clinics"
      services={advancedServicesWithNavigation}
      sectionClassName="py-16 bg-gradient-to-br from-blue-50 to-indigo-50"
      linkText="Find specialists"
    />
  );
}

// Example 7: Quality indicators section
export function QualityAssuranceSection() {
  return (
    <WhyChooseUs
      title="Quality You Can Trust"
      items={qualityFeatures}
      sectionClassName="py-16 bg-white"
      iconColor="purple"
    />
  );
}

// Example 8: Minimal variant for sidebar or compact spaces
export function CompactFeaturesSection() {
  const compactFeatures = whyChooseUsFeatures.slice(0, 3);
  
  return (
    <FeatureGrid
      items={compactFeatures.map(item => ({ ...item }))}
      variant="minimal"
      columns={3}
      iconColor="gray"
      sectionClassName="py-8"
      className="gap-4"
    />
  );
}

// Example 9: Custom styled feature grid
export function CustomStyledSection() {
  return (
    <FeatureGrid
      title="Why Pet Owners Choose Us"
      items={whyChooseUsFeatures.map(item => ({ ...item }))}
      variant="default"
      columns={3}
      iconColor="blue"
      sectionClassName="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      className="gap-12"
    />
  );
}

// Usage instructions in comments:
/*
// To replace existing inline feature grids in your pages:

// 1. In your page component, import the example:
import { SpecializedServicesSection } from '@/components/examples/ServiceFeatureExamples';

// 2. Replace the inline grid with the component:
// OLD CODE (remove this):
<section className='py-16 bg-white'>
  <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <div className='text-center mb-12'>
      <h2 className='text-3xl font-bold text-gray-900 mb-4'>
        Specialized Veterinary Services
      </h2>
      ... (long inline grid code)
    </div>
  </div>
</section>

// NEW CODE (use this):
<SpecializedServicesSection />

// Benefits:
// - Much cleaner page components
// - Reusable across multiple pages
// - Consistent styling with shadcn components
// - Easy to modify and maintain
// - Better TypeScript support
// - Performance optimized
*/