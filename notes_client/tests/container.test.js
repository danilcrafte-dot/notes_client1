import test from 'node:test';
import assert from 'node:assert';
import { Container } from '../src/di/Container.js';
import { buildContainer } from '../src/di/container.js';

test('контейнер створює залежності та передає їх у конструктор', () => {
  class Repo { constructor({ config }) { this.url = config.url; } }
  class Service { constructor({ repo }) { this.repo = repo; } }
  const c = new Container();
  c.registerValue('config', { url: 'x' });
  c.registerClass('repo', Repo);
  c.registerClass('service', Service);
  assert.strictEqual(c.resolve('service').repo.url, 'x');
});

test('singleton та transient', () => {
  const c = new Container();
  c.register('a', () => ({}));
  c.register('b', () => ({}), { singleton: false });
  assert.strictEqual(c.resolve('a'), c.resolve('a'));
  assert.notStrictEqual(c.resolve('b'), c.resolve('b'));
});

test('відсутня та циклічна залежності', () => {
  const c = new Container();
  assert.throws(() => c.resolve('nope'), /не зареєстровано/);
  c.register('a', ({ b }) => b);
  c.register('b', ({ a }) => a);
  assert.throws(() => c.resolve('a'), /Циклічна залежність/);
});

test('buildContainer збирає всі сервіси застосунку', () => {
  const c = buildContainer({ apiUrl: '/api', requestTimeoutMs: 1000, storagePrefix: 't:' });
  for (const name of ['apiClient', 'notesService', 'categoriesService', 'tagsService', 'storage']) {
    assert.ok(c.resolve(name), name);
  }
  assert.strictEqual(c.resolve('notesService').api, c.resolve('apiClient'));
});
