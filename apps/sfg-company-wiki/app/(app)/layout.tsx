

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"
import { AnimatedBackground } from "@/components/ui/animated-background"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <AnimatedBackground />
      <div className="relative z-10 flex-1 flex flex-col">
        <Header />
        <div className="flex flex-1 h-[calc(100vh-7rem)]">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto max-w-7xl p-6">
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
