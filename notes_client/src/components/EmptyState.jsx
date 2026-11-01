// Порожній стан списку: заголовок, пояснення та (необов'язково) кнопка дії.
import '../styles/components/EmptyState.scss';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__text">{description}</p>}
      {action}
    </div>
  );
}
