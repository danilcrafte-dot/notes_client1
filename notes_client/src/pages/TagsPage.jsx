import ManagePage from './ManagePage.jsx';

export default function TagsPage() {
  return (
    <ManagePage
      title="Теги"
      serviceName="tagsService"
      nameMax={50}
      emptyTitle="Тегів ще немає"
      deleteMessage="тег буде прибрано з усіх нотаток."
    />
  );
}
