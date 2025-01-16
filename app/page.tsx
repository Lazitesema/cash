import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <nav className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold">Cashora</h1>
        <div className="space-x-4">
          <Button variant="outline" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </nav>
      
      <main className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-5xl font-bold mb-6">Welcome to the Future of Finance</h2>
        <p className="text-xl mb-12 text-gray-600 dark:text-gray-400">
          Manage your accounts, transactions, and finances with ease and security.
        </p>
        <Button size="lg" asChild>
          <Link href="/signup">Get Started Now</Link>
        </Button>
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 py-6 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 Cashora. All rights reserved.</p>
      </footer>
    </div>
  )
}

