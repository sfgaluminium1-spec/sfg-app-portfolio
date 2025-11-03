
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - ChronoShift Pro',
  description: 'Terms of Service for ChronoShift Pro payroll management system by SFG Aluminium Ltd',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Terms of Service
            </h1>
            <div className="mb-4">
              <p className="text-xl font-semibold text-warren-blue-600 dark:text-warren-blue-400">
                SFG Aluminium Ltd - ChronoShift Pro Payroll System
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>Effective Date:</strong> 12th September 2025<br />
                <strong>Last Updated:</strong> 12th September 2025
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Introduction</h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                These Terms of Service ("Terms") govern your use of the ChronoShift Pro payroll management system ("Service") operated by SFG Aluminium Ltd, a company registered in England and Wales with company number [Company Number], registered office at [Registered Address] ("Company", "we", "us", or "our").
              </p>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Definitions</h2>
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>"Employee"</strong> means any individual employed by SFG Aluminium Ltd who uses the Service to record time and attendance</li>
                <li><strong>"Supervisor"</strong> means any individual authorised by the Company to review and approve employee timesheets</li>
                <li><strong>"Administrator"</strong> means designated personnel with full access to system administration functions</li>
                <li><strong>"Personal Data"</strong> has the meaning given in the UK General Data Protection Regulation (UK GDPR)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Scope of Service</h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">ChronoShift Pro provides:</p>
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Time and attendance recording</li>
                <li>Payroll calculation and processing</li>
                <li>Employee self-service portal</li>
                <li>Management reporting and analytics</li>
                <li>Integration with existing payroll systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. User Accounts and Access</h2>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">4.1 Account Creation</h3>
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Accounts are created by system administrators only</li>
                <li>Users must provide accurate and complete information</li>
                <li>Each user is responsible for maintaining the confidentiality of their login credentials</li>
                <li>Users must notify administration immediately of any unauthorised access</li>
              </ul>

              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">4.2 Acceptable Use</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">Users agree to:</p>
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Use the Service solely for legitimate business purposes</li>
                <li>Record accurate time and attendance information</li>
                <li>Comply with all applicable laws and company policies</li>
                <li>Not attempt to access unauthorised areas of the system</li>
                <li>Not share login credentials with other individuals</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Data Processing and Privacy</h2>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">5.1 Data Controller</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                SFG Aluminium Ltd acts as the data controller for all personal data processed through the Service.
              </p>

              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">5.2 Lawful Basis for Processing</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">We process personal data under the following lawful bases:</p>
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Performance of employment contracts (Article 6(1)(b) UK GDPR)</li>
                <li>Compliance with legal obligations (Article 6(1)(c) UK GDPR)</li>
                <li>Legitimate interests in business administration (Article 6(1)(f) UK GDPR)</li>
              </ul>

              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">5.3 Data Retention</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">Personal data will be retained in accordance with our Data Retention Policy and applicable legal requirements, typically:</p>
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Employee records: 6 years after termination of employment</li>
                <li>Payroll records: 3 years as required by HMRC</li>
                <li>Time and attendance records: 2 years</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. System Availability and Support</h2>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">6.1 Service Availability</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Whilst we strive to maintain continuous availability, we do not guarantee uninterrupted access to the Service. Planned maintenance will be conducted outside normal business hours where possible.
              </p>

              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">6.2 Support</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Technical support is available during business hours (Monday to Friday, 9:00 AM to 5:00 PM GMT). Emergency support may be available for critical system failures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Limitation of Liability</h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Our total liability to any user shall not exceed £1,000 in any 12-month period, except in cases of death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Compliance and Legal Requirements</h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                The Service operates in compliance with UK employment law, including the Working Time Regulations 1998 and Employment Rights Act 1996. We comply with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018. Payroll processing complies with HMRC regulations for PAYE, National Insurance, and statutory payments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">9. Contact Information</h2>
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">SFG Aluminium Ltd</p>
                <p>Email: warren@sfg-aluminium.co.uk</p>
                <p>Phone: [Company Phone Number]</p>
                <p>Address: [Company Address]</p>
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This document was last updated on 12th September 2025. Please review regularly for any changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
