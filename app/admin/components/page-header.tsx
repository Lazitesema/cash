import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && (
        <p className="mt-1 text-gray-400">{description}</p>
      )}
    </motion.div>
  )
}

