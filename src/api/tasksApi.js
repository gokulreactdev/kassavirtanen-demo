async function request(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const tasksApi = {
  getTasks: () => request('/api/tasks'),
  createTask: (payload) =>
    request('/api/tasks', { method: 'POST', body: JSON.stringify(payload) }),
};