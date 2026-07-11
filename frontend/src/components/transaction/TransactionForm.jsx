import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import './TransactionForm.css';

const initialForm = {
  providerId: '',
  amount: '',
  phoneNumber: '',
  remarks: '',
};

export default function TransactionForm({
  type = 'CASH_IN',
  providers = [],
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const errs = {};
    if (!form.providerId) errs.providerId = 'Provider is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Amount must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      type,
      providerId: form.providerId,
      amount: Number(form.amount),
      phoneNumber: form.phoneNumber || undefined,
      remarks: form.remarks || undefined,
    });
  }

  function handleReset() {
    setForm({ ...initialForm });
    setErrors({});
  }

  const title = type === 'CASH_IN' ? 'Cash In' : 'Cash Out';

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
      <div className="transaction-form__card">
        <h3 className="transaction-form__title">{title}</h3>

        <div className="transaction-form__fields">
          <Select
            label="Provider"
            options={providers}
            placeholder="Select provider"
            name="providerId"
            value={form.providerId}
            onChange={handleChange}
            error={errors.providerId}
          />

          <Input
            label="Amount"
            type="number"
            name="amount"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            error={errors.amount}
          />

          <Input
            label="Phone Number"
            type="text"
            name="phoneNumber"
            placeholder="Customer phone number"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <Input
            label="Remarks"
            type="text"
            name="remarks"
            placeholder="Optional remarks"
            value={form.remarks}
            onChange={handleChange}
          />
        </div>

        <div className="transaction-form__actions">
          <Button type="submit" variant="primary" loading={loading}>
            Submit {title}
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}
