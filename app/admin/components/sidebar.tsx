"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Building2, Users, ArrowUpDown, Download, Send, Mail, Settings, User, LogOut, FileText, Search } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from '@/components/theme-toggle'

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: '/admin',
    count: null
  },
  {
    icon: FileText,
    label: 'Transactions',
    href: '/admin/transactions',
    count: null
  },
  { 
    icon: Building2, 
    label: 'Banks', 
    href: '/admin/banks',
    count: null
  },
  { 
    icon: Users, 
    label: 'Users Management', 
    href: '/admin/users',
    count: null
  },
  { 
    icon: ArrowUpDown, 
    label: 'Withdrawal Requests', 
    href: '/admin/withdrawal-requests',
    count: 4
  },
  { 
    icon: Download, 
    label: 'Deposit Requests', 
    href: '/admin/deposit-requests',
    count: 2
  },
  { 
    icon: Send, 
    label: 'Sending Requests', 
    href: '/admin/send-requests',
    count: 3
  },
  { 
    icon: Mail, 
    label: 'Email', 
    href: '/admin/email',
    count: null
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    href: '/admin/settings',
    count: null
  },
  { 
    icon: User, 
    label: 'Profile', 
    href: '/admin/profile',
    count: null
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    router.push('/admin/signin')
  }

  return (
    <div className="w-64 h-screen bg-background border-r flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Admin User</h3>
            <p className="text-sm text-muted-foreground">Administrator</p>
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
        <div className="flex items-center justify-between mb-4">
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
}

