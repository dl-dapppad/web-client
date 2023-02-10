<script lang="ts" setup>
import { AppNavbar, AppFooter } from '@/common'

import { ref, watch } from 'vue'
import { useNotifications } from '@/composables'
import { config } from '@config'
import { useWeb3ProvidersStore, useContractsStore } from '@/store'
import { ErrorHandler } from '@/helpers'
import { PROVIDERS } from '@/enums'

const isAppInitialized = ref(false)

const web3Store = useWeb3ProvidersStore()
const contracts = useContractsStore()

const init = async () => {
  try {
    useNotifications()
    await web3Store.detectProviders()

    const metamaskProvider = web3Store.providers.find(
      provider => provider.name === PROVIDERS.metamask,
    )

    if (metamaskProvider) await web3Store.provider.init(metamaskProvider)

    if (
      !metamaskProvider ||
      !web3Store.isCurrentChainAvailable ||
      !web3Store.provider.isConnected
    ) {
      const infuraProvider = web3Store.providers.find(
        provider => provider.name === PROVIDERS.rpc,
      )

      if (infuraProvider) await web3Store.provider.init(infuraProvider)
    }

    document.title = config.APP_NAME
  } catch (error) {
    ErrorHandler.process(error)
  }
  isAppInitialized.value = true
}

watch(
  () => web3Store.provider.chainId,
  () => contracts.load(),
)

init()
</script>

<template>
  <div v-if="isAppInitialized" class="app__container">
    <app-navbar class="app__navbar" />
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component class="app__main" :is="Component" />
      </transition>
    </router-view>
    <app-footer class="app__footer" />
  </div>
</template>

<style lang="scss" scoped>
.app__container {
  overflow: hidden;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  flex: 1;
}

.app__main {
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
}

.fade-enter-active {
  animation: fade-in 0.25s;
}

.fade-leave-active {
  animation: fade-in 0.25s reverse;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
