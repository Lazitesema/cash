"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash, Users } from 'lucide-react'
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
  DialogTrigger,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

interface Bank {
  id: string
  name: string
  users: User[]
  dateAdded: string
}

interface User {
  id: string
  name: string
}

const initialBanks: Bank[] = [
  {
    id: "1",
    name: "Commercial Bank Of Ethiopia",
    users: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
    ],
    dateAdded: "2024-01-15",
  },
  {
    id: "2",
    name: "Awash Bank",
    users: [
      { id: "3", name: "Bob Johnson" },
    ],
    dateAdded: "2024-01-20",
  },
]

const initialUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com" },
]

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>(initialBanks)
  const [newBankName, setNewBankName] = useState("")
  const [editingBank, setEditingBank] = useState<Bank | null>(null)
  const [assigningBank, setAssigningBank] = useState<Bank | null>(null)
  const [users] = useState<User[]>(initialUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [assignAllUsers, setAssignAllUsers] = useState(false)
  const [assignedUsers, setAssignedUsers] = useState<Record<string, string[]>>({})

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBankName.trim()) return

    const newBank: Bank = {
      id: (banks.length + 1).toString(),
      name: newBankName,
      users: [],
      dateAdded: new Date().toISOString().split('T')[0],
    }

    setBanks([...banks, newBank])
    setNewBankName("")
    toast({
      title: "Bank Added",
      description: `${newBankName} has been added successfully.`,
    })
  }

  const handleEditBank = (bank: Bank) => {
    setEditingBank(bank)
    setNewBankName(bank.name)
  }

  const handleUpdateBank = () => {
    if (editingBank && newBankName.trim()) {
      const updatedBanks = banks.map(bank => 
        bank.id === editingBank.id ? { ...bank, name: newBankName } : bank
      )
      setBanks(updatedBanks)
      setEditingBank(null)
      setNewBankName("")
      toast({
        title: "Bank Updated",
        description: `Bank name has been updated successfully.`,
      })
    }
  }

  const handleDeleteBank = (id: string) => {
    const updatedBanks = banks.filter(bank => bank.id !== id)
    setBanks(updatedBanks)
    toast({
      title: "Bank Deleted",
      description: `The bank has been deleted successfully.`,
      variant: "destructive",
    })
  }

  const handleAssignUsers = () => {
    if (assigningBank) {
      const usersToAssign = assignAllUsers ? users.map(user => user.id) : selectedUsers
      setAssignedUsers(prev => ({
        ...prev,
        [assigningBank.id]: usersToAssign
      }))
      const updatedBanks = banks.map(bank => 
        bank.id === assigningBank.id 
          ? { ...bank, users: usersToAssign.map(userId => users.find(user => user.id === userId)!)} 
          : bank
      )
      setBanks(updatedBanks)
      setAssigningBank(null)
      setSelectedUsers([])
      setAssignAllUsers(false)
      toast({
        title: "Users Assigned",
        description: `Users have been assigned to ${assigningBank.name} successfully.`,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Banks Management"
          description="Add and manage banks in the system"
        />
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bank
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bank</DialogTitle>
              <DialogDescription>
                Add a new bank to the system. You can assign users to this bank later.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBank} className="space-y-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  placeholder="Enter bank name"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add Bank</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banks</CardTitle>
          <CardDescription>
            A list of all banks in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Users Assigned</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banks.map((bank) => (
                <TableRow key={bank.id}>
                  <TableCell>{bank.name}</TableCell>
                  <TableCell>
                    {bank.users.length} users
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" size="sm">View</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assigned Users - {bank.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          {bank.users.map(user => (
                            <div key={user.id} className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{user.name}</span>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{bank.dateAdded}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditBank(bank)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteBank(bank.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setAssigningBank(bank)}>
                        <Users className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingBank} onOpenChange={() => setEditingBank(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bank</DialogTitle>
            <DialogDescription>
              Update the bank name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editBankName">Bank Name</Label>
              <Input
                id="editBankName"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                placeholder="Enter bank name"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateBank}>Update Bank</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!assigningBank} onOpenChange={() => setAssigningBank(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Users to Bank</DialogTitle>
            <DialogDescription>
              Assign users to {assigningBank?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="assignAll"
                checked={assignAllUsers}
                onCheckedChange={(checked) => {
                  setAssignAllUsers(checked as boolean)
                  if (checked) {
                    setSelectedUsers(users.map(user => user.id))
                  } else {
                    setSelectedUsers([])
                  }
                }}
              />
              <Label htmlFor="assignAll">Assign all users</Label>
            </div>
            {!assignAllUsers && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {users.map(user => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.id])
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                        }
                      }}
                    />
                    <Label htmlFor={`user-${user.id}`}>
                      {user.name} ({user.email})
                      {assignedUsers[assigningBank?.id]?.includes(user.id) && (
                        <span className="ml-2 text-sm text-muted-foreground">(Already assigned)</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleAssignUsers}>Assign Users</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

