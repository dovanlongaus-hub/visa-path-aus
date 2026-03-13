/**
 * localStorageClient.test.js — Tests for localStorage fallback client
 */

import { describe, it, expect, beforeEach } from 'vitest';

// ─── Mock localStorage ─────────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });

// ─── Inline implementation (mirrors localStorageClient.js) ─

const PREFIX = 'visapath_';

function getKey(table, userId) { return `${PREFIX}${table}_${userId || 'guest'}`; }
function readAll(table, userId) {
  try { return JSON.parse(localStorage.getItem(getKey(table, userId)) || '[]'); }
  catch { return []; }
}
function writeAll(table, userId, rows) {
  localStorage.setItem(getKey(table, userId), JSON.stringify(rows));
}
function uuid() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

function makeLocalEntity(tableName) {
  return {
    async list() {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      return readAll(tableName, uid);
    },
    async create(data) {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      const rows = readAll(tableName, uid);
      const row = { ...data, id: uuid(), created_at: new Date().toISOString() };
      rows.push(row);
      writeAll(tableName, uid, rows);
      return row;
    },
    async update(id, data) {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      const rows = readAll(tableName, uid);
      const idx = rows.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('Not found');
      rows[idx] = { ...rows[idx], ...data, updated_at: new Date().toISOString() };
      writeAll(tableName, uid, rows);
      return rows[idx];
    },
    async delete(id) {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      const rows = readAll(tableName, uid).filter(r => r.id !== id);
      writeAll(tableName, uid, rows);
    },
    async filter(conditions = {}) {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      let rows = readAll(tableName, uid);
      Object.entries(conditions).forEach(([k, v]) => {
        if (k !== 'user_id') rows = rows.filter(r => r[k] === v);
      });
      return rows;
    },
  };
}

// ─── Tests ────────────────────────────────────────────────

describe('LocalStorage Entity CRUD', () => {
  let entity;

  beforeEach(() => {
    localStorage.clear();
    entity = makeLocalEntity('test_items');
  });

  it('starts with empty list', async () => {
    const items = await entity.list();
    expect(items).toEqual([]);
  });

  it('creates a record', async () => {
    const item = await entity.create({ name: 'test', value: 42 });
    expect(item.name).toBe('test');
    expect(item.value).toBe(42);
    expect(item.id).toBeTruthy();
    expect(item.created_at).toBeTruthy();
  });

  it('lists created records', async () => {
    await entity.create({ name: 'item1' });
    await entity.create({ name: 'item2' });
    const items = await entity.list();
    expect(items).toHaveLength(2);
    expect(items.map(i => i.name)).toContain('item1');
    expect(items.map(i => i.name)).toContain('item2');
  });

  it('updates a record', async () => {
    const created = await entity.create({ name: 'original' });
    const updated = await entity.update(created.id, { name: 'updated' });
    expect(updated.name).toBe('updated');
    expect(updated.updated_at).toBeTruthy();
  });

  it('deletes a record', async () => {
    const item = await entity.create({ name: 'to-delete' });
    await entity.delete(item.id);
    const items = await entity.list();
    expect(items.find(i => i.id === item.id)).toBeUndefined();
  });

  it('filters by field', async () => {
    await entity.create({ status: 'active', name: 'A' });
    await entity.create({ status: 'inactive', name: 'B' });
    await entity.create({ status: 'active', name: 'C' });
    const active = await entity.filter({ status: 'active' });
    expect(active).toHaveLength(2);
    expect(active.every(i => i.status === 'active')).toBe(true);
  });

  it('data persists across entity calls (same localStorage)', async () => {
    await entity.create({ name: 'persistent' });
    const entity2 = makeLocalEntity('test_items');
    const items = await entity2.list();
    expect(items[0].name).toBe('persistent');
  });

  it('update throws if id not found', async () => {
    await expect(entity.update('nonexistent-id', { name: 'x' })).rejects.toThrow('Not found');
  });
});

describe('LocalStorage key isolation', () => {
  beforeEach(() => localStorage.clear());

  it('different tables do not share data', async () => {
    const bookmarks = makeLocalEntity('bookmarks');
    const plans = makeLocalEntity('plans');
    await bookmarks.create({ url: 'https://example.com' });
    const planItems = await plans.list();
    expect(planItems).toHaveLength(0);
  });
});
