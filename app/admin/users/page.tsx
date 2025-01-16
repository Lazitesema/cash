"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash, Check, X, DollarSign, Percent, Eye } from 'lucide-react'
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
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  dateOfBirth: string
  placeOfBirth: string
  residence: string
  nationality: string
  idCard: string
  role: "admin" | "user"
  status: "pending" | "approved" | "rejected"
  balance: number
  withdrawalLimit: {
    weekly: number | null
    monthly: number | null
    yearly: number | null
  }
  sendingLimit: {
    weekly: number | null
    monthly: number | null
    yearly: number | null
  }
  feeType: "percentage" | "fixed"
  feeAmount: number
}

const initialUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    dateOfBirth: "1990-01-01",
    placeOfBirth: "New York",
    residence: "Los Angeles",
    nationality: "USA",
    idCard: "ID12345",
    role: "user",
    status: "approved",
    balance: 1000,
    withdrawalLimit: {
      weekly: 500,
      monthly: 2000,
      yearly: 20000
    },
    sendingLimit: {
      weekly: 1000,
      monthly: 4000,
      yearly: 40000
    },
    feeType: "percentage",
    feeAmount: 2,
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    email: "jane@example.com",
    dateOfBirth: "1992-05-15",
    placeOfBirth: "London",
    residence: "Manchester",
    nationality: "UK",
    idCard: "ID67890",
    role: "user",
    status: "pending",
    balance: 0,
    withdrawalLimit: {
      weekly: null,
      monthly: null,
      yearly: null
    },
    sendingLimit: {
      weekly: null,
      monthly: null,
      yearly: null
    },
    feeType: "fixed",
    feeAmount: 5,
  },
]

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [newUser, setNewUser] = useState<Partial<User>>({})
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const filteredUsers = users.filter(user => 
    filterStatus === "all" ? true : user.status === filterStatus
  )

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.firstName || !newUser.lastName || !newUser.email) return

    const user: User = {
      id: (users.length + 1).toString(),
      ...newUser,
      role: newUser.role || "user",
      status: "pending",
      balance: 0,
      withdrawalLimit: {
        weekly: null,
        monthly: null,
        yearly: null
      },
      sendingLimit: {
        weekly: null,
        monthly: null,
        yearly: null
      },
      feeType: "percentage",
      feeAmount: 0,
    } as User

    setUsers([...users, user])
    setNewUser({})
    toast({
      title: "User Added",
      description: `${user.firstName} ${user.lastName} has been added successfully.`,
    })
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewUser(user)
  }

  const handleUpdateUser = () => {
    if (editingUser && newUser.firstName && newUser.lastName && newUser.email) {
      const updatedUsers = users.map(user => 
        user.id === editingUser.id ? { ...user, ...newUser } : user
      )
      setUsers(updatedUsers)
      setEditingUser(null)
      setNewUser({})
      toast({
        title: "User Updated",
        description: `User information has been updated successfully.`,
      })
    }
  }

  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id)
    setUsers(updatedUsers)
    toast({
      title: "User Deleted",
      description: `The user has been deleted successfully.`,
      variant: "destructive",
    })
  }

  const handleApproveUser = (id: string) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, status: "approved" } : user
    )
    setUsers(updatedUsers)
    toast({
      title: "User Approved",
      description: `The user has been approved successfully.`,
    })
  }

  const handleRejectUser = (id: string) => {
    if (!rejectionReason) {
      toast({
        title: "Rejection Failed",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, status: "rejected" } : user
    )
    setUsers(updatedUsers)
    toast({
      title: "User Rejected",
      description: `The user has been rejected. Reason: ${rejectionReason}`,
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
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Users Management"
          description="Manage user accounts and permissions"
        />
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. New users require admin approval before they can use Cashora.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName || ""}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName || ""}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newUser.username || ""}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="Username"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email || ""}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={newUser.dateOfBirth || ""}
                    onChange={(e) => setNewUser({...newUser, dateOfBirth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="placeOfBirth">Place of Birth</Label>
                  <Input
                    id="placeOfBirth"
                    value={newUser.placeOfBirth || ""}
                    onChange={(e) => setNewUser({...newUser, placeOfBirth: e.target.value})}
                    placeholder="Place of Birth"
                  />
                </div>
                <div>
                  <Label htmlFor="residence">Residence</Label>
                  <Input
                    id="residence"
                    value={newUser.residence || ""}
                    onChange={(e) => setNewUser({...newUser, residence: e.target.value})}
                    placeholder="Residence"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={newUser.nationality || ""}
                    onChange={(e) => setNewUser({...newUser, nationality: e.target.value})}
                    placeholder="Nationality"
                  />
                </div>
                <div>
                  <Label htmlFor="idCard">ID Card Upload</Label>
                  <Input
                    id="idCard"
                    type="file"
                    onChange={(e) => setNewUser({...newUser, idCard: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => setNewUser({...newUser, role: value as "admin" | "user"})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit">Add User</Button>
                </DialogFooter>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            A list of all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={filterStatus} onValueChange={(value: "all" | "pending" | "approved" | "rejected") => setFilterStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="pending">Pending Users</SelectItem>
                <SelectItem value="approved">Approved Users</SelectItem>
                <SelectItem value="rejected">Rejected Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                            </DialogHeader>
                            <DialogDescription asChild>
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Username:</strong> {user.username}</p>
                                <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
                                <p><strong>Place of Birth:</strong> {user.placeOfBirth}</p>
                                <p><strong>Residence:</strong> {user.residence}</p>
                                <p><strong>Nationality:</strong> {user.nationality}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Status:</strong> {user.status}</p>
                                <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>
                                <div>
                                  <p><strong>Withdrawal Limits:</strong></p>
                                  <ul>
                                    <li>Weekly: {user.withdrawalLimit.weekly ? `$${user.withdrawalLimit.weekly.toFixed(2)}` : 'No limit'}</li>
                                    <li>Monthly: {user.withdrawalLimit.monthly ? `$${user.withdrawalLimit.monthly.toFixed(2)}` : 'No limit'}</li>
                                    <li>Yearly: {user.withdrawalLimit.yearly ? `$${user.withdrawalLimit.yearly.toFixed(2)}` : 'No limit'}</li>
                                  </ul>
                                </div>
                                <div>
                                  <p><strong>Sending Limits:</strong></p>
                                  <ul>
                                    <li>Weekly: {user.sendingLimit.weekly ? `$${user.sendingLimit.weekly.toFixed(2)}` : 'No limit'}</li>
                                    <li>Monthly: {user.sendingLimit.monthly ? `$${user.sendingLimit.monthly.toFixed(2)}` : 'No limit'}</li>
                                    <li>Yearly: {user.sendingLimit.yearly ? `$${user.sendingLimit.yearly.toFixed(2)}` : 'No limit'}</li>
                                  </ul>
                                </div>
                                <p><strong>Fee Type:</strong> {user.feeType}</p>
                                <p><strong>Fee Amount:</strong> {user.feeType === 'percentage' ? `${user.feeAmount}%` : `$${user.feeAmount.toFixed(2)}`}</p>
                                {user.idCard && (
                                  <div>
                                    <p><strong>ID Card:</strong></p>
                                    <img src={user.idCard} alt="ID Card" className="mt-2 max-w-full h-auto" />
                                  </div>
                                )}
                              </div>
                            </DialogDescription>
                          </DialogContent>
                        </Dialog>
                        {user.status === "pending" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleApproveUser(user.id)}>
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
                                  <DialogTitle>Reject User</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for rejecting this user.
                                  </DialogDescription>
                                </DialogHeader>
                                <Textarea
                                  placeholder="Reason for rejection"
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                />
                                <DialogFooter>
                                  <Button onClick={() => handleRejectUser(user.id)}>Reject User</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    value={newUser.firstName || ""}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={newUser.lastName || ""}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={newUser.email || ""}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editRole">Role</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({...newUser, role: value as "admin" | "user"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Withdrawal Limits</Label>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="editWithdrawalLimitWeekly">Weekly</Label>
                    <Input
                      id="editWithdrawalLimitWeekly"
                      type="number"
                      value={newUser.withdrawalLimit?.weekly || ""}
                      onChange={(e) => setNewUser({...newUser, withdrawalLimit: {...newUser.withdrawalLimit, weekly: e.target.value ? parseFloat(e.target.value) : null}})}
                      placeholder="No limit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editWithdrawalLimitMonthly">Monthly</Label>
                    <Input
                      id="editWithdrawalLimitMonthly"
                      type="number"
                      value={newUser.withdrawalLimit?.monthly || ""}
                      onChange={(e) => setNewUser({...newUser, withdrawalLimit: {...newUser.withdrawalLimit, monthly: e.target.value ? parseFloat(e.target.value) : null}})}
                      placeholder="No limit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editWithdrawalLimitYearly">Yearly</Label>
                    <Input
                      id="editWithdrawalLimitYearly"
                      type="number"
                      value={newUser.withdrawalLimit?.yearly || ""}
                      onChange={(e) => setNewUser({...newUser, withdrawalLimit: {...newUser.withdrawalLimit, yearly: e.target.value ? parseFloat(e.target.value) : null}})}
                      placeholder="No limit"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Sending Limits</Label>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="editSendingLimitWeekly">Weekly</Label>
                    <Input
                      id="editSendingLimitWeekly"
                      type="number"
                      value={newUser.sendingLimit?.weekly || ""}
                      onChange={(e) => setNewUser({...newUser, sendingLimit: {...newUser.sendingLimit, weekly: e.target.value ? parseFloat(e.target.value) : null}})}
                      placeholder="No limit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editSendingLimitMonthly">Monthly</Label>
                    <Input
                      id="editSendingLimitMonthly"
                      type="number"
                      value={newUser.sendingLimit?.monthly || ""}
                      onChange={(e) => setNewUser({...newUser, sendingLimit: {...newUser.sendingLimit, monthly: e.target.value ? parseFloat(e.target.value) : null}})}
                      placeholder="No limit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editSendingLimitYearly">Yearly</Label>
                    <Input
                      id="editSendingLimitYearly"
                      type="number"
                      value={newUser.sendingLimit?.yearly || ""}
                      onChange={(e) => setNewUser({...newUser, sendingLimit: {...newUser.sendingLimit, yearly: e.target.value ? parseFloat(e.target.value) : null}})}
                      placeholder="No limit"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="editFeeType">Fee Type</Label>
                <Select 
                  value={newUser.feeType} 
                  onValueChange={(value) => setNewUser({...newUser, feeType: value as "percentage" | "fixed"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editFeeAmount">Fee Amount</Label>
                <Input
                  id="editFeeAmount"
                  type="number"
                  value={newUser.feeAmount || ""}
                  onChange={(e) => setNewUser({...newUser, feeAmount: parseFloat(e.target.value)})}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateUser}>Update User</Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

