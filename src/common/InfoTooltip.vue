<script lang="ts" setup>
import { Icon } from '@/common'

defineProps<{
  text: string
}>()
</script>

<template>
  <div class="info-tooltip">
    <icon class="info-tooltip__icon" :name="$icons.informationCircleFilled" />
    <div class="info-tooltip__message">
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
  bottom: 150%;
  left: 50%;
  min-width: toRem(200);
  display: none;
  justify-content: center;
  transform: translateX(-50%);

  &:before {
    content: '';
    position: absolute;
    padding: toRem(7);
    background-color: var(--secondary-main);
    bottom: -#{toRem(7)};
    transform: rotate(45deg);
  }
}

.info-tooltip {
  color: var(--text-secondary-main);
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
  height: toRem(12);
  width: toRem(12);
}
</style>
