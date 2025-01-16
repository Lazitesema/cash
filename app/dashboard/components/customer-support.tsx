"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hello! How can I assist you today?",
    sender: "bot",
  },
]

export function CustomerSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(input),
        sender: "bot",
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    if (lowerInput.includes("deposit")) {
      return "To make a deposit, go to the Deposit page in your dashboard and follow the instructions. You'll need to enter the amount and upload a receipt."
    } else if (lowerInput.includes("withdraw")) {
      return "For withdrawals, visit the Withdraw page. Enter the amount, your bank details, and submit the request. Please note that withdrawals are subject to approval."
    } else if (lowerInput.includes("send money")) {
      return "To send money, use the Send Money page. Enter the recipient's email or username and the amount you want to send. The transaction will be processed after approval."
    } else if (lowerInput.includes("balance")) {
      return "Your current balance is displayed on your dashboard and profile page. If you have any discrepancies, please contact our support team."
    } else {
      return "I'm sorry, I couldn't understand your query. Could you please rephrase or ask about deposits, withdrawals, sending money, or checking your balance?"
    }
  }

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-4 right-4 rounded-full h-12 w-12"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 right-4 w-80 z-50"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customer Support</CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] overflow-y-auto mb-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <Button type="submit">Send</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

