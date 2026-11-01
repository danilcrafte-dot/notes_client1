// Обгортка над localStorage (браузерний API): префікс ключів, JSON, захист від помилок.
// Якщо localStorage недоступний, дані тимчасово зберігаються в пам'яті.
export class StorageService {
  constructor({ config, storageBackend }) {
    this.prefix = config.storagePrefix;
    this.backend = storageBackend;
    this.memory = new Map();
  }

  get(key, fallback = null) {
    const fullKey = this.prefix + key;
    try {
      const raw = this.backend ? this.backend.getItem(fullKey) : (this.memory.get(fullKey) ?? null);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback; // пошкоджений JSON або заборонений доступ
    }
  }

  set(key, value) {
    const fullKey = this.prefix + key;
    const raw = JSON.stringify(value);
    try {
      if (this.backend) this.backend.setItem(fullKey, raw);
      else this.memory.set(fullKey, raw);
    } catch {
      this.memory.set(fullKey, raw); // переповнення квоти тощо
    }
  }

  remove(key) {
    const fullKey = this.prefix + key;
    this.memory.delete(fullKey);
    try {
      if (this.backend) this.backend.removeItem(fullKey);
    } catch {
      // ігноруємо
    }
  }
}
