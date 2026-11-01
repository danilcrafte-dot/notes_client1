import ManagePage from './ManagePage.jsx';

export default function CategoriesPage() {
  return (
    <ManagePage
      title="Категорії"
      serviceName="categoriesService"
      withDescription
      nameMax={100}
      emptyTitle="Категорій ще немає"
      deleteMessage="категорію буде видалено, а її нотатки залишаться без категорії."
    />
  );
}
