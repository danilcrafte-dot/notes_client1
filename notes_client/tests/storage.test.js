import test from 'node:test';
import assert from 'node:assert';
import { StorageService } from '../src/services/StorageService.js';

const config = { storagePrefix: 'app:' };
const fakeBackend = () => {
  const data = new Map();
  return { data, getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) };
};

test('збереження й читання з префіксом ключа', () => {
  const backend = fakeBackend();
  const s = new StorageService({ config, storageBackend: backend });
  s.set('filters', { tag: 'a' });
  assert.ok(backend.data.has('app:filters'));
  assert.deepStrictEqual(s.get('filters'), { tag: 'a' });
});

test('відсутній ключ -> значення за замовчуванням', () => {
  const s = new StorageService({ config, storageBackend: fakeBackend() });
  assert.strictEqual(s.get('nope', 'x'), 'x');
});

test('пошкоджений JSON не ламає застосунок', () => {
  const backend = fakeBackend();
  backend.data.set('app:bad', '{not json');
  const s = new StorageService({ config, storageBackend: backend });
  assert.strictEqual(s.get('bad', 42), 42);
});

test('remove видаляє значення', () => {
  const s = new StorageService({ config, storageBackend: fakeBackend() });
  s.set('draft', 1);
  s.remove('draft');
  assert.strictEqual(s.get('draft'), null);
});

test('без localStorage дані зберігаються в пам’яті', () => {
  const s = new StorageService({ config, storageBackend: null });
  s.set('theme', 'dark');
  assert.strictEqual(s.get('theme'), 'dark');
});

test('помилка запису (квота) не викидається назовні', () => {
  const backend = { getItem: () => null, setItem: () => { throw new Error('QuotaExceeded'); }, removeItem() {} };
  const s = new StorageService({ config, storageBackend: backend });
  assert.doesNotThrow(() => s.set('k', 'v'));
});
