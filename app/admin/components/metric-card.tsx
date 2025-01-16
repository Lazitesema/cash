"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { type LucideIcon } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  title: string
  value: string
  trend: number
  trendIcon: LucideIcon
}

export function MetricCard({ icon: Icon, title, value, trend, trendIcon: TrendIcon }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-semibold mt-1">{value}</h3>
            </div>
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-full p-2 ${
                trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          </div>
          <div className="flex items-center mt-4">
            <TrendIcon className={`h-4 w-4 mr-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend)}%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

