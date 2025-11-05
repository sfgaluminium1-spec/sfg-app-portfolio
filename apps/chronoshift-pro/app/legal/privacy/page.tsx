
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Statement - ChronoShift Pro',
  description: 'Privacy Statement for ChronoShift Pro payroll management system by SFG Aluminium Ltd',
};

export default function PrivacyStatementPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Privacy Statement
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
                SFG Aluminium Ltd ("Company", "we", "us", or "our") is committed to protecting and respecting your privacy. This Privacy Statement explains how we collect, use, disclose, and safeguard your personal information when you use the ChronoShift Pro payroll management system ("Service").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Data Controller</h2>
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">SFG Aluminium Ltd</p>
                <p>Company Registration: [Company Number]</p>
                <p>Registered Office: [Registered Address]</p>
                <p>ICO Registration: [ICO Number]</p>
                <p>Contact: warren@sfg-aluminium.co.uk</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Information We Collect</h2>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">3.1 Personal Data</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">We collect and process the following categories of personal data:</p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Identity Information:</h4>
                  <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Full name</li>
                    <li>Employee number</li>
                    <li>Date of birth</li>
                    <li>National Insurance number</li>
                    <li>Gender</li>
                    <li>Emergency contact details</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Employment Information:</h4>
                  <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Job title and department</li>
                    <li>Start date and employment status</li>
                    <li>Salary and hourly rates</li>
                    <li>Holiday entitlement</li>
                    <li>Sickness records</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Payroll Information:</h4>
                  <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Gross pay and deductions</li>
                    <li>Tax codes and pension contributions</li>
                    <li>Bank account details</li>
                    <li>P45/P60 information</li>
                    <li>Benefits in kind</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Lawful Basis for Processing</h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">We process personal data under the following lawful bases as defined in the UK GDPR:</p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employment Contract (Article 6(1)(b))</h3>
                  <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Processing payroll and benefits</li>
                    <li>Managing working time and attendance</li>
                    <li>Performance management</li>
                    <li>Health and safety obligations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legal Obligation (Article 6(1)(c))</h3>
                  <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>HMRC reporting requirements</li>
                    <li>Statutory sick pay calculations</li>
                    <li>Pension auto-enrolment</li>
                    <li>Working time directive compliance</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Data Retention</h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">We retain personal data for the following periods:</p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Employment</h3>
                  <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Current employee records: Duration of employment plus retention period</li>
                    <li>Payroll records: Current tax year plus 3 years (HMRC requirement)</li>
                    <li>Time and attendance: 2 years</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Post-Employment</h3>
                  <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Employment records: 6 years after termination</li>
                    <li>Payroll records: 3 years after termination</li>
                    <li>Accident records: 3 years or until age 21 (whichever is longer)</li>
                    <li>Pension records: 6 years after benefits cease</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Your Rights</h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">Under the UK GDPR, you have the following rights:</p>
              
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Right of Access (Article 15):</strong> You can request a copy of your personal data we hold</li>
                <li><strong>Right to Rectification (Article 16):</strong> You can request correction of inaccurate or incomplete data</li>
                <li><strong>Right to Erasure (Article 17):</strong> You can request deletion of your data in certain circumstances</li>
                <li><strong>Right to Restrict Processing (Article 18):</strong> You can request we limit how we use your data</li>
                <li><strong>Right to Data Portability (Article 20):</strong> You can request your data in a portable format</li>
                <li><strong>Right to Object (Article 21):</strong> You can object to processing based on legitimate interests</li>
              </ul>

              <p className="mt-4 text-gray-700 dark:text-gray-300">
                To exercise any of these rights, contact warren@sfg-aluminium.co.uk. We will respond within one month of receiving your request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Data Security</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Measures</h3>
                  <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Multi-factor authentication</li>
                    <li>Regular security updates and patches</li>
                    <li>Access controls and user permissions</li>
                    <li>Secure backup and recovery procedures</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organisational Measures</h3>
                  <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Staff training on data protection</li>
                    <li>Regular security audits and assessments</li>
                    <li>Incident response procedures</li>
                    <li>Data protection impact assessments</li>
                    <li>Privacy by design principles</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Contact Information</h2>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Data Protection Queries</h3>
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">Data Protection Officer</p>
                <p>SFG Aluminium Ltd</p>
                <p>Email: warren@sfg-aluminium.co.uk</p>
                <p>Phone: [Company Phone Number]</p>
                <p>Address: [Company Address]</p>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Regulatory Authority</h3>
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">Information Commissioner's Office (ICO)</p>
                <p>Wycliffe House</p>
                <p>Water Lane</p>
                <p>Wilmslow</p>
                <p>Cheshire SK9 5AF</p>
                <p>Tel: 0303 123 1113</p>
                <p>Website: www.ico.org.uk</p>
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This Privacy Statement was last updated on 12th September 2025. Please review regularly as we may update this document to reflect changes in our practices or applicable law.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
