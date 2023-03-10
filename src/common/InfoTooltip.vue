<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'

import { Icon } from '@/common'

defineProps<{
  text: string
  moveSide?: 'left' | 'center' | 'right'
}>()

const { width: windowWidth } = useWindowSize()

const tooltipElem = ref<HTMLElement | undefined>()
const isMobileMovingRight = ref<boolean>(false)
const isTotallyMovingRight = ref<boolean>(true)

onMounted(() => {
  if (!tooltipElem.value) return

  isMobileMovingRight.value =
    tooltipElem.value.getBoundingClientRect().left <= windowWidth.value / 2

  isTotallyMovingRight.value =
    tooltipElem.value.getBoundingClientRect().left < 100 &&
    tooltipElem.value.getBoundingClientRect().left !== 0
})
</script>

<template>
  <div class="info-tooltip" ref="tooltipElem">
    <icon class="info-tooltip__icon" :name="$icons.informationCircleFilled" />
    <div
      class="info-tooltip__message"
      :class="{
        'info-tooltip__message--totally-moving-right': isTotallyMovingRight,
        'info-tooltip__message--mobile-moving-right':
          ((isMobileMovingRight && moveSide === undefined) ||
            moveSide === 'right') &&
          !isTotallyMovingRight,
        'info-tooltip__message--mobile-moving-left':
          ((!isMobileMovingRight && moveSide === undefined) ||
            moveSide === 'left') &&
          !isTotallyMovingRight,
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
  font-family: var(--app-font-family-secondary);
  font-size: toRem(13);
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

  &--totally-moving-right {
    transform: translateX(-20%);

    &:before {
      transform: translateX(-#{toRem(75)}) rotate(45deg);
    }
  }

  @include respond-to(medium) {
    &--mobile-moving-right {
      transform: translateX(-20%);

      &:before {
        transform: translateX(-#{toRem(75)}) rotate(45deg);
      }
    }

    &--mobile-moving-left {
      transform: translateX(-80%);

      &:before {
        transform: translateX(#{toRem(75)}) rotate(45deg);
      }
    }
  }
}

.info-tooltip {
  color: var(--text-secondary-main);
  position: relative;
  padding: toRem(6);
  cursor: pointer;

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
