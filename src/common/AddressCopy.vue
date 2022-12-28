<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useWeb3ProvidersStore } from '@/store'
import { Icon } from '@/common'
import { cropAddress, copyToClipboard, Bus } from '@/helpers'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = useI18n({ useScope: 'global' })

const props = withDefaults(
  defineProps<{
    address: string
    prefix?: string
    href?: string
    isCropped?: boolean
    isCopyable?: boolean
    showFirstCroppSymbols?: number
    copyWithoutIcon?: boolean
  }>(),
  {
    prefix: '',
    isCropped: true,
    isCopyable: true,
    href: '',
    showFirstCroppSymbols: 5,
  },
)

const handleLinkClick = () => {
  if (props.copyWithoutIcon) {
    copy(props.address)
  }
}

const copy = (strToCopy: string): void => {
  copyToClipboard(strToCopy)
  Bus.info(t('address-copy.copied-msg'))
}
</script>

<template>
  <div class="address-copy app__link-wrp" :title="address">
    <a
      class="app__link address-copy__link"
      :href="
        !copyWithoutIcon
          ? href
            ? href
            : provider.getAddressUrl(address)
          : undefined
      "
      target="_blank"
      v-bind="$attrs"
      @click="handleLinkClick"
    >
      {{ prefix ?? '' }}
      {{ isCropped ? cropAddress(address, showFirstCroppSymbols) : address }}
    </a>
    <button
      v-if="isCopyable && !copyWithoutIcon"
      class="app__link-icon-wrp"
      @click="copy(address)"
    >
      <icon class="app__link-icon" :name="$icons.duplicateFilled" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.address-copy__link {
  font-size: inherit;
}
</style>
