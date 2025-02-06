import NavbarResponsable from '@/components/NavbarResponsable'

export default function ResponsableTourLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <NavbarResponsable />
      <main className="flex-1 overflow-y-auto p-2">
        {children}
      </main>
    </div>
  )
}