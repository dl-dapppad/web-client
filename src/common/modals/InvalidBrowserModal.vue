<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

import { Modal, AppButton } from '@/common'

defineProps<{
  isShown: boolean
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'invalid-browser.title': 'Connect your wallet',
      'invalid-browser.description':
        'To continue, open the page in the MetaMask app on your phone.',
      'invalid-browser.btn': 'Go to Metamask',
    },
  },
})

const openMetamaskBrowser = () =>
  window.open(
    `https://metamask.app.link/dapp/${window.location.host}`,
    '_blank',
    'noopener',
  )
</script>

<template>
  <modal :is-shown="isShown" class="invalid-browser-modal">
    <template #default="{ modal }">
      <div class="invalid-browser-modal__content">
        <div class="invalid-browser-modal__title-wrp">
          <div class="invalid-browser-modal__title">
            {{ t('invalid-browser.title') }}
          </div>
          <app-button
            class="invalid-browser-modal__close"
            size="small"
            scheme="default"
            :icon-right="$icons.x"
            @click="modal.close"
          />
        </div>
        <p class="invalid-browser-modal__message">
          {{ t('invalid-browser.description') }}
        </p>
        <app-button
          class="invalid-browser-modal__button"
          :text="t('invalid-browser.btn')"
          @click="openMetamaskBrowser"
        />
      </div>
    </template>
  </modal>
</template>

<style lang="scss" scoped>
.invalid-browser-modal__content {
  display: flex;
  flex-direction: column;
  padding: toRem(20) var(--app-padding-right) toRem(20) var(--app-padding-left);
  gap: toRem(30);
}

.invalid-browser-modal__title-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.invalid-browser-modal__title {
  font-family: var(--app-font-family-secondary);
  font-size: toRem(20);
  font-weight: 700;
  letter-spacing: 0.1em;
}

.invalid-browser-modal__close {
  padding: 0;
}

.invalid-browser-modal__message {
  font-size: toRem(14);
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
