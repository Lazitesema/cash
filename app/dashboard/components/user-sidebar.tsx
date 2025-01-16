"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Download, Send, ArrowUpDown, User, Search, Menu, X, LogOut } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/navigation'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', count: null },
  { icon: Download, label: 'Deposit', href: '/dashboard/deposit', count: null },
  { icon: ArrowUpDown, label: 'Withdraw', href: '/dashboard/withdraw', count: 2 },
  { icon: Send, label: 'Send Money', href: '/dashboard/send', count: null },
  { icon: User, label: 'Profile', href: '/dashboard/profile', count: null },
]

export function UserSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('userAuthenticated')
    router.push('/signin')
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-sm text-muted-foreground">$10,000.00</p>
          </div>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 bg-muted/50" />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.div
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg transition-colors relative",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    "group"
                  )}
                  initial={false}
                  animate={{
                    backgroundColor: isActive 
                      ? 'hsl(var(--primary))' 
                      : hoveredItem === item.href 
                        ? 'hsl(var(--muted))' 
                        : 'transparent',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      isActive 
                        ? "bg-primary-foreground/20 text-primary-foreground" 
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {item.count}
                    </span>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              "fixed left-0 top-0 bottom-0 z-40 w-64 border-r shadow-lg",
              isMobile ? "absolute" : "relative"
            )}
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

