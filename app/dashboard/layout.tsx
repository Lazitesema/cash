"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { UserSidebar } from "./components/user-sidebar"
import { TransactionsSidebar } from "./components/transactions-sidebar"
import { ChatSupport } from "./components/chat-support"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isTransactionsSidebarOpen, setIsTransactionsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('userAuthenticated') === 'true'
      setIsAuthenticated(isAuth)
      if (!isAuth && pathname !== '/signin') {
        router.push('/signin')
      }
    }

    checkAuth()
  }, [pathname, router])

  if (!isAuthenticated) {
    return null // or a loading spinner
  }

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      <main className={cn(
        "flex-1 overflow-auto p-8",
        isTransactionsSidebarOpen && "mr-80"
      )}>
        {children}
      </main>
      <TransactionsSidebar 
        isOpen={isTransactionsSidebarOpen} 
        setIsOpen={setIsTransactionsSidebarOpen}
      />
      <ChatSupport />
      <Toaster />
    </div>
  )
}

