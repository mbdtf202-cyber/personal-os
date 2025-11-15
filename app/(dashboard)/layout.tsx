import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="px-6 pt-6 md:px-10 md:pt-10">
          <Header user={user} />
        </div>
        <main className="flex-1 overflow-y-auto px-6 pb-10 pt-6 md:px-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-[2.5rem] border border-white/50 bg-white/60 p-8 shadow-[0_40px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
