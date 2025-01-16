import { TransactionsList } from '../components/transactions-list'
import { PageHeader } from '../components/page-header'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="View and manage all transactions in the system"
      />
      <TransactionsList />
    </div>
  )
}

