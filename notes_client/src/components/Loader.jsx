// Індикатор завантаження.
import '../styles/components/Loader.scss';

export default function Loader({ label = 'Завантаження…' }) {
  return (
    <div className="loader" role="status">
      <span className="loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
