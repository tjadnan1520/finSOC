import { useId } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './Select.css';

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  disabled = false,
  required = false,
  name,
  ...rest
}) {
  const generatedId = useId();
  const selectId = name || generatedId;

  return (
    <div className={`select-group ${error ? 'select-group--error' : ''} ${disabled ? 'select-group--disabled' : ''}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}

      <div className="select-wrapper">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="select-field"
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="select-arrow" size={16} />
      </div>

      {error && <p className="select-error">{error}</p>}
    </div>
  );
}
