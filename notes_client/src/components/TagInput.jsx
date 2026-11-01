// Введення тегів: Enter або кома додає тег, Backspace у порожньому полі видаляє останній.
import { useState } from 'react';
import TagChip from './TagChip.jsx';
import '../styles/components/TagInput.scss';

export default function TagInput({ id, label, tags, onChange, error, maxTags = 20 }) {
  const [text, setText] = useState('');

  const addTag = (raw) => {
    const name = raw.trim().toLowerCase();
    if (!name || name.length > 50 || tags.includes(name) || tags.length >= maxTags) return;
    onChange([...tags, name]);
  };
  const commit = () => { addTag(text); setText(''); };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !text && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className={`tag-input ${error ? 'tag-input--error' : ''}`.trim()}>
      <label htmlFor={id} className="tag-input__label">{label}</label>
      <div className="tag-input__box">
        {tags.map((t) => (
          <TagChip key={t} name={t} onRemove={(name) => onChange(tags.filter((x) => x !== name))} />
        ))}
        <input
          id={id}
          className="tag-input__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={tags.length === 0 ? 'Введіть тег і натисніть Enter' : ''}
        />
      </div>
      {error && <p className="tag-input__error" role="alert">{error}</p>}
    </div>
  );
}
