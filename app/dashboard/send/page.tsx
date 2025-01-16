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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface SendTransaction {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'rejected'
  date: string
  recipient: string
}

const initialTransactions: SendTransaction[] = [
  { id: '1', amount: 200, status: 'completed', date: '2024-01-15', recipient: 'john@example.com' },
  { id: '2', amount: 300, status: 'pending', date: '2024-01-16', recipient: 'jane@example.com' },
  { id: '3', amount: 150, status: 'rejected', date: '2024-01-17', recipient: 'bob@example.com' },
]

export default function SendMoneyPage() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [transactions, setTransactions] = useState<SendTransaction[]>(initialTransactions)
  const [balance, setBalance] = useState(10000) // Initial balance
  const [fee, setFee] = useState(0)
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  const calculateFee = (amount: number) => {
    // This is a placeholder calculation. Adjust as per your actual fee structure.
    return amount * 0.005 // 0.5% fee
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sendAmount = parseFloat(amount)
    if (sendAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this transaction.",
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
          <h1 className="text-3xl font-bold mb-8">Send Money</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient (Username or Email)</Label>
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>
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
                <Button type="submit">Send Money</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.recipient}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "completed"
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Money Transfer</DialogTitle>
                <DialogDescription>
                  Please confirm your transfer details:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Recipient: {recipient}</p>
                <p>Amount: ${parseFloat(amount).toFixed(2)}</p>
                <p>Fee: ${fee.toFixed(2)}</p>
                <p>Total Deduction: ${(parseFloat(amount) + fee).toFixed(2)}</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmationOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  // Process the money transfer here
                  const newTransaction: SendTransaction = {
                    id: (transactions.length + 1).toString(),
                    amount: parseFloat(amount),
                    status: 'pending',
                    date: new Date().toISOString().split('T')[0],
                    recipient,
                  }
                  setTransactions([newTransaction, ...transactions])
                  setBalance(balance - parseFloat(amount) - fee)
                  toast({
                    title: "Money Transfer Initiated",
                    description: `Your transfer of $${amount} to ${recipient} has been initiated and is pending approval.`,
                  })
                  setRecipient('')
                  setAmount('')
                  setFee(0)
                  setConfirmationOpen(false)
                }}>Confirm Transfer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </main>
    </div>
  )
}

