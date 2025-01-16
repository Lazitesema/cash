"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save } from 'lucide-react'
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
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

interface Settings {
  minWithdrawal: number
  maxWithdrawal: number
  minSend: number
  maxSend: number
  defaultFeePercentage: number
  enableEmailNotifications: boolean
  maintenanceMode: boolean
}

const initialSettings: Settings = {
  minWithdrawal: 10,
  maxWithdrawal: 1000,
  minSend: 5,
  maxSend: 500,
  defaultFeePercentage: 2.5,
  enableEmailNotifications: true,
  maintenanceMode: false,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings)

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save these settings to your backend
    console.log("Saving settings:", settings)
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8"
    >
      <PageHeader
        title="System Settings"
        description="Configure global settings for the Cashora platform"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Adjust system-wide settings and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minWithdrawal">Minimum Withdrawal</Label>
                <Input
                  id="minWithdrawal"
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) => setSettings({...settings, minWithdrawal: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="maxWithdrawal">Maximum Withdrawal</Label>
                <Input
                  id="maxWithdrawal"
                  type="number"
                  value={settings.maxWithdrawal}
                  onChange={(e) => setSettings({...settings, maxWithdrawal: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minSend">Minimum Send Amount</Label>
                <Input
                  id="minSend"
                  type="number"
                  value={settings.minSend}
                  onChange={(e) => setSettings({...settings, minSend: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="maxSend">Maximum Send Amount</Label>
                <Input
                  id="maxSend"
                  type="number"
                  value={settings.maxSend}
                  onChange={(e) => setSettings({...settings, maxSend: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="defaultFeePercentage">Default Fee Percentage</Label>
              <Input
                id="defaultFeePercentage"
                type="number"
                value={settings.defaultFeePercentage}
                onChange={(e) => setSettings({...settings, defaultFeePercentage: parseFloat(e.target.value)})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableEmailNotifications"
                checked={settings.enableEmailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, enableEmailNotifications: checked})}
              />
              <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            </div>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

