"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Upload } from 'lucide-react'
import { PageHeader } from "../components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminProfile {
  name: string
  email: string
  role: string
  bio: string
  avatar: string
}

const initialProfile: AdminProfile = {
  name: "Admin User",
  email: "admin@cashora.com",
  role: "Super Admin",
  bio: "Experienced administrator managing the Cashora platform.",
  avatar: "/placeholder-avatar.jpg",
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<AdminProfile>(initialProfile)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the profile to your backend
    console.log("Saving profile:", profile)
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Here you would typically upload the file to your server or a file storage service
      // For this example, we'll just use a local URL
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile({...profile, avatar: event.target.result as string})
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8"
    >
      <PageHeader
        title="Admin Profile"
        description="Manage your admin account details"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={profile.role}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={4}
              />
            </div>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

