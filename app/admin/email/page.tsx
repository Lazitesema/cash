"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from 'lucide-react'
import { PageHeader } from "../components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
}

const users: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  // Add more users as needed
]

export default function EmailPage() {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleRecipientChange = (userId: string) => {
    setSelectedRecipients(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically integrate with your email sending service
    console.log(`Sending email to ${selectedRecipients.length === 0 ? "all users" : selectedRecipients.join(', ')}`)
    console.log(`Subject: ${subject}`)
    console.log(`Message: ${message}`)

    toast({
      title: "Email Sent",
      description: `Your email has been sent successfully.`,
    })

    // Reset form
    setSelectedRecipients([])
    setSubject("")
    setMessage("")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8"
    >
      <PageHeader
        title="Email Management"
        description="Send custom emails to users"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Compose Email</CardTitle>
          <CardDescription>
            Create and send professional emails to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <Label>Recipients</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="all-users"
                    checked={selectedRecipients.length === users.length}
                    onCheckedChange={(checked) => {
                      setSelectedRecipients(checked ? users.map(user => user.id) : [])
                    }}
                  />
                  <Label htmlFor="all-users">All Users</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedRecipients.includes(user.id)}
                        onCheckedChange={() => handleRecipientChange(user.id)}
                      />
                      <Label htmlFor={`user-${user.id}`}>{user.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                rows={6}
              />
            </div>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

