export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 px-4 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary">
      <div className="w-full max-w-md bg-bg-surface border border-gold-300/20 p-8 md:p-10 shadow-2xl">
        {children}
      </div>
    </div>
  )
}
