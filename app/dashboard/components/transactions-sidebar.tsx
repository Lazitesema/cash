"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Search, Filter, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'send'
  amount: number
  status: 'pending' | 'completed' | 'rejected'
  date: string
  recipient?: string
  receiptUrl?: string
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'deposit', amount: 1000, status: 'completed', date: '2024-01-15', receiptUrl: '/mock-receipt.jpg' },
  { id: '2', type: 'withdrawal', amount: 500, status: 'pending', date: '2024-01-16' },
  { id: '3', type: 'send', amount: 200, status: 'completed', date: '2024-01-17', recipient: 'john@example.com' },
  // Add more mock transactions as needed
]

interface TransactionsSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function TransactionsSidebar({ isOpen, setIsOpen }: TransactionsSidebarProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null)

  useEffect(() => {
    let result = transactions

    if (searchTerm) {
      result = result.filter(transaction => 
        transaction.id.includes(searchTerm) ||
        transaction.amount.toString().includes(searchTerm) ||
        transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter && typeFilter !== 'all') {
      result = result.filter(transaction => transaction.type === typeFilter)
    }

    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(transaction => transaction.status === statusFilter)
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    setFilteredTransactions(result)
  }, [transactions, searchTerm, typeFilter, statusFilter, sortConfig])

  const handleSort = (key: keyof Transaction) => {
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ key, direction: 'desc' })
      } else {
        setSortConfig(null)
      }
    } else {
      setSortConfig({ key, direction: 'asc' })
    }
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l shadow-lg overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter || undefined} onValueChange={(value) => setTypeFilter(value || null)}>
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="send">Send</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter || undefined} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-grow overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                  Type
                  {sortConfig?.key === 'type' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                  Amount
                  {sortConfig?.key === 'amount' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                  Status
                  {sortConfig?.key === 'status' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                  Date
                  {sortConfig?.key === 'date' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.type}</TableCell>
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
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transaction Details</DialogTitle>
                          <DialogDescription>
                            Transaction ID: {transaction.id}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          <p><strong>Type:</strong> {transaction.type}</p>
                          <p><strong>Amount:</strong> ${transaction.amount.toFixed(2)}</p>
                          <p><strong>Status:</strong> {transaction.status}</p>
                          <p><strong>Date:</strong> {transaction.date}</p>
                          {transaction.recipient && <p><strong>Recipient:</strong> {transaction.recipient}</p>}
                          {transaction.receiptUrl && (
                            <div>
                              <strong>Receipt:</strong>
                              <img src={transaction.receiptUrl} alt="Receipt" className="mt-2 max-w-full h-auto" />
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  )
}

