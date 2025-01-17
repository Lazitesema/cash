"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, Eye } from 'lucide-react'
import { PageHeader } from "../components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface DepositRequest {
  id: string
  userId: string
  userName: string
  amount: number
  status: "pending" | "approved" | "rejected"
  date: string
  receiptUrl: string
}

const initialDepositRequests: DepositRequest[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    amount: 1000,
    status: "pending",
    date: "2024-01-15",
    receiptUrl: "/mock-receipt.jpg",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    amount: 1500,
    status: "pending",
    date: "2024-01-16",
    receiptUrl: "/mock-receipt-2.jpg",
  },
]

export default function DepositRequestsPage() {
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>(initialDepositRequests)

  return (
    <div>
      {/* Render deposit requests */}
    </div>
  )
}

