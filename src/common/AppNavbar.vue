<script lang="ts" setup>
import { AppLogo, AppButton } from '@/common'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler } from '@/helpers'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const handleProviderBtnClick = () => {
  try {
    if (provider.value.selectedAddress) {
      provider.value.disconnect()
    } else {
      provider.value.connect()
    }
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<template>
  <div class="app-navbar">
    <app-logo class="app-navbar__logo" />
    <app-button
      class="app-navbar__provider-btn"
      size="small"
      :text="
        !provider.selectedAddress ? $t('app-navbar.connect-btn') : undefined
      "
      :icon-right="provider.selectedAddress ? $icons.logout : undefined"
      @click="handleProviderBtnClick"
    />
  </div>
</template>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  padding: toRem(10) var(--app-padding-right) toRem(10) var(--app-padding-left);
  background: var(--background-primary);
  border-bottom: toRem(1) solid var(--border-primary-main);

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.app-navbar__logo {
  max-width: toRem(70);
}

.app-navbar__provider-btn {
  margin-left: auto;
}
</style>
