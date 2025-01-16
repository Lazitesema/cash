"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, Users, ArrowUpDown, Send, TrendingUp, TrendingDown } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const chartData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Apr', value: 81 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 55 },
  { name: 'Jul', value: 70 }
]

const recentTransactions = [
  { 
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    amount: '+$350.00',
    status: 'complete',
    date: '2024-01-13',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    amount: '-$120.00',
    status: 'processing',
    date: '2024-01-14',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    amount: '+$700.00',
    status: 'complete',
    date: '2024-01-15',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    amount: '-$250.00',
    status: 'complete',
    date: '2024-01-16',
  },
  {
    id: '5',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    amount: '+$1000.00',
    status: 'complete',
    date: '2024-01-17',
  },
  {
    id: '6',
    name: 'Eva Wilson',
    email: 'eva@example.com',
    amount: '-$180.00',
    status: 'processing',
    date: '2024-01-18',
  },
  {
    id: '7',
    name: 'Frank Miller',
    email: 'frank@example.com',
    amount: '+$450.00',
    status: 'complete',
    date: '2024-01-19',
  },
  {
    id: '8',
    name: 'Grace Lee',
    email: 'grace@example.com',
    amount: '+$890.00',
    status: 'complete',
    date: '2024-01-20',
  }
]

const MetricCard = ({ title, value, trend, icon: Icon, trendLabel }: {
  title: string
  value: string
  trend: number
  icon: any
  trendLabel: string
}) => {
  const isPositive = trend > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl bg-card p-6 shadow-sm border border-border hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`rounded-full p-2 ${
          isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {isPositive ? (
          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
        )}
        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
          {Math.abs(trend)}%
        </span>
        <span className="ml-1 text-muted-foreground">{trendLabel}</span>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Deposit"
          value="$10,000,000"
          trend={8.2}
          icon={Heart}
          trendLabel="vs last month"
        />
        <MetricCard
          title="Total Users"
          value="230"
          trend={-3.1}
          icon={Users}
          trendLabel="vs last month"
        />
        <MetricCard
          title="Total Withdrawals"
          value="$5,000,000"
          trend={2.5}
          icon={ArrowUpDown}
          trendLabel="vs last month"
        />
        <MetricCard
          title="Total Sendings"
          value="$7,500,000"
          trend={5.7}
          icon={Send}
          trendLabel="vs last month"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-4 rounded-xl bg-card p-6 border border-border"
        >
          <h3 className="text-lg font-semibold mb-4">Transactions Overview</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-3 rounded-xl bg-card p-6 border border-border"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${transaction.email}`} />
                      <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.email}</p>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.amount}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      </div>
    </div>
  )
}

