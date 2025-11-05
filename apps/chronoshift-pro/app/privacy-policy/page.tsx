
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | ChronoShift Pro',
  description: 'Privacy Policy for ChronoShift Pro - SFG Aluminium Ltd Payroll and Timesheet Management System',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-GB')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              SFG Aluminium Ltd ("we," "us," or "our") operates the ChronoShift Pro payroll and timesheet management system 
              (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our Service.
            </p>
            <p>
              We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Name, email address, and contact information</li>
              <li>Employee identification numbers and payroll information</li>
              <li>Timesheet data including work hours and location information</li>
              <li>Microsoft 365 account information (when integrated)</li>
              <li>Banking and payment information for payroll processing</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.2 Technical Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>IP addresses and device information</li>
              <li>Browser type and version</li>
              <li>Usage patterns and service interactions</li>
              <li>Location data (when location tracking is enabled)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6">
              <li>Process payroll and manage employee timesheets</li>
              <li>Provide authentication and access control</li>
              <li>Generate reports and analytics for business operations</li>
              <li>Ensure compliance with UK employment and tax regulations</li>
              <li>Improve our Service and develop new features</li>
              <li>Communicate with you about your account and service updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6">
              <li>With HMRC and other regulatory bodies as required by UK law</li>
              <li>With authorized payroll service providers and banking institutions</li>
              <li>With Microsoft 365 services for integration purposes (with your consent)</li>
              <li>With legal authorities when required by law or to protect our rights</li>
              <li>With service providers who assist in operating our Service (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Role-based access controls and authentication systems</li>
              <li>Secure cloud infrastructure with backup and recovery systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights Under GDPR</h2>
            <p>As a UK/EU resident, you have the following rights:</p>
            <ul className="list-disc pl-6">
              <li><strong>Right to Access:</strong> Request copies of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
              <li><strong>Right to Object:</strong> Object to certain types of data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
              including compliance with UK employment law requirements (typically 6 years for payroll records) and to resolve 
              disputes and enforce our agreements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
            <p>
              Our Service uses cookies and similar technologies to enhance user experience, maintain sessions, and analyze usage patterns. 
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p>
              Your data may be transferred to and stored in countries outside the UK/EU. We ensure appropriate safeguards are in place 
              for such transfers, including Standard Contractual Clauses and adequacy decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new 
              Privacy Policy on this page and updating the effective date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Data Protection Officer</h3>
              <p><strong>SFG Aluminium Ltd</strong></p>
              <p>39 Clayton Lane South</p>
              <p>Manchester, England, M12 5PG</p>
              <p>United Kingdom</p>
              <p className="mt-3">
                <strong>Email:</strong> <a href="mailto:Apps@sfg-innovations.com" className="text-primary hover:underline">Apps@sfg-innovations.com</a>
              </p>
              <p className="mt-3">
                For data deletion requests, please visit our <a href="/data-deletion" className="text-primary hover:underline">Data Deletion page</a> 
                or email us at the address above.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
