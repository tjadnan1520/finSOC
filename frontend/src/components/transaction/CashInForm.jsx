import TransactionForm from './TransactionForm';
import './CashInForm.css';

export default function CashInForm(props) {
  return (
    <div className="cash-in-form">
      <TransactionForm type="CASH_IN" {...props} />
    </div>
  );
}
