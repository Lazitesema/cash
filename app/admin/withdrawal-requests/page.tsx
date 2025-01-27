"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export default function WithdrawalRequestsPage() {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [approving, setApproving] = useState<WithdrawalRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchWithdrawals()
  }, [filterStatus, page])

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch(`/api/withdrawals?status=${filterStatus}&page=${page}`)
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      setWithdrawalRequests(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (approve: boolean, requestId?: string) => {
    const targetId = requestId || approving?.id
    if (!targetId) return
    
    setActionLoading(targetId)
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId: targetId,
          status: approve ? 'accepted' : 'rejected',
          adminNote: approve ? undefined : rejectionReason
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setWithdrawalRequests(prev => 
        prev.filter(req => req.id !== targetId)
      )

      toast({
        title: approve ? "Withdrawal Approved" : "Withdrawal Rejected",
        description: `Withdrawal request ${approve ? 'approved' : 'rejected'} successfully`
      })

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
      setApproving(null)
      setShowRejectionDialog(false)
      setRejectionReason("")
    }
  }

  const ViewRequestDialog = ({ request }: { request: WithdrawalRequest }) => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Withdrawal Request Details</DialogTitle>
        <DialogDescription>
          Review the withdrawal request information
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">User Name:</p>
            <p>{request.userName}</p>
          </div>
          <div>
            <p className="font-medium">Amount:</p>
            <p>${request.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Bank:</p>
            <p>{request.bankName}</p>
          </div>
          <div>
            <p className="font-medium">Account:</p>
            <p>{request.accountNumber}</p>
          </div>
          <div>
            <p className="font-medium">Status:</p>
            <Badge variant={
              request.status === "approved" ? "default" :
              request.status === "pending" ? "secondary" : "destructive"
            }>
              {request.status}
            </Badge>
          </div>
          <div>
            <p className="font-medium">Date:</p>
            <p>{new Date(request.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setApproving(null)}>
          Close
        </Button>
        {request.status === "pending" && (
          <>
            <Button 
              variant="default"
              onClick={() => handleApproval(true, request.id)}
              disabled={actionLoading === request.id}
            >
              {actionLoading === request.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                setApproving(request)
                setShowRejectionDialog(true)
              }}
              disabled={actionLoading === request.id}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  )

  const filteredRequests = withdrawalRequests.filter(request => 
    request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.accountNumber.includes(searchQuery)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div 
      className="p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Search</Label>
            <Input
              placeholder="Search by user, bank or account"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Filter by Status</Label>
            <Select value={filterStatus} onValueChange={(value: typeof filterStatus) => {
              setFilterStatus(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-medium">No withdrawal requests found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search query"
                  : filterStatus !== "all" 
                    ? `No ${filterStatus} requests available`
                    : "No withdrawal requests available at the moment"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.userName}</TableCell>
                    <TableCell>${request.amount.toFixed(2)}</TableCell>
                    <TableCell>{request.bankName}</TableCell>
                    <TableCell>{request.accountNumber}</TableCell>
                    <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === "approved" ? "default" :
                        request.status === "pending" ? "secondary" : "destructive"
                      }>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setApproving(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproval(true, request.id)}
                            disabled={actionLoading === request.id}
                          >
                            {actionLoading === request.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setApproving(request)
                              setShowRejectionDialog(true)
                            }}
                            disabled={actionLoading === request.id}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between px-2 mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredRequests.length} results
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Page</span>
              <span className="font-medium">{page}</span>
              <span className="text-sm text-muted-foreground">of</span>
              <span className="font-medium">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!approving && !showRejectionDialog} onOpenChange={(open) => !open && setApproving(null)}>
        {approving && <ViewRequestDialog request={approving} />}
      </Dialog>

      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this withdrawal request.
              This will be visible to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            {approving && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="font-medium mb-2">Request Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">User:</span>
                    <p>{approving.userName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p>${approving.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bank:</span>
                    <p>{approving.bankName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p>{new Date(approving.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectionDialog(false)
                setRejectionReason("")
              }}
              disabled={actionLoading === approving?.id}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleApproval(false)}
              disabled={!rejectionReason.trim() || actionLoading === approving?.id}
            >
              {actionLoading === approving?.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

