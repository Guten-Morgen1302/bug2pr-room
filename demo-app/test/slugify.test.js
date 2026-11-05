import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/slugify.js';

test('basic titles', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
  assert.equal(slugify('  A   B  '), 'a-b');
});

test('bug #1: a title with no ASCII letters must not give an empty slug', () => {
  assert.notEqual(slugify('日本語'), '');
});

test('bug #1: different non-ASCII titles must not collide', () => {
  assert.notEqual(slugify('日本語'), slugify('中文'));
});
