"use client"

import { useState, useEffect } from 'react'
import { FileText, Search, Filter, ArrowUpDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  user: string
  recipient?: string
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'deposit', amount: 1000, status: 'completed', date: '2024-01-15', user: 'John Doe' },
  { id: '2', type: 'withdrawal', amount: 500, status: 'pending', date: '2024-01-16', user: 'Jane Smith' },
  { id: '3', type: 'send', amount: 200, status: 'completed', date: '2024-01-17', user: 'Alice Johnson', recipient: 'Bob Williams' },
  // Add more mock transactions as needed
]

export function TransactionsList() {
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
        transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.includes(searchTerm) ||
        transaction.amount.toString().includes(searchTerm) ||
        transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter) {
      result = result.filter(transaction => transaction.type === typeFilter)
    }

    if (statusFilter) {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex space-x-2">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={typeFilter || undefined} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All types</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="send">Send</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter || undefined} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
              Type {sortConfig?.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
              Amount {sortConfig?.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
              Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
              Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
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
              <TableCell>{transaction.user}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Transaction Details</DialogTitle>
                      <DialogDescription>
                        Transaction ID: {transaction.id}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Type:</span>
                        <span className="col-span-3">{transaction.type}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Amount:</span>
                        <span className="col-span-3">${transaction.amount.toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Status:</span>
                        <span className="col-span-3">{transaction.status}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Date:</span>
                        <span className="col-span-3">{transaction.date}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">User:</span>
                        <span className="col-span-3">{transaction.user}</span>
                      </div>
                      {transaction.recipient && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-bold">Recipient:</span>
                          <span className="col-span-3">{transaction.recipient}</span>
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
  )
}

