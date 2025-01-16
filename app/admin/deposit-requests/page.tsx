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
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = (id: string) => {
    const updatedRequests = depositRequests.map(req =>
      req.id === id ? { ...req, status: "approved" } : req
    )
    setDepositRequests(updatedRequests)
    toast({
      title: "Deposit Approved",
      description: `Deposit request has been approved.`,
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

    const updatedRequests = depositRequests.map(req =>
      req.id === id ? { ...req, status: "rejected" } : req
    )
    setDepositRequests(updatedRequests)
    toast({
      title: "Deposit Rejected",
      description: `Deposit request has been rejected. Reason: ${rejectionReason}`,
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
        title="Deposit Requests"
        description="Manage and process deposit requests"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pending Deposit Requests</CardTitle>
          <CardDescription>
            Review and process deposit requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depositRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.userName}</TableCell>
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
                              <DialogTitle>Reject Deposit Request</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this deposit request.
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
                              <DialogTitle>Deposit Request Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <p><strong>User:</strong> {request.userName}</p>
                              <p><strong>Amount:</strong> ${request.amount.toFixed(2)}</p>
                              <p><strong>Date:</strong> {request.date}</p>
                              <p><strong>Status:</strong> {request.status}</p>
                              <div>
                                <strong>Receipt:</strong>
                                <img src={request.receiptUrl} alt="Deposit Receipt" className="mt-2 max-w-full h-auto" />
                              </div>
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

