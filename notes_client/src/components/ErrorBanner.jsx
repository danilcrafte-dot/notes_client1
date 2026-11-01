// Повідомлення про помилку з кнопкою повтору. Розрізняє помилки мережі та помилки сервера.
import Button from './Button.jsx';
import '../styles/components/ErrorBanner.scss';

export default function ErrorBanner({ error, onRetry }) {
  if (!error) return null;
  const title = error.isNetworkError ? 'Немає зв’язку із сервером' : 'Не вдалося виконати дію';
  return (
    <div className="error-banner" role="alert">
      <div className="error-banner__text">
        <strong>{title}</strong>
        <p>{error.message || 'Сталася невідома помилка'}</p>
      </div>
      {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Спробувати знову</Button>}
    </div>
  );
}
