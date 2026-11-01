// Доступ до ресурсу /api/categories (категорії).
export class CategoriesService {
  constructor({ apiClient }) {
    this.api = apiClient;
  }

  /** Повертає масив елементів (розгортає { data: [...] }). */
  async list() {
    const response = await this.api.get('/categories');
    return response.data;
  }

  get(id) { return this.api.get(`/categories/${id}`); }
  create(data) { return this.api.post('/categories', data); }
  update(id, data) { return this.api.put(`/categories/${id}`, data); }
  remove(id) { return this.api.delete(`/categories/${id}`); }
}
