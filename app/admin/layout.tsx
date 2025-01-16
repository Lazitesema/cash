"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from './components/sidebar'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AdminHeader } from './components/admin-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('adminAuthenticated') === 'true'
      setIsAuthenticated(isAuth)
      if (!isAuth && pathname !== '/admin/signin') {
        router.push('/admin/signin')
      }
    }

    checkAuth()
  }, [pathname, router])

  if (!isAuthenticated && pathname !== '/admin/signin') {
    return null // or a loading spinner
  }

  if (pathname === '/admin/signin') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

