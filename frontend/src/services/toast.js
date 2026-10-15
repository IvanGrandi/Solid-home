import { reactive } from "vue";

// Small app-wide toast notifications, shown by components/Toast_container.vue
export const toasts = reactive([]);

let nextId = 1;

function show(message, type, duration = 3500) {
  const id = nextId++;
  toasts.push({ id, message, type });
  setTimeout(() => dismissToast(id), duration);
}

export function dismissToast(id) {
  const index = toasts.findIndex((toast) => toast.id === id);
  if (index !== -1) toasts.splice(index, 1);
}

export const toast = {
  success: (message) => show(message, "success"),
  error: (message) => show(message, "error", 5000),
  info: (message) => show(message, "info"),
};
