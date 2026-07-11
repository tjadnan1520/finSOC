import { useId } from 'react';
import './Input.css';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  helperText,
  icon,
  name,
  ...rest
}) {
  const generatedId = useId();
  const inputId = name || generatedId;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${disabled ? 'input-group--disabled' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`input-field ${icon ? 'input-field--with-icon' : ''}`}
          {...rest}
        />
      </div>

      {error && <p className="input-error">{error}</p>}
      {helperText && !error && <p className="input-helper">{helperText}</p>}
    </div>
  );
}
