
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | ChronoShift Pro',
  description: 'Terms of Service for ChronoShift Pro - SFG Aluminium Ltd Payroll and Timesheet Management System',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-GB')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ChronoShift Pro ("the Service"), provided by SFG Aluminium Ltd ("Company," "we," "us," or "our"), 
              you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p>
              If you do not agree to abide by the above, please do not use this Service. These Terms of Service are effective as of the date shown above.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              ChronoShift Pro is a comprehensive payroll and timesheet management system designed for SFG Aluminium Ltd employees. 
              The Service provides:
            </p>
            <ul className="list-disc pl-6">
              <li>Timesheet recording and management with location tracking</li>
              <li>Payroll processing and payslip generation</li>
              <li>Expense management and reimbursement tracking</li>
              <li>Supervisor approval workflows</li>
              <li>Microsoft 365 integration for Teams and SharePoint</li>
              <li>Mobile Progressive Web App (PWA) functionality</li>
              <li>Offline synchronization capabilities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Eligibility and Access</h2>
            <p>
              The Service is exclusively available to authorized employees, supervisors, and administrators of SFG Aluminium Ltd. 
              By using the Service, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6">
              <li>You are an authorized employee or contractor of SFG Aluminium Ltd</li>
              <li>You are at least 16 years of age (minimum working age in the UK)</li>
              <li>You will provide accurate and complete information</li>
              <li>You will maintain the confidentiality of your account credentials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            
            <h3 className="text-xl font-medium mb-3">4.1 Account Security</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>You are responsible for maintaining the confidentiality of your login credentials</li>
              <li>You must immediately notify us of any unauthorized access to your account</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">4.2 Data Accuracy</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>You must provide accurate timesheet and personal information</li>
              <li>You must promptly update any changes to your personal details</li>
              <li>You are responsible for the accuracy of submitted timesheets and expense claims</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">4.3 Acceptable Use</h3>
            <ul className="list-disc pl-6">
              <li>Use the Service only for legitimate business purposes</li>
              <li>Do not attempt to access unauthorized areas of the system</li>
              <li>Do not share your account with unauthorized individuals</li>
              <li>Comply with all applicable UK employment laws and company policies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
              which forms part of these Terms of Service. By using the Service, you consent to the collection and use of your 
              information as outlined in our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Service Availability</h2>
            <p>
              We strive to maintain high availability of the Service, but we do not guarantee uninterrupted access. The Service may be:
            </p>
            <ul className="list-disc pl-6">
              <li>Temporarily unavailable due to maintenance or technical issues</li>
              <li>Subject to modification or improvement without prior notice</li>
              <li>Discontinued in part or in whole at our discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>
              The Service, including its content, features, and functionality, is owned by SFG Aluminium Ltd and is protected by 
              international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <ul className="list-disc pl-6">
              <li>You may not reproduce, distribute, or create derivative works without permission</li>
              <li>You retain ownership of data you input into the system</li>
              <li>We grant you a limited license to use the Service for its intended purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, SFG Aluminium Ltd shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc pl-6">
              <li>Loss of profits or revenue</li>
              <li>Loss of data or information</li>
              <li>Business interruption</li>
              <li>Personal injury or property damage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless SFG Aluminium Ltd from and against any claims, liabilities, 
              damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of 
              these Terms of Service or your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p>
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, 
              including but not limited to:
            </p>
            <ul className="list-disc pl-6">
              <li>Breach of these Terms of Service</li>
              <li>End of employment with SFG Aluminium Ltd</li>
              <li>Request by you to delete your account</li>
              <li>Discontinuation of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of England and Wales. 
              Any disputes arising from these terms or your use of the Service shall be subject to the exclusive jurisdiction 
              of the courts of England and Wales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, 
              we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <div className="bg-muted p-6 rounded-lg">
              <p><strong>SFG Aluminium Ltd</strong></p>
              <p>39 Clayton Lane South</p>
              <p>Manchester, England, M12 5PG</p>
              <p>United Kingdom</p>
              <p className="mt-3">
                <strong>Email:</strong> <a href="mailto:Apps@sfg-innovations.com" className="text-primary hover:underline">Apps@sfg-innovations.com</a>
              </p>
              <p className="mt-3">
                For questions about these Terms of Service or to request account deletion, please contact us using the information above.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Entire Agreement</h2>
            <p>
              These Terms of Service, together with our Privacy Policy, constitute the sole and entire agreement between you and 
              SFG Aluminium Ltd regarding the Service and supersede all prior and contemporaneous understandings, agreements, 
              representations, and warranties.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
