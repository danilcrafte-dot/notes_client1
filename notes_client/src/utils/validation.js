// Клієнтська валідація (дзеркалить правила сервера). Повертає { поле: повідомлення }.
export function validateNote({ title, content }) {
  const errors = {};
  if (!title.trim()) errors.title = 'Заголовок обов’язковий';
  else if (title.trim().length > 200) errors.title = 'Не більше 200 символів';
  if (content.length > 10000) errors.content = 'Не більше 10000 символів';
  return errors;
}

export function validateName(name, max) {
  const errors = {};
  if (!name.trim()) errors.name = 'Назва обов’язкова';
  else if (name.trim().length > max) errors.name = `Не більше ${max} символів`;
  return errors;
}
