"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface SendRequest {
  id: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  amount: number
  status: "pending" | "approved" | "rejected"
  date: string
}

const initialSendRequests: SendRequest[] = [
  // Your initial data here
]

export default function SendRequestsPage() {
  const [sendRequests, setSendRequests] = useState<SendRequest[]>(initialSendRequests)

  return (
    <div>
      {/* Render send requests */}
    </div>
  )
}

