import test from 'node:test';
import assert from 'node:assert';
import { ApiClient, buildQuery } from '../src/services/ApiClient.js';
import { ApiError } from '../src/services/ApiError.js';
import { NotesService } from '../src/services/NotesService.js';
import { CategoriesService } from '../src/services/CategoriesService.js';

const config = { apiUrl: '/api/', requestTimeoutMs: 50 };
const json = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });

function makeClient(handler) {
  const calls = [];
  const fetchImpl = async (url, options) => { calls.push({ url, options }); return handler(url, options); };
  return { client: new ApiClient({ config, fetchImpl }), calls };
}

test('buildQuery пропускає порожні значення', () => {
  assert.strictEqual(buildQuery({ a: 1, b: '', c: null, d: undefined, e: 'x y' }), '?a=1&e=x+y');
  assert.strictEqual(buildQuery({}), '');
});

test('GET: формує URL з параметрами без зайвого слеша', async () => {
  const { client, calls } = makeClient(() => json(200, { data: [] }));
  await client.get('/notes', { page: 2, search: '' });
  assert.strictEqual(calls[0].url, '/api/notes?page=2');
  assert.strictEqual(calls[0].options.method, 'GET');
});

test('POST: відправляє JSON із заголовком', async () => {
  const { client, calls } = makeClient(() => json(201, { id: 1 }));
  const res = await client.post('/notes', { title: 'T' });
  assert.deepStrictEqual(res, { id: 1 });
  assert.strictEqual(calls[0].options.body, '{"title":"T"}');
  assert.strictEqual(calls[0].options.headers['Content-Type'], 'application/json');
});

test('204 повертає null', async () => {
  const { client } = makeClient(() => ({ status: 204, ok: true }));
  assert.strictEqual(await client.delete('/notes/1'), null);
});

test('помилка сервера перетворюється на ApiError із полями', async () => {
  const body = { error: { code: 'VALIDATION_ERROR', message: 'Помилка', details: [{ field: 'title', message: 'Обов’язкове' }] } };
  const { client } = makeClient(() => json(400, body));
  await assert.rejects(client.post('/notes', {}), (err) => {
    assert.ok(err instanceof ApiError);
    assert.strictEqual(err.status, 400);
    assert.strictEqual(err.code, 'VALIDATION_ERROR');
    assert.deepStrictEqual(err.fieldErrors, { title: 'Обов’язкове' });
    assert.strictEqual(err.isNetworkError, false);
    return true;
  });
});

test('відповідь без JSON при помилці - загальне повідомлення', async () => {
  const { client } = makeClient(() => ({ status: 502, ok: false, json: async () => { throw new Error('not json'); } }));
  await assert.rejects(client.get('/notes'), (err) => err.status === 502 && /502/.test(err.message));
});

test('мережева помилка -> NETWORK_ERROR', async () => {
  const { client } = makeClient(() => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(client.get('/notes'), (err) => err.code === 'NETWORK_ERROR' && err.isNetworkError);
});

test('таймаут -> TIMEOUT', async () => {
  const { client } = makeClient((url, { signal }) => new Promise((_, reject) => {
    signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
  }));
  await assert.rejects(client.get('/notes'), (err) => err.code === 'TIMEOUT' && err.isNetworkError);
});

test('NotesService викликає правильні ендпоінти', async () => {
  const { client, calls } = makeClient(() => json(200, {}));
  const notes = new NotesService({ apiClient: client });
  await notes.list({ page: 1 });
  await notes.get(5);
  await notes.update(5, { title: 'x' });
  await notes.patch(5, { title: 'y' });
  await notes.remove(5);
  assert.deepStrictEqual(calls.map((c) => `${c.options.method} ${c.url}`), [
    'GET /api/notes?page=1', 'GET /api/notes/5', 'PUT /api/notes/5', 'PATCH /api/notes/5', 'DELETE /api/notes/5',
  ]);
});

test('CategoriesService.list розгортає { data }', async () => {
  const { client } = makeClient(() => json(200, { data: [{ id: 1, name: 'A' }] }));
  const categories = new CategoriesService({ apiClient: client });
  assert.deepStrictEqual(await categories.list(), [{ id: 1, name: 'A' }]);
});
