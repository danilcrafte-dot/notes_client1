// Рядок списку категорій/тегів із вбудованим редагуванням (презентаційний компонент).
import { useState } from 'react';
import Button from './Button.jsx';
import TextField from './TextField.jsx';
import { pluralize } from '../utils/format.js';
import '../styles/components/ItemRow.scss';

export default function ItemRow({ item, withDescription, nameMax, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({ name: item.name, description: item.description ?? '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setValues({ name: item.name, description: item.description ?? '' });
    setError('');
    setEditing(true);
  };
  const save = async (e) => {
    e.preventDefault();
    if (!values.name.trim()) { setError('Назва обов’язкова'); return; }
    setSaving(true);
    try {
      await onSave(item.id, values);
      setEditing(false);
    } catch (err) {
      setError(err.fieldErrors?.name || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <li className="item-row item-row--editing">
        <form className="item-row__form" onSubmit={save}>
          <TextField id={`edit-name-${item.id}`} label="Назва" value={values.name} maxLength={nameMax} error={error}
            onChange={(name) => setValues({ ...values, name })} />
          {withDescription && (
            <TextField id={`edit-desc-${item.id}`} label="Опис" value={values.description} maxLength={1000}
              onChange={(description) => setValues({ ...values, description })} />
          )}
          <div className="item-row__actions">
            <Button type="submit" size="sm" loading={saving}>Зберегти</Button>
            <Button variant="secondary" size="sm" onClick={() => setEditing(false)} disabled={saving}>Скасувати</Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="item-row">
      <div className="item-row__main">
        <span className="item-row__name">{item.name}</span>
        <span className="item-row__count">
          {item.notesCount} {pluralize(item.notesCount, ['нотатка', 'нотатки', 'нотаток'])}
        </span>
        {withDescription && item.description && <p className="item-row__desc">{item.description}</p>}
      </div>
      <div className="item-row__actions">
        <Button variant="ghost" size="sm" onClick={startEdit}>Редагувати</Button>
        <Button variant="ghost-danger" size="sm" onClick={() => onDelete(item)}>Видалити</Button>
      </div>
    </li>
  );
}
