"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  address: string
  balance: number
  avatar: string
}

const profile: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  dateOfBirth: "1990-01-01",
  address: "123 Main St, Anytown, USA",
  balance: 10000,
  avatar: "/placeholder-avatar.jpg",
}

export default function ProfilePage() {
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(profile)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Here you would typically upload the file to your server or a file storage service
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentProfile({...currentProfile, avatar: event.target.result as string})
          toast({
            title: "Profile Picture Updated",
            description: "Your profile picture has been updated successfully.",
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 overflow-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Profile</h1>

          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={currentProfile.avatar} alt={`${currentProfile.firstName} ${currentProfile.lastName}`} />
                    <AvatarFallback>{currentProfile.firstName[0]}{currentProfile.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={currentProfile.firstName}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={currentProfile.lastName}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentProfile.email}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={currentProfile.phoneNumber}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={currentProfile.dateOfBirth}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={currentProfile.address}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="balance">Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={currentProfile.balance}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

