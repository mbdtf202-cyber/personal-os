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
        <div className="px-6 pt-6 md:px-8 md:pt-8">
          <Header />
        </div>
        <main className="relative flex-1 overflow-y-auto px-6 pb-8 pt-6 md:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      </div>
    </>
  )
}
