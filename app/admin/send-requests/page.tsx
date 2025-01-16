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
  {
    id: "1",
    senderId: "user1",
    senderName: "John Doe",
    recipientId: "user3",
    recipientName: "Alice Johnson",
    amount: 500,
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "2",
    senderId: "user2",
    senderName: "Jane Smith",
    recipientId: "user4",
    recipientName: "Bob Williams",
    amount: 750,
    status: "pending",
    date: "2024-01-16",
  },
]

export default function SendRequestsPage() {
  const [sendRequests, setSendRequests] = useState<SendRequest[]>(initialSendRequests)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = (id: string) => {
    const updatedRequests = sendRequests.map(req =>
      req.id === id ? { ...req, status: "approved" } : req
    )
    setSendRequests(updatedRequests)
    toast({
      title: "Send Request Approved",
      description: `Send request has been approved.`,
    })
  }

  const handleReject = (id: string) => {
    if (!rejectionReason) {
      toast({
        title: "Rejection Failed",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
      return
    }

    const updatedRequests = sendRequests.map(req =>
      req.id === id ? { ...req, status: "rejected" } : req
    )
    setSendRequests(updatedRequests)
    toast({
      title: "Send Request Rejected",
      description: `Send request has been rejected. Reason: ${rejectionReason}`,
      variant: "destructive",
    })
    setRejectionReason("")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8"
    >
      <PageHeader
        title="Send Requests"
        description="Manage and process money transfer requests"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pending Send Requests</CardTitle>
          <CardDescription>
            Review and process money transfer requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sendRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.senderName}</TableCell>
                  <TableCell>{request.recipientName}</TableCell>
                  <TableCell>${request.amount.toFixed(2)}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleApprove(request.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Send Request</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this send request.
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              placeholder="Reason for rejection"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <DialogFooter>
                              <Button onClick={() => handleReject(request.id)}>Reject Request</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Send Request Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <p><strong>Sender:</strong> {request.senderName}</p>
                              <p><strong>Recipient:</strong> {request.recipientName}</p>
                              <p><strong>Amount:</strong> ${request.amount.toFixed(2)}</p>
                              <p><strong>Date:</strong> {request.date}</p>
                              <p><strong>Status:</strong> {request.status}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}

