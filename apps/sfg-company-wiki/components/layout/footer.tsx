import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SFG Aluminium Limited. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/privacy" 
              className="hover:text-primary transition-colors"
            >
              Privacy Notice
            </Link>
            <span>•</span>
            <Link 
              href="/terms" 
              className="hover:text-primary transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
