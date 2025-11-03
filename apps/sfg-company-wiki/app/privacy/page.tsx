
import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Notice - SFG Aluminium Wiki",
  description: "Privacy Notice and Data Protection policy for SFG Aluminium Wiki App",
}

export default function PrivacyPage() {
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
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Privacy Notice — SFG Aluminium Wiki App
            </h1>
          </div>
          <p className="text-muted-foreground">
            Data controller: <strong>SFG Aluminium Limited</strong>. App owner / contact:{" "}
            <a
              href="mailto:warren@sfg-aluminium.co.uk"
              className="text-primary hover:underline"
            >
              Warren Heathcote (warren@sfg-aluminium.co.uk)
            </a>
            .
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-card border border-border rounded-lg p-6 sm:p-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              What we process
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li>
                <strong className="text-foreground">User identity:</strong> name, work email,
                M365 group membership.
              </li>
              <li>
                <strong className="text-foreground">Uploaded documents:</strong> HR, payroll,
                legal, training, supplier guides (content stored in SharePoint).
              </li>
              <li>
                <strong className="text-foreground">Audit logs:</strong> uploads, edits,
                approvals, snapshots, retention override logs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Purpose & legal basis
            </h2>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Purpose:</strong> deliver an auditable,
              no-drift policy & wiki platform for SFG Aluminium (lawful basis: legitimate
              interest for business management; processing of employment-related data where
              necessary under contract and legal obligations).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Retention
            </h2>
            <p className="text-muted-foreground">
              Default retention: <strong className="text-foreground">3 years</strong> from last
              review. Retention overrides must be logged with reason and approver. Snapshots
              for compliance are retained in the Compliance library per policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Data subject rights
            </h2>
            <p className="text-muted-foreground">
              You may request access, rectification, or erasure where applicable. Contact:{" "}
              <a
                href="mailto:yanika@sfg-aluminium.co.uk"
                className="text-primary hover:underline"
              >
                yanika@sfg-aluminium.co.uk
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Security
            </h2>
            <p className="text-muted-foreground">
              All secrets stored in Azure Key Vault; RBAC enforced via Entra and M365 groups;
              Admin role requires MFA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              International transfer
            </h2>
            <p className="text-muted-foreground">
              Data remains within UK/EU tenant controls; any cross-border transfers use
              standard contractual clauses where required.
            </p>
          </section>

          <hr className="border-border" />

          <p className="text-sm text-muted-foreground">
            Last updated: <strong className="text-foreground">October 2025</strong>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Use
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
