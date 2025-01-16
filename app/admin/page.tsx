"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, ArrowUpDown, Send, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { MetricCard } from './components/metric-card'
import { TransactionsChart } from './components/transactions-chart'
import { RecentTransactions } from './components/recent-transactions'
import { PageHeader } from "./components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const banks = [
  {
    name: 'Commercial Bank Of Ethiopia',
    users: '200 Users',
  },
  {
    name: 'Awash Bank',
    users: '100 Users',
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Dashboard"
        description="Welcome back, Admin. Here's what's happening with your platform today."
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" onClick={() => setActiveTab('overview')}>Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <MetricCard
                icon={Heart}
                title="Total Deposit"
                value="$10,000,000"
                trend={8.2}
                trendIcon={TrendingUp}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard
                icon={Users}
                title="Total Users"
                value="230"
                trend={-3.1}
                trendIcon={TrendingDown}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard
                icon={ArrowUpDown}
                title="Total Withdrawals"
                value="$5,000,000"
                trend={2.5}
                trendIcon={TrendingUp}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MetricCard
                icon={Send}
                title="Total Sendings"
                value="$7,500,000"
                trend={5.7}
                trendIcon={TrendingUp}
              />
            </motion.div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <motion.div
              variants={itemVariants}
              className="col-span-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Transactions Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <TransactionsChart />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="col-span-3"
            >
              <Card className="h-[400px] flex flex-col">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-auto">
                  <RecentTransactions />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

