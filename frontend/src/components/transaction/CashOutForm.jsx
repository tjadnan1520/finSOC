import TransactionForm from './TransactionForm';
import './CashOutForm.css';

export default function CashOutForm(props) {
  return (
    <div className="cash-out-form">
      <TransactionForm type="CASH_OUT" {...props} />
    </div>
  );
}
