// Створення та редагування нотатки (контейнерний компонент).
// Для нової нотатки чернетка автоматично зберігається в localStorage.
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useService } from '../di/ServicesContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import Button from '../components/Button.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Loader from '../components/Loader.jsx';
import Select from '../components/Select.jsx';
import TagInput from '../components/TagInput.jsx';
import TextField from '../components/TextField.jsx';
import { validateNote } from '../utils/validation.js';
import '../styles/components/NoteFormPage.scss';

const EMPTY_FORM = { title: '', content: '', categoryId: '', tags: [] };

export default function NoteFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const notesService = useService('notesService');
  const categoriesService = useService('categoriesService');
  const storage = useService('storage');

  const noteRes = useAsync(() => (isEdit ? notesService.get(id) : Promise.resolve(null)), [id]);
  const categories = useAsync(() => categoriesService.list(), []);

  const [form, setForm] = useState(() => (isEdit ? EMPTY_FORM : { ...EMPTY_FORM, ...storage.get('draft', {}) }));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Редагування: після завантаження нотатки заповнюємо форму
  useEffect(() => {
    const note = noteRes.data;
    if (isEdit && note) {
      setForm({ title: note.title, content: note.content, categoryId: note.categoryId ?? '', tags: note.tags });
    }
  }, [isEdit, noteRes.data]);

  // Нова нотатка: автозбереження чернетки
  useEffect(() => {
    if (!isEdit) storage.set('draft', form);
  }, [isEdit, form, storage]);

  const setField = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const clientErrors = validateNote(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    const payload = {
      title: form.title.trim(),
      content: form.content,
      categoryId: form.categoryId === '' ? null : Number(form.categoryId),
      tags: form.tags,
    };
    setSaving(true);
    try {
      if (isEdit) await notesService.update(id, payload);
      else await notesService.create(payload);
      storage.remove('draft');
      navigate('/');
    } catch (error) {
      setErrors(error.fieldErrors ?? {}); // помилки валідації від сервера - під відповідними полями
      setSubmitError(error);
      setSaving(false);
    }
  };

  const categoryOptions = [{ value: '', label: 'Без категорії' }, ...(categories.data ?? []).map((c) => ({ value: String(c.id), label: c.name }))];

  if (isEdit && noteRes.loading && !noteRes.data) return <Loader label="Завантаження нотатки…" />;
  if (isEdit && noteRes.error) {
    return (
      <section>
        <ErrorBanner error={noteRes.error} onRetry={noteRes.reload} />
        <Button variant="secondary" onClick={() => navigate('/')}>← До списку</Button>
      </section>
    );
  }

  return (
    <section className="note-form-page">
      <h1 className="page-header__title">{isEdit ? 'Редагування нотатки' : 'Нова нотатка'}</h1>
      <form className="note-form" onSubmit={handleSubmit} noValidate>
        <TextField id="note-title" label="Заголовок" required value={form.title} maxLength={200}
          onChange={setField('title')} error={errors.title} />
        <TextField id="note-content" label="Текст" multiline rows={8} value={form.content} maxLength={10000}
          onChange={setField('content')} error={errors.content} />
        <Select id="note-category" label="Категорія" value={String(form.categoryId)}
          options={categoryOptions} onChange={setField('categoryId')} />
        {errors.categoryId && <p className="note-form__error" role="alert">{errors.categoryId}</p>}
        <TagInput id="note-tags" label="Теги" tags={form.tags} onChange={setField('tags')} error={errors.tags} />

        <ErrorBanner error={submitError} />
        <ErrorBanner error={categories.error} onRetry={categories.reload} />

        <div className="note-form__actions">
          <Button type="submit" loading={saving}>{isEdit ? 'Зберегти зміни' : 'Створити'}</Button>
          <Button variant="secondary" onClick={() => navigate('/')} disabled={saving}>Скасувати</Button>
          {!isEdit && <Button variant="ghost" onClick={() => setForm(EMPTY_FORM)} disabled={saving}>Очистити</Button>}
        </div>
        {!isEdit && <p className="note-form__hint">Чернетка зберігається в браузері автоматично.</p>}
      </form>
    </section>
  );
}
