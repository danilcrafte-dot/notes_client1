// Простий DI-контейнер: залежності реєструються за іменем, а клас отримує їх у конструкторі
// одним об'єктом ({ apiClient, storage }). Контейнер створює їх сам (singleton за замовчуванням).
export class Container {
  constructor() {
    this.registrations = new Map();
    this.singletons = new Map();
    this.resolving = [];
    this.cradle = new Proxy({}, {
      get: (_, name) => (typeof name === 'symbol' ? undefined : this.resolve(name)),
    });
  }

  register(name, factory, { singleton = true } = {}) {
    this.registrations.set(name, { factory, singleton });
    return this;
  }

  registerClass(name, Class, options) {
    return this.register(name, (cradle) => new Class(cradle), options);
  }

  registerValue(name, value) {
    return this.register(name, () => value);
  }

  resolve(name) {
    const reg = this.registrations.get(name);
    if (!reg) throw new Error(`Залежність '${String(name)}' не зареєстровано`);
    if (reg.singleton && this.singletons.has(name)) return this.singletons.get(name);
    if (this.resolving.includes(name)) {
      throw new Error(`Циклічна залежність: ${[...this.resolving, name].join(' -> ')}`);
    }
    this.resolving.push(name);
    try {
      const instance = reg.factory(this.cradle);
      if (reg.singleton) this.singletons.set(name, instance);
      return instance;
    } finally {
      this.resolving.pop();
    }
  }
}
