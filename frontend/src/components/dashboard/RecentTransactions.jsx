import { formatCurrency, formatDateTime } from '../../utils/formatter';
import './RecentTransactions.css';

export default function RecentTransactions({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <div className="recent-transactions">
        <div className="recent-transactions__header">
          <h3 className="recent-transactions__title">Recent Transactions</h3>
        </div>
        <p className="recent-transactions__empty">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="recent-transactions">
      <div className="recent-transactions__header">
        <h3 className="recent-transactions__title">Recent Transactions</h3>
        <a href="/transactions" className="recent-transactions__view-all">View All</a>
      </div>

      <div className="recent-transactions__table-wrapper">
        <table className="recent-transactions__table">
          <thead>
            <tr>
              <th>Phone</th>
              <th>Provider</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="recent-transactions__ref">{tx.phoneNumber || tx.referenceNumber || '—'}</td>
                <td>{tx.provider?.name || '—'}</td>
                <td className="recent-transactions__amount">{formatCurrency(tx.amount)}</td>
                <td>
                  <span className={`recent-transactions__type recent-transactions__type--${(tx.type || '').toLowerCase()}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="recent-transactions__time">{formatDateTime(tx.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
