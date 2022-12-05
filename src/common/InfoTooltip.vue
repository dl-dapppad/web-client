<script lang="ts" setup>
import { Icon } from '@/common'

defineProps<{
  text: string
  moveRight?: boolean
  moveLeft?: boolean
}>()
</script>

<template>
  <div class="info-tooltip">
    <icon class="info-tooltip__icon" :name="$icons.informationCircleFilled" />
    <div
      class="info-tooltip__message"
      :class="{
        'info-tooltip__message--moved-right': moveRight,
        'info-tooltip__message--moved-left': moveLeft,
      }"
    >
      {{ text }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-tooltip__message {
  background-color: var(--secondary-main);
  color: var(--text-primary-invert-main);
  font-size: toRem(12);
  font-weight: 400;
  padding: toRem(12) toRem(24);
  position: absolute;
  bottom: 175%;
  left: 50%;
  width: toRem(250);
  display: none;
  justify-content: center;
  transform: translateX(-50%);
  letter-spacing: 0.1em;
  line-height: 1.3;

  &:before {
    content: '';
    position: absolute;
    padding: toRem(7);
    background-color: var(--secondary-main);
    bottom: -#{toRem(7)};
    transform: rotate(45deg);
  }

  &--moved-right {
    transform: translateX(-20%);

    &:before {
      transform: translateX(-#{toRem(75)}) rotate(45deg);
    }
  }

  &--moved-left {
    transform: translateX(-80%);

    &:before {
      transform: translateX(#{toRem(75)}) rotate(45deg);
    }
  }
}

.info-tooltip {
  color: var(--text-secondary-main);
  position: relative;
  padding: toRem(6);

  &:hover {
    background-color: var(--secondary-main);
    color: var(--text-primary-invert-main);

    & .info-tooltip__message {
      display: flex;
    }
  }
}

.info-tooltip__icon {
  min-height: toRem(12);
  min-width: toRem(12);
  max-height: toRem(12);
  max-width: toRem(12);
}
</style>
