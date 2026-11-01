// Тег-«чіп»: може бути клікабельним (фільтр) і/або мати кнопку видалення.
import '../styles/components/TagChip.scss';

export default function TagChip({ name, active = false, onClick, onRemove }) {
  return (
    <span className={`chip ${active ? 'chip--active' : ''}`.trim()}>
      {onClick ? (
        <button type="button" className="chip__label chip__label--button" onClick={() => onClick(name)}>#{name}</button>
      ) : (
        <span className="chip__label">#{name}</span>
      )}
      {onRemove && (
        <button type="button" className="chip__remove" aria-label={`Прибрати тег ${name}`} onClick={() => onRemove(name)}>×</button>
      )}
    </span>
  );
}
