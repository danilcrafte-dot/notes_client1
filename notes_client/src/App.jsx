// Маршрутизація застосунку.
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Layout from './components/Layout.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import NoteFormPage from './pages/NoteFormPage.jsx';
import NotesPage from './pages/NotesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import TagsPage from './pages/TagsPage.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<NotesPage />} />
          <Route path="notes/new" element={<NoteFormPage key="new" />} />
          <Route path="notes/:id/edit" element={<NoteFormPage key="edit" />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
