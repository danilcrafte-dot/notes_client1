// Діалог підтвердження небезпечної дії (видалення).
import Button from './Button.jsx';
import '../styles/components/ConfirmDialog.scss';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Підтвердити', loading = false, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialog-title" className="dialog__title">{title}</h2>
        <p className="dialog__message">{message}</p>
        <div className="dialog__actions">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Скасувати</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
