// Випадаючий список. options: [{ value, label }]. Порожнє value - «нічого не вибрано».
import '../styles/components/Select.scss';

export default function Select({ id, label, value, onChange, options, hideLabel = false }) {
  return (
    <div className="select">
      <label htmlFor={id} className={`select__label ${hideLabel ? 'visually-hidden' : ''}`.trim()}>{label}</label>
      <select id={id} className="select__control" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
