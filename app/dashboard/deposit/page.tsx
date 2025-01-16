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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface DepositTransaction {
  id: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected'
  date: string
  receiptUrl?: string
}

const initialTransactions: DepositTransaction[] = [
  { id: '1', amount: 1000, status: 'accepted', date: '2024-01-15', receiptUrl: '/mock-receipt.jpg' },
  { id: '2', amount: 500, status: 'pending', date: '2024-01-16' },
  { id: '3', amount: 750, status: 'rejected', date: '2024-01-17' },
]

export default function DepositPage() {
  const [fullName, setFullName] = useState('')
  const [amount, setAmount] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [transactions, setTransactions] = useState<DepositTransaction[]>(initialTransactions)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the deposit request to your backend
    const newTransaction: DepositTransaction = {
      id: (transactions.length + 1).toString(),
      amount: parseFloat(amount),
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      receiptUrl: receipt ? URL.createObjectURL(receipt) : undefined,
    }
    setTransactions([newTransaction, ...transactions])
    toast({
      title: "Deposit Request Submitted",
      description: `Your deposit request for $${amount} has been submitted and is pending approval.`,
    })
    setFullName('')
    setAmount('')
    setReceipt(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 overflow-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Deposit</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Make a Deposit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="receipt">Receipt Upload</Label>
                  <Input
                    id="receipt"
                    type="file"
                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                    required
                  />
                </div>
                <Button type="submit">Submit Deposit Request</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deposit Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Receipt</TableHead>
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
                      <TableCell>
                        {transaction.receiptUrl ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">View Receipt</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Deposit Receipt</DialogTitle>
                                <DialogDescription>
                                  Receipt for deposit on {transaction.date}
                                </DialogDescription>
                              </DialogHeader>
                              <img src={transaction.receiptUrl} alt="Deposit Receipt" className="max-w-full h-auto" />
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "No receipt"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

