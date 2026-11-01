// Доступ до ресурсу /api/tags (теги).
export class TagsService {
  constructor({ apiClient }) {
    this.api = apiClient;
  }

  /** Повертає масив елементів (розгортає { data: [...] }). */
  async list() {
    const response = await this.api.get('/tags');
    return response.data;
  }

  get(id) { return this.api.get(`/tags/${id}`); }
  create(data) { return this.api.post('/tags', data); }
  update(id, data) { return this.api.put(`/tags/${id}`, data); }
  remove(id) { return this.api.delete(`/tags/${id}`); }
}
