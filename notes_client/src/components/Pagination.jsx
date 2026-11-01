// Постраницьова навігація: «Назад» / «Сторінка X з Y» / «Далі».
import Button from './Button.jsx';
import '../styles/components/Pagination.scss';

export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Сторінки">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Назад</Button>
      <span className="pagination__info">Сторінка {page} з {pages}</span>
      <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Далі →</Button>
    </nav>
  );
}
