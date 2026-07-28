import { AdminSidebar } from '@/features/admin/components/AdminSidebar'

export const metadata = {
  title: 'Admin Concierge | Maison Noir',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-bg-primary text-white-100 font-inter">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
