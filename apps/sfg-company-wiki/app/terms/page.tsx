
import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Use - SFG Aluminium Wiki",
  description: "Terms of Use and Acceptable Use Policy for SFG Aluminium Wiki App",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              SFG Aluminium — Wiki App Terms of Use
            </h1>
          </div>
          <p className="text-muted-foreground">
            Operator: <strong>SFG Aluminium Limited</strong>. App owner contact:{" "}
            <a
              href="mailto:warren@sfg-aluminium.co.uk"
              className="text-primary hover:underline"
            >
              warren@sfg-aluminium.co.uk
            </a>
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-card border border-border rounded-lg p-6 sm:p-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Acceptable use
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li>
                Users must not upload personal or sensitive personal data unless authorised by
                HR.
              </li>
              <li>
                Editors must follow the change request and approval workflow. Unapproved
                changes are not valid for compliance or audits.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Change requests & approvals
            </h2>
            <p className="text-muted-foreground">
              Every edit must be saved as a draft and, where the page is marked canonical,
              submitted for approval. An approval snapshot PDF will be stored automatically in
              the Compliance library.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Retention override & deletions
            </h2>
            <p className="text-muted-foreground">
              Manual deletion or retention override requires Approver role approval and must
              include a reason logged in the retention override log.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Enforcement
            </h2>
            <p className="text-muted-foreground">
              Violations may result in access removal and HR action. Contact for disputes:{" "}
              <a
                href="mailto:yanika@sfg-aluminium.co.uk"
                className="text-primary hover:underline"
              >
                yanika@sfg-aluminium.co.uk
              </a>
              .
            </p>
          </section>

          <hr className="border-border" />

          <p className="text-sm text-muted-foreground">
            Last updated: <strong className="text-foreground">October 2025</strong>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Notice
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-primary transition-colors">
            Back to Wiki
          </Link>
        </div>
      </div>
    </div>
  )
}
