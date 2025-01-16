import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const transactions = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    amount: "+$350.00",
    status: "complete",
    date: "2023-01-13",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    amount: "-$120.00",
    status: "processing",
    date: "2023-01-14",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    amount: "+$700.00",
    status: "complete",
    date: "2023-01-15",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    amount: "-$250.00",
    status: "complete",
    date: "2023-01-16",
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    amount: "+$1000.00",
    status: "processing",
    date: "2023-01-17",
  },
  // Add more transactions as needed
]

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://avatar.vercel.sh/${transaction.email}`} alt={transaction.name} />
                <AvatarFallback>{transaction.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.email}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

