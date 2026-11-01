// Доступ до ресурсу /api/notes.
export class NotesService {
  constructor({ apiClient }) {
    this.api = apiClient;
  }

  /** Повертає { data, meta }. Параметри: search, categoryId, tag, page, limit. */
  list(params) { return this.api.get('/notes', params); }
  get(id) { return this.api.get(`/notes/${id}`); }
  create(data) { return this.api.post('/notes', data); }
  update(id, data) { return this.api.put(`/notes/${id}`, data); }
  patch(id, data) { return this.api.patch(`/notes/${id}`, data); }
  remove(id) { return this.api.delete(`/notes/${id}`); }
}
