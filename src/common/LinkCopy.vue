<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useWeb3ProvidersStore } from '@/store'
import { Icon } from '@/common'
import { cropAddress, copyToClipboard, Bus } from '@/helpers'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = useI18n({ useScope: 'global' })

withDefaults(
  defineProps<{
    address: string
    href?: string
    isCropped?: boolean
    isCopyable?: boolean
    showFirstCroppSymbols?: number
  }>(),
  {
    isCropped: true,
    isCopyable: true,
    href: '',
    showFirstCroppSymbols: 5,
  },
)

const copy = (strToCopy: string): void => {
  copyToClipboard(strToCopy)
  Bus.info(t('link-copy.copied-msg'))
}
</script>

<template>
  <div class="link-copy app__link-wrp" :title="address">
    <a
      class="app__link"
      :href="href ? href : provider.getAddressUrl(address)"
      target="_blank"
      v-bind="$attrs"
    >
      {{ isCropped ? cropAddress(address, showFirstCroppSymbols) : address }}
    </a>
    <button v-if="isCopyable" class="app__link-icon-wrp" @click="copy(address)">
      <icon class="app__link-icon" :name="$icons.duplicateFilled" />
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
