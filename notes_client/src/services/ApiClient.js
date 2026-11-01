// Тонка обгортка над Fetch API: JSON, таймаут, єдиний формат помилок (ApiError).
import { ApiError } from './ApiError.js';

/** Формує рядок запиту, пропускаючи порожні значення. */
export function buildQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}

export class ApiClient {
  constructor({ config, fetchImpl }) {
    this.baseUrl = config.apiUrl.replace(/\/$/, '');
    this.timeoutMs = config.requestTimeoutMs;
    this.fetchImpl = fetchImpl ?? ((...args) => globalThis.fetch(...args));
  }

  get(path, params) { return this.request('GET', path, { params }); }
  post(path, body) { return this.request('POST', path, { body }); }
  put(path, body) { return this.request('PUT', path, { body }); }
  patch(path, body) { return this.request('PATCH', path, { body }); }
  delete(path) { return this.request('DELETE', path); }

  async request(method, path, { params, body } = {}) {
    const url = `${this.baseUrl}${path}${buildQuery(params)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const hasBody = body !== undefined;

    let response;
    try {
      response = await this.fetchImpl(url, {
        method,
        headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
        body: hasBody ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Сервер не відповів вчасно. Спробуйте ще раз.', { code: 'TIMEOUT' });
      }
      throw new ApiError('Не вдалося зʼєднатися із сервером. Перевірте, що серверну частину запущено.', { code: 'NETWORK_ERROR' });
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 204) return null;

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      // тіло відповіді порожнє або не JSON
    }

    if (!response.ok) {
      const err = payload?.error;
      throw new ApiError(err?.message || `Помилка сервера (${response.status})`, {
        status: response.status,
        code: err?.code || 'HTTP_ERROR',
        details: err?.details || [],
      });
    }
    return payload;
  }
}
