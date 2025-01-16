"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface WithdrawTransaction {
  id: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected'
  date: string
  bankName: string
  accountNumber: string
}

interface Bank {
  id: string
  name: string
  accountNumber: string
}

// This would typically come from your API/backend
const userAssignedBanks: Bank[] = [
  { id: '1', name: 'Commercial Bank Of Ethiopia', accountNumber: '1234567890' },
  { id: '2', name: 'Awash Bank', accountNumber: '0987654321' },
]

const initialTransactions: WithdrawTransaction[] = [
  { id: '1', amount: 500, status: 'accepted', date: '2024-01-15', bankName: 'Commercial Bank Of Ethiopia', accountNumber: '1234567890' },
  { id: '2', amount: 750, status: 'pending', date: '2024-01-16', bankName: 'Awash Bank', accountNumber: '0987654321' },
]

export default function WithdrawPage() {
  const [amount, setAmount] = useState('')
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [transactions, setTransactions] = useState<WithdrawTransaction[]>(initialTransactions)
  const [accountNumber, setAccountNumber] = useState('')
  const [fee, setFee] = useState(0)
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  const calculateFee = (amount: number) => {
    // This is a placeholder calculation. Adjust as per your actual fee structure.
    return amount * 0.01 // 1% fee
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedBankDetails = userAssignedBanks.find(bank => bank.id === selectedBank)
    
    if (!selectedBankDetails) {
      toast({
        title: "Error",
        description: "Please select a bank",
        variant: "destructive",
      })
      return
    }

    // Show confirmation dialog
    setConfirmationOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 overflow-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Withdraw</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Make a Withdrawal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value
                      setAmount(value)
                      setFee(calculateFee(parseFloat(value)))
                    }}
                    required
                  />
                  {fee > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">Fee: ${fee.toFixed(2)}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bank">Select Bank</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {userAssignedBanks.map(bank => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">Submit Withdrawal Request</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Account Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "accepted"
                              ? "success"
                              : transaction.status === "pending"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.bankName}</TableCell>
                      <TableCell>{transaction.accountNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Withdrawal</DialogTitle>
                <DialogDescription>
                  Please confirm your withdrawal details:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Amount: ${parseFloat(amount).toFixed(2)}</p>
                <p>Fee: ${fee.toFixed(2)}</p>
                <p>Total Deduction: ${(parseFloat(amount) + fee).toFixed(2)}</p>
                <p>Bank: {userAssignedBanks.find(bank => bank.id === selectedBank)?.name}</p>
                <p>Account Number: {accountNumber}</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmationOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  // Process the withdrawal here
                  const newTransaction: WithdrawTransaction = {
                    id: (transactions.length + 1).toString(),
                    amount: parseFloat(amount),
                    status: 'pending',
                    date: new Date().toISOString().split('T')[0],
                    bankName: userAssignedBanks.find(bank => bank.id === selectedBank)?.name || '',
                    accountNumber: accountNumber,
                  }
                  setTransactions([newTransaction, ...transactions])
                  toast({
                    title: "Withdrawal Request Submitted",
                    description: `Your withdrawal request for $${amount} has been submitted and is pending approval.`,
                  })
                  setAmount('')
                  setSelectedBank('')
                  setAccountNumber('')
                  setFee(0)
                  setConfirmationOpen(false)
                }}>Confirm Withdrawal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </main>
    </div>
  )
}

