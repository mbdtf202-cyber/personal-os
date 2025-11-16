import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ThemeInitializer } from '@/components/providers/theme-initializer'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ThemeInitializer />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,#fbd5ff,transparent_70%)] blur-3xl opacity-60" />
            <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,#c7f9ff,transparent_60%)] blur-3xl opacity-60" />
          </div>
          <div className="px-6 pt-6 md:px-8 md:pt-8">
            <Header />
          </div>
          <main className="relative flex-1 overflow-y-auto px-6 pb-8 pt-6 md:px-8">
            <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
