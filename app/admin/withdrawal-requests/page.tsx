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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface WithdrawalRequest {
  id: string
  userId: string
  userName: string
  amount: number
  status: "pending" | "approved" | "rejected"
  date: string
  bankName: string
  accountNumber: string
}

const initialWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    amount: 500,
    status: "pending",
    date: "2024-01-15",
    bankName: "ABC Bank",
    accountNumber: "1234567890",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    amount: 1000,
    status: "pending",
    date: "2024-01-16",
    bankName: "XYZ Bank",
    accountNumber: "0987654321",
  },
]

export default function WithdrawalRequestsPage() {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(initialWithdrawalRequests)
  const [approving, setApproving] = useState<WithdrawalRequest | null>(null)
  const [transactionRef, setTransactionRef] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = (id: string) => {
    const updatedRequests = withdrawalRequests.map(req =>
      req.id === id ? { ...req, status: "approved" } : req
    )
    setWithdrawalRequests(updatedRequests)
    toast({
      title: "Withdrawal Approved",
      description: `Withdrawal request has been approved.`,
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

    const updatedRequests = withdrawalRequests.map(req =>
      req.id === id ? { ...req, status: "rejected" } : req
    )
    setWithdrawalRequests(updatedRequests)
    toast({
      title: "Withdrawal Rejected",
      description: `Withdrawal request has been rejected. Reason: ${rejectionReason}`,
      variant: "destructive",
    })
    setRejectionReason("")
  }

  const confirmApproval = () => {
    // Add your approval logic here
    setApproving(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8"
    >
      <PageHeader
        title="Withdrawal Requests"
        description="Manage and process withdrawal requests"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pending Withdrawal Requests</CardTitle>
          <CardDescription>
            Review and process withdrawal requests from users
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
              {withdrawalRequests.map((request) => (
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
                              <DialogTitle>Reject Withdrawal Request</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this withdrawal request.
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
                              <DialogTitle>Withdrawal Request Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <p><strong>User:</strong> {request.userName}</p>
                              <p><strong>Amount:</strong> ${request.amount.toFixed(2)}</p>
                              <p><strong>Date:</strong> {request.date}</p>
                              <p><strong>Status:</strong> {request.status}</p>
                              <p><strong>Bank Name:</strong> {request.bankName}</p>
                              <p><strong>Account Number:</strong> {request.accountNumber}</p>
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

      <Dialog open={!!approving} onOpenChange={() => setApproving(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Withdrawal</DialogTitle>
            <DialogDescription>
              Enter the transaction reference number to approve this withdrawal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transactionRef">Transaction Reference</Label>
              <Input
                id="transactionRef"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Enter transaction reference"
              />
            </div>
            <DialogFooter>
              <Button onClick={confirmApproval}>Confirm Approval</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

