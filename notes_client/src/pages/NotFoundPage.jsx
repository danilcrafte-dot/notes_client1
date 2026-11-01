import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Сторінку не знайдено"
      description="Перевірте адресу або поверніться на головну."
      action={<Link to="/">На головну</Link>}
    />
  );
}
