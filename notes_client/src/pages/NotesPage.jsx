// Головна сторінка (контейнерний компонент): пошук, фільтри, пагінація, видалення.
// Уся робота з даними - тут і в сервісах; картки та елементи керування лише відображають.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useService } from '../di/ServicesContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { usePersistentState } from '../hooks/usePersistentState.js';
import Button from '../components/Button.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Loader from '../components/Loader.jsx';
import NoteCard from '../components/NoteCard.jsx';
import Pagination from '../components/Pagination.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Select from '../components/Select.jsx';
import '../styles/components/NotesPage.scss';

const PAGE_SIZE = 9;

export default function NotesPage() {
  const navigate = useNavigate();
  const notesService = useService('notesService');
  const categoriesService = useService('categoriesService');
  const tagsService = useService('tagsService');

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  // Вибрані фільтри запам'ятовуються між візитами (localStorage)
  const [filters, setFilters] = usePersistentState('filters', { categoryId: '', tag: '' });
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const notes = useAsync(
    () => notesService.list({ search: debouncedSearch, categoryId: filters.categoryId, tag: filters.tag, page, limit: PAGE_SIZE }),
    [debouncedSearch, filters.categoryId, filters.tag, page],
  );
  const categories = useAsync(() => categoriesService.list(), []);
  const tags = useAsync(() => tagsService.list(), []);

  const list = notes.data?.data ?? [];
  const meta = notes.data?.meta;
  const hasFilters = Boolean(debouncedSearch || filters.categoryId || filters.tag);

  const handleSearch = (value) => { setSearch(value); setPage(1); };
  const updateFilter = (patch) => { setFilters({ ...filters, ...patch }); setPage(1); };
  const resetFilters = () => { setSearch(''); setFilters({ categoryId: '', tag: '' }); setPage(1); };

  const confirmDelete = async () => {
    setDeleting(true);
    setActionError(null);
    try {
      await notesService.remove(toDelete.id);
      const wasLastOnPage = list.length === 1 && page > 1;
      setToDelete(null);
      if (wasLastOnPage) setPage(page - 1);
      else notes.reload();
      categories.reload();
      tags.reload();
    } catch (error) {
      setActionError(error);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const categoryOptions = [{ value: '', label: 'Усі категорії' }, ...(categories.data ?? []).map((c) => ({ value: String(c.id), label: c.name }))];
  const tagOptions = [{ value: '', label: 'Усі теги' }, ...(tags.data ?? []).map((t) => ({ value: t.name, label: `#${t.name}` }))];

  return (
    <section className="notes-page">
      <div className="page-header">
        <h1 className="page-header__title">
          Мої нотатки {meta && <span className="page-header__count">({meta.total})</span>}
        </h1>
        <Button onClick={() => navigate('/notes/new')}>+ Нова нотатка</Button>
      </div>

      <div className="filters">
        <SearchBar value={search} onChange={handleSearch} />
        <Select id="filter-category" label="Категорія" hideLabel value={String(filters.categoryId)}
          options={categoryOptions} onChange={(categoryId) => updateFilter({ categoryId })} />
        <Select id="filter-tag" label="Тег" hideLabel value={filters.tag}
          options={tagOptions} onChange={(tag) => updateFilter({ tag })} />
        {hasFilters && <Button variant="ghost" onClick={resetFilters}>Скинути</Button>}
      </div>

      <ErrorBanner error={actionError} />
      <ErrorBanner error={notes.error} onRetry={notes.reload} />

      {notes.loading && !notes.data && <Loader label="Завантаження нотаток…" />}

      {!notes.error && !(notes.loading && !notes.data) && list.length === 0 && (
        <EmptyState
          title={hasFilters ? 'Нічого не знайдено' : 'Нотаток ще немає'}
          description={hasFilters ? 'Спробуйте змінити запит або скинути фільтри.' : 'Створіть першу нотатку, щоб почати.'}
          action={!hasFilters && <Button onClick={() => navigate('/notes/new')}>Створити нотатку</Button>}
        />
      )}

      {list.length > 0 && (
        <div className={`notes-grid ${notes.loading ? 'notes-grid--loading' : ''}`.trim()} aria-busy={notes.loading}>
          {list.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={(n) => navigate(`/notes/${n.id}/edit`)}
              onDelete={setToDelete}
              onTagClick={(tag) => updateFilter({ tag })}
            />
          ))}
        </div>
      )}

      {meta && <Pagination page={meta.page} pages={meta.pages} onChange={setPage} />}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Видалити нотатку?"
        message={toDelete ? `Нотатку «${toDelete.title}» буде видалено без можливості відновлення.` : ''}
        confirmLabel="Видалити"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}
