<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { Icon } from '@/common'
import { cropAddress, copyToClipboard } from '@/helpers'

const { provider } = storeToRefs(useWeb3ProvidersStore())

withDefaults(
  defineProps<{
    address: string
    href?: string
    isCropped?: boolean
    isCopyable?: boolean
  }>(),
  {
    isCropped: true,
    isCopyable: true,
    href: '',
  },
)
</script>

<template>
  <div class="link-copy app__link-wrp" :title="address">
    <a
      class="app__link"
      :href="href ? href : provider.getAddressUrl(address)"
      target="_blank"
      v-bind="$attrs"
    >
      {{ isCropped ? cropAddress(address) : address }}
    </a>
    <button
      v-if="isCopyable"
      class="app__link-icon-wrp"
      @click="copyToClipboard(address)"
    >
      <icon class="app__link-icon" :name="$icons.duplicateFilled" />
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
