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
      <div className="flex h-screen overflow-hidden theme-bg-primary">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="px-4 pt-4 md:px-6 md:pt-6">
          <Header />
        </div>
        <main className="relative flex-1 overflow-y-auto px-4 pb-6 pt-4 md:px-6">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      </div>
    </>
  )
}
