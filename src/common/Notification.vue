<script lang="ts" setup>
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

defineProps<{
  title: string
  message: string
  iconName: ICON_NAMES
  link?: {
    label: string
    href: string
  }
}>()
</script>

<template>
  <div class="notification">
    <icon class="notification__icon" :name="iconName" />
    <div class="notification__details">
      <h4 class="notification__title">
        {{ title }}
      </h4>
      <p class="notification__message">
        {{ message }}
      </p>
      <a
        v-if="link"
        class="notification__link"
        :href="link.href"
        target="_blank"
      >
        {{ link.label }}
      </a>
    </div>
  </div>
</template>

<style lang="scss">
@import 'vue-toastification/src/scss/index';

.Vue-Toastification__toast {
  border-radius: 0;
  background: var(--background-secondary);

  &--success {
    border: toRem(2) solid var(--success-main);
    color: var(--success-main);
  }

  &--error {
    border: toRem(2) solid var(--error-main);
    color: var(--error-main);
  }

  &--warning {
    border: toRem(2) solid var(--warning-main);
    color: var(--warning-main);
  }

  &--info {
    border: toRem(2) solid var(--info-main);
    color: var(--info-main);
  }
}

.Vue-Toastification__close-button {
  color: var(--text-secondary-dark);
  align-self: start;
  font-size: toRem(32);
}

.notification {
  display: grid;
  place-items: center;
  grid-template-columns: max-content 1fr;
  grid-gap: toRem(16);
}

.notification .notification__icon {
  align-self: start;
  max-width: toRem(28);
  max-height: toRem(28);
}

.notification__details {
  display: grid;
  grid-gap: toRem(4);
  width: 100%;
}

.notification__title {
  font-family: var(--app-font-family-secondary);
  font-size: toRem(24);
  color: var(--text-primary-main);
  font-weight: 700;
}

.notification__message {
  font-size: toRem(14);
  color: var(--text-primary-main);
}

.notification__link {
  color: var(--secondary-main);
}
</style>
