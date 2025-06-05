'use client';

import { PawPrint, Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Header Navigation */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            {/* Logo */}
            <div className='flex items-center'>
              <PawPrint className='h-8 w-8 text-emerald-600 mr-2' />
              <span className='text-xl font-bold text-gray-900'>CariVet</span>
            </div>

            {/* Navigation */}
            <nav className='hidden md:flex space-x-8'>
              <Link href='/' className='text-gray-600 hover:text-emerald-600'>
                Home
              </Link>
              <Link
                href='/clinics'
                className='text-gray-600 hover:text-emerald-600'
              >
                Find Clinics
              </Link>
              <Link
                href='/tips'
                className='text-gray-600 hover:text-emerald-600'
              >
                Pet Care Tips
              </Link>
              <Link
                href='/blog'
                className='text-gray-600 hover:text-emerald-600'
              >
                Blog
              </Link>
              <Link
                href='/about'
                className='text-gray-600 hover:text-emerald-600'
              >
                About
              </Link>
              <Link
                href='/contact'
                className='text-gray-600 hover:text-emerald-600'
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='bg-emerald-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Terms of Service</h1>
          <p className='text-emerald-100'>Last Updated: May 20, 2023</p>
        </div>
      </section>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='prose prose-gray max-w-none'>
          {/* 1. Acceptance of Terms */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              1. Acceptance of Terms
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              By accessing and using CariVet (the "Service"), you accept and
              agree to be bound by the terms and provisions of this agreement.
              If you do not agree to abide by the above, please do not use this
              service. In addition, when using this website's particular
              services, you shall be subject to any posted guidelines or rules
              applicable to such services, which may be posted and modified from
              time to time. All such guidelines or rules are hereby incorporated
              by reference into these Terms of Service.
            </p>
          </section>

          {/* 2. Description of Service */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              2. Description of Service
            </h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              CariVet provides users with access to a collection of resources,
              including various communications tools, search services, clinic
              information, and personalized content through its network of
              properties which may be accessed through any various medium or
              device now known or hereafter developed (the "Service"). You also
              understand and agree that the Service may include advertisements
              and that these advertisements are necessary for CariVet to provide
              the Service.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              Unless explicitly stated otherwise, any new features that augment
              or enhance the current Service shall be subject to the Terms of
              Service. You understand and agree that the Service is provided
              "AS-IS" and that CariVet assumes no responsibility for the
              timeliness, deletion, mis-delivery or failure to store any user
              communications or personalization settings.
            </p>
          </section>

          {/* 3. Registration Obligations */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              3. Registration Obligations
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              In consideration of your use of the Service, you agree to: (a)
              provide true, accurate, current and complete information about
              yourself as prompted by the Service's registration form (such
              information being the "Registration Data") and (b) maintain and
              promptly update the Registration Data to keep it true, accurate,
              current and complete. If you provide any information that is
              untrue, inaccurate, not current or incomplete, or CariVet has
              reasonable grounds to suspect that such information is untrue,
              inaccurate, not current or incomplete, CariVet has the right to
              suspend or terminate your account and refuse any and all current
              or future use of the Service (or any portion thereof).
            </p>
          </section>

          {/* 4. User Account, Password, and Security */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              4. User Account, Password, and Security
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              You will receive a password and account designation upon
              completing the Service's registration process. You are responsible
              for maintaining the confidentiality of the password and account
              and are fully responsible for all activities that occur under your
              password or account. You agree to (a) immediately notify CariVet
              of any unauthorized use of your password or account or any other
              breach of security, and (b) ensure that you exit from your account
              at the end of each session. CariVet cannot and will not be liable
              for any loss or damage arising from your failure to comply with
              this Section.
            </p>
          </section>

          {/* 5. User Conduct */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              5. User Conduct
            </h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              You understand that all information, data, text, software, music,
              sound, photographs, graphics, video, messages or other materials
              ("Content"), whether publicly posted or privately transmitted, are
              the sole responsibility of the person from which such Content
              originated. This means that you, and not CariVet, are entirely
              responsible for all Content that you upload, post, email, transmit
              or otherwise make available via the Service. CariVet does not
              control the Content posted via the Service and, as such, does not
              guarantee the accuracy, integrity or quality of such Content.
            </p>
            <p className='text-gray-600 leading-relaxed mb-4'>
              You agree to not use the Service to:
            </p>
            <ul className='space-y-2 text-gray-600 mb-4'>
              <li>
                • Upload, post, email, transmit or otherwise make available any
                Content that is unlawful, harmful, threatening, abusive,
                harassing, tortious, defamatory, vulgar, obscene, libelous,
                invasive of another's privacy, hateful, or racially, ethnically
                or otherwise objectionable;
              </li>
              <li>• Harm minors in any way;</li>
              <li>
                • Impersonate any person or entity, including, but not limited
                to, a CariVet official, forum leader, guide or host, or falsely
                state or otherwise misrepresent your affiliation with a person
                or entity;
              </li>
              <li>
                • Forge headers or otherwise manipulate identifiers in order to
                disguise the origin of any Content transmitted through the
                Service;
              </li>
              <li>
                • Upload, post, email, transmit or otherwise make available any
                Content that you do not have a right to make available under any
                law or under contractual or fiduciary relationships;
              </li>
              <li>
                • Upload, post, email, transmit or otherwise make available any
                Content that infringes any patent, trademark, trade secret,
                copyright or other proprietary rights of any party;
              </li>
              <li>
                • Upload, post, email, transmit or otherwise make available any
                unsolicited or unauthorized advertising, promotional materials,
                "junk mail," "spam," "chain letters," "pyramid schemes," or any
                other form of solicitation;
              </li>
              <li>
                • Upload, post, email, transmit or otherwise make available any
                material that contains software viruses or any other computer
                code, files or programs designed to interrupt, destroy or limit
                the functionality of any computer software or hardware or
                telecommunications equipment;
              </li>
              <li>
                • Interfere with or disrupt the Service or servers or networks
                connected to the Service, or disobey any requirements,
                procedures, policies or regulations of networks connected to the
                Service;
              </li>
              <li>• "Stalk" or otherwise harass another; or</li>
              <li>
                • Collect or store personal data about other users in connection
                with the prohibited conduct and activities set forth in
                paragraphs above.
              </li>
            </ul>
          </section>

          {/* 6. Modifications to Service */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              6. Modifications to Service
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              CariVet reserves the right at any time and from time to time to
              modify or discontinue, temporarily or permanently, the Service (or
              any part thereof) with or without notice. You agree that CariVet
              shall not be liable to you or to any third party for any
              modification, suspension or discontinuance of the Service.
            </p>
          </section>

          {/* 7. Termination */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              7. Termination
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              You agree that CariVet, in its sole discretion, may terminate your
              password, account (or any part thereof) or use of the Service, and
              remove and discard any content within the Service, for any reason,
              including, without limitation, for lack of use or if CariVet
              believes that you have violated or acted inconsistently with the
              letter or spirit of these Terms of Service. Any suspected
              fraudulent, abusive or illegal activity that may be grounds for
              termination of your use of Service, may be referred to appropriate
              law enforcement authorities. CariVet may also in its sole
              discretion and at any time discontinue providing the Service, or
              any part thereof, with or without notice. You agree that CariVet
              shall not be liable to you or any third party for any termination
              of your access to the Service. Further, you agree that CariVet
              shall not be liable to you for any termination of your access to
              the Service.
            </p>
          </section>

          {/* 8. Disclaimer of Warranties */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              8. Disclaimer of Warranties
            </h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              YOU EXPRESSLY UNDERSTAND AND AGREE THAT:
            </p>
            <p className='text-gray-600 leading-relaxed mb-4'>
              YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS
              PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. CARIVET EXPRESSLY
              DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
              INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
              NON-INFRINGEMENT.
            </p>
            <p className='text-gray-600 leading-relaxed mb-4'>
              CARIVET MAKES NO WARRANTY THAT (i) THE SERVICE WILL MEET YOUR
              REQUIREMENTS, (ii) THE SERVICE WILL BE UNINTERRUPTED, TIMELY,
              SECURE, OR ERROR-FREE, (iii) THE RESULTS THAT MAY BE OBTAINED FROM
              THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE, (iv) THE
              QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL
              PURCHASED OR OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR
              EXPECTATIONS, AND (V) ANY ERRORS IN THE SOFTWARE WILL BE
              CORRECTED.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF
              THE SERVICE IS DONE AT YOUR OWN DISCRETION AND RISK AND THAT YOU
              WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM
              OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF ANY SUCH
              MATERIAL.
            </p>
          </section>

          {/* 9. Contact Information */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              9. Contact Information
            </h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <div className='text-gray-600 space-y-1'>
              <p>
                <strong>CariVet</strong>
              </p>
              <p>123 Jalan Bukit Bintang</p>
              <p>Kuala Lumpur, 50200</p>
              <p>Malaysia</p>
              <p>Email: terms@carivet.my</p>
              <p>Phone: +60312345678</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-emerald-600 text-white py-12 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {/* CariVet Info */}
            <div>
              <div className='flex items-center mb-4'>
                <PawPrint className='h-6 w-6 mr-2' />
                <span className='text-lg font-bold'>CariVet</span>
              </div>
              <p className='text-emerald-100 text-sm'>
                Helping pet owners in Malaysia find the right veterinary care
                for their beloved animals.
              </p>
              <div className='flex space-x-4 mt-4'>
                <Facebook className='h-5 w-5 text-emerald-200 hover:text-white cursor-pointer' />
                <Twitter className='h-5 w-5 text-emerald-200 hover:text-white cursor-pointer' />
                <Instagram className='h-5 w-5 text-emerald-200 hover:text-white cursor-pointer' />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
              <ul className='space-y-2 text-emerald-100'>
                <li>
                  <Link href='/' className='hover:text-white'>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href='/clinics' className='hover:text-white'>
                    Find Clinics
                  </Link>
                </li>
                <li>
                  <Link href='/tips' className='hover:text-white'>
                    Pet Care Tips
                  </Link>
                </li>
                <li>
                  <Link href='/blog' className='hover:text-white'>
                    Veterinary Blog
                  </Link>
                </li>
                <li>
                  <Link href='/about' className='hover:text-white'>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href='/contact' className='hover:text-white'>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Resources</h4>
              <ul className='space-y-2 text-emerald-100'>
                <li>
                  <Link href='/tips' className='hover:text-white'>
                    Pet Care Tips
                  </Link>
                </li>
                <li>
                  <Link href='/blog' className='hover:text-white'>
                    Veterinary Blog
                  </Link>
                </li>
                <li>
                  <Link href='/emergency' className='hover:text-white'>
                    Emergency Services
                  </Link>
                </li>
                <li>
                  <Link href='/add-clinic' className='hover:text-white'>
                    Add Your Clinic
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Legal</h4>
              <ul className='space-y-2 text-emerald-100'>
                <li>
                  <Link href='/privacy' className='hover:text-white'>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href='/terms' className='hover:text-white'>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href='/cookies' className='hover:text-white'>
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-emerald-500 mt-8 pt-8 text-center text-emerald-100'>
            <p>&copy; 2025 CariVet Malaysia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
