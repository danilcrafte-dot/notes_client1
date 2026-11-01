// Поле вводу (однорядкове або багаторядкове) з підписом і повідомленням про помилку.
import '../styles/components/TextField.scss';

export default function TextField({
  id, label, value, onChange, error, multiline = false, rows = 6,
  maxLength, placeholder, required = false, type = 'text',
}) {
  const Control = multiline ? 'textarea' : 'input';
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={`field ${error ? 'field--error' : ''}`.trim()}>
      <label htmlFor={id} className="field__label">
        {label}{required && <span className="field__required"> *</span>}
      </label>
      <Control
        id={id}
        className="field__control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={multiline ? rows : undefined}
        type={multiline ? undefined : type}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      />
      {error && <p id={errorId} className="field__error" role="alert">{error}</p>}
    </div>
  );
}
