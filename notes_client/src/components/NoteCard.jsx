// Картка нотатки (презентаційний компонент): уся логіка передається через props.
import Button from './Button.jsx';
import TagChip from './TagChip.jsx';
import { excerpt, formatDate } from '../utils/format.js';
import '../styles/components/NoteCard.scss';

export default function NoteCard({ note, onEdit, onDelete, onTagClick }) {
  return (
    <article className="note-card">
      <header className="note-card__header">
        <h3 className="note-card__title">{note.title}</h3>
        {note.category && <span className="note-card__category">{note.category.name}</span>}
      </header>
      <p className="note-card__content">{excerpt(note.content, 160) || 'Без тексту'}</p>
      {note.tags.length > 0 && (
        <ul className="note-card__tags">
          {note.tags.map((t) => <li key={t}><TagChip name={t} onClick={onTagClick} /></li>)}
        </ul>
      )}
      <footer className="note-card__footer">
        <time className="note-card__date" dateTime={note.updatedAt}>{formatDate(note.updatedAt)}</time>
        <div className="note-card__actions">
          <Button variant="ghost" size="sm" onClick={() => onEdit(note)}>Редагувати</Button>
          <Button variant="ghost-danger" size="sm" onClick={() => onDelete(note)}>Видалити</Button>
        </div>
      </footer>
    </article>
  );
}
