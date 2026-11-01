import test from 'node:test';
import assert from 'node:assert';
import { excerpt, formatDate, pluralize } from '../src/utils/format.js';
import { validateName, validateNote } from '../src/utils/validation.js';

test('pluralize: українські форми', () => {
  const f = ['нотатка', 'нотатки', 'нотаток'];
  const got = [0, 1, 2, 4, 5, 11, 12, 14, 21, 22, 25, 101].map((n) => pluralize(n, f));
  assert.deepStrictEqual(got, ['нотаток', 'нотатка', 'нотатки', 'нотатки', 'нотаток', 'нотаток', 'нотаток', 'нотаток', 'нотатка', 'нотатки', 'нотаток', 'нотатка']);
});

test('excerpt скорочує текст і прибирає переноси', () => {
  assert.strictEqual(excerpt('a\n\nb   c'), 'a b c');
  assert.strictEqual(excerpt('x'.repeat(200), 10), `${'x'.repeat(10)}…`);
  assert.strictEqual(excerpt(), '');
});

test('formatDate: некоректні значення дають порожній рядок', () => {
  assert.strictEqual(formatDate(''), '');
  assert.strictEqual(formatDate('не дата'), '');
  assert.ok(formatDate('2026-10-26T12:00:00.000Z').length > 5);
});

test('validateNote: порожній заголовок і межі довжини', () => {
  assert.ok(validateNote({ title: '  ', content: '' }).title);
  assert.deepStrictEqual(validateNote({ title: 'a'.repeat(200), content: '' }), {});
  assert.ok(validateNote({ title: 'a'.repeat(201), content: '' }).title);
  assert.ok(validateNote({ title: 'ok', content: 'x'.repeat(10001) }).content);
});

test('validateName: обов’язкова та обмежена назва', () => {
  assert.ok(validateName('', 100).name);
  assert.deepStrictEqual(validateName('Навчання', 100), {});
  assert.ok(validateName('a'.repeat(51), 50).name);
});
