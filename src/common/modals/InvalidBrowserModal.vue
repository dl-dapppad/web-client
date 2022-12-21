<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

import { Modal, AppButton } from '@/common'
import { WINDOW_BREAKPOINTS } from '@/enums'

defineProps<{
  isShown: boolean
}>()

enum EVENTS {
  updateIsShown = 'update:is-shown',
}

const { width: windowWidth } = useWindowSize()

const isMobile = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.medium)

const emit = defineEmits<{
  (e: EVENTS.updateIsShown, value: boolean): void
}>()

const updateIsShown = (val: boolean) => {
  emit(EVENTS.updateIsShown, val)
}

const closeModal = () => {
  emit(EVENTS.updateIsShown, false)
}

const openMetamaskBrowser = () =>
  window.open(
    `https://metamask.app.link/dapp/${window.location.host}`,
    '_blank',
    'noopener',
  )
</script>

<template>
  <modal
    :is-shown="isShown && isMobile"
    @update:is-shown="updateIsShown"
    class="invalid-browser-modal"
  >
    <div class="invalid-browser-modal__content">
      <app-button
        size="small"
        scheme="default"
        :icon-right="$icons.x"
        @click="closeModal"
      />
      <p class="invalid-browser-modal__message">
        {{ $t('invalid-browser-modal.message') }}
      </p>
      <app-button
        class="invalid-browser-modal__button"
        :text="$t('invalid-browser-modal.go-to-metamask-btn')"
        @click="openMetamaskBrowser"
      />
      <app-button
        class="invalid-browser-modal__button"
        :text="$t('invalid-browser-modal.close-modal-btn')"
        icon-name="arrow-left"
        is-icon-left
        @click="closeModal"
      />
    </div>
  </modal>
</template>

<style lang="scss" scoped>
.invalid-browser-modal__content {
  padding: toRem(20) var(--app-padding-right) toRem(20) var(--app-padding-left);
}

.invalid-browser-modal__button {
  margin-top: toRem(30);

  & + & {
    margin-top: toRem(10);
  }

  @include respond-to(medium) {
    width: 100%;
  }
}
</style>
