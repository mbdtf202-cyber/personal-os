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
        <div className="px-6 pt-6 md:px-10 md:pt-10">
          <Header />
        </div>
        <main className="relative flex-1 overflow-y-auto px-6 pb-10 pt-6 md:px-10">
          <div className="relative z-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-[2.5rem] theme-border theme-bg-secondary p-8 theme-shadow-lg backdrop-blur-2xl" style={{ borderWidth: '1px' }}>
              {children}
            </div>
          </div>
        </main>
      </div>
      </div>
    </>
  )
}
