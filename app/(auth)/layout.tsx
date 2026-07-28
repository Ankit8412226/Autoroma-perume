export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-bg-primary">
      <div className="w-full max-w-lg bg-black border border-white-500/20 p-6 sm:p-10 shadow-2xl rounded-sm">
        {children}
      </div>
    </div>
  )
}
