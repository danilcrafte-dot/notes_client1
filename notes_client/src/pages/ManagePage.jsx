// Універсальна сторінка керування довідником (категорії або теги): список, додавання,
// редагування, видалення. Конкретний сервіс передається за іменем (DI), тому код не дублюється.
import { useState } from 'react';
import { useService } from '../di/ServicesContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import Button from '../components/Button.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import ItemRow from '../components/ItemRow.jsx';
import Loader from '../components/Loader.jsx';
import TextField from '../components/TextField.jsx';
import { validateName } from '../utils/validation.js';
import '../styles/components/ManagePage.scss';

export default function ManagePage({ title, serviceName, withDescription = false, nameMax, emptyTitle, deleteMessage }) {
  const service = useService(serviceName);
  const items = useAsync(() => service.list(), [service]);

  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [adding, setAdding] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const buildPayload = (v) => (withDescription
    ? { name: v.name.trim(), description: v.description.trim() || null }
    : { name: v.name.trim() });

  const handleAdd = async (e) => {
    e.preventDefault();
    setActionError(null);
    const clientErrors = validateName(form.name, nameMax);
    setErrors(clientErrors);
    if (clientErrors.name) return;
    setAdding(true);
    try {
      await service.create(buildPayload(form));
      setForm({ name: '', description: '' });
      items.reload();
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      setActionError(error);
    } finally {
      setAdding(false);
    }
  };

  const handleSave = async (id, values) => {
    await service.update(id, buildPayload(values));
    items.reload();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setActionError(null);
    try {
      await service.remove(toDelete.id);
      items.reload();
    } catch (error) {
      setActionError(error);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const list = items.data ?? [];
  return (
    <section className="manage-page">
      <h1 className="page-header__title">{title}</h1>

      <form className="manage-page__form" onSubmit={handleAdd} noValidate>
        <TextField id="new-name" label="Нова назва" value={form.name} maxLength={nameMax}
          onChange={(name) => setForm({ ...form, name })} error={errors.name} />
        {withDescription && (
          <TextField id="new-description" label="Опис (необов’язково)" value={form.description} maxLength={1000}
            onChange={(description) => setForm({ ...form, description })} error={errors.description} />
        )}
        <Button type="submit" loading={adding}>Додати</Button>
      </form>

      <ErrorBanner error={actionError} />
      <ErrorBanner error={items.error} onRetry={items.reload} />
      {items.loading && !items.data && <Loader />}
      {!items.error && !items.loading && list.length === 0 && <EmptyState title={emptyTitle} description="Додайте перший елемент за допомогою форми вище." />}

      {list.length > 0 && (
        <ul className="manage-page__list">
          {list.map((item) => (
            <ItemRow key={item.id} item={item} withDescription={withDescription} nameMax={nameMax}
              onSave={handleSave} onDelete={setToDelete} />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Підтвердіть видалення"
        message={toDelete ? `«${toDelete.name}»: ${deleteMessage}` : ''}
        confirmLabel="Видалити"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}
