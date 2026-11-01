// Помилка запиту до API: містить HTTP-статус, код і перелік помилок полів.
export class ApiError extends Error {
  constructor(message, { status = 0, code = 'UNKNOWN', details = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isNetworkError() {
    return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT';
  }

  /** Помилки полів у вигляді { поле: повідомлення } для відображення у формах. */
  get fieldErrors() {
    const result = {};
    for (const d of this.details || []) {
      if (d.field && !result[d.field]) result[d.field] = d.message;
    }
    return result;
  }
}
