<template>
  <div class="toast_container" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="item in toasts"
        :key="item.id"
        class="toast"
        :class="item.type"
        :role="item.type === 'error' ? 'alert' : 'status'"
        @click="dismissToast(item.id)"
      >
        {{ item.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { toasts, dismissToast } from "../services/toast";

export default {
  name: "Toast_container",
  data() {
    return {
      toasts,
    };
  },
  methods: {
    dismissToast,
  },
};
</script>

<style scoped>
.toast_container {
  position: fixed;
  top: 75px; /* Below the fixed menu */
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: min(360px, calc(100vw - 40px));
}

.toast {
  font-family: "Montserrat", sans-serif;
  font-size: 0.95rem;
  padding: 12px 16px;
  border-radius: 10px;
  border-left: 5px solid;
  background-color: #f0e9d7;
  color: #243e36;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.toast.success {
  border-color: #243e36;
}

.toast.error {
  border-color: #b3261e;
  color: #7a1a14;
}

.toast.info {
  border-color: #7a8b84;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 800px) {
  .toast_container {
    top: 70px; /* Below the compact mobile menu bar */
    right: 50%;
    transform: translateX(50%);
  }
}
</style>
