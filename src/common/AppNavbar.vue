<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { AppLogo, Icon, AppButton, Dropdown, MenuDrawer } from '@/common'
import { useErc20 } from '@/composables'
import { formatAmount, getChain, getEmptyChain, cropAddress } from '@/helpers'
import { Chain } from '@/types'
import { InputField } from '@/fields'

import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore, useAccountStore } from '@/store'
import { ErrorHandler, isChainAvailable } from '@/helpers'
import { CONTRACT_NAMES, ETHEREUM_CHAINS, WINDOW_BREAKPOINTS } from '@/enums'
import { localizeChain } from '@/localization'
import { config } from '@/config'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { account } = storeToRefs(useAccountStore())

const { width: windowWidth } = useWindowSize()

const dapp = useErc20()

const searchInput = ref('')
const chain = ref<Chain>(getEmptyChain())
const accountAddress = ref()

const init = async () => {
  if (
    !provider.value.isConnected ||
    !provider.value.chainId ||
    !isChainAvailable(provider.value.chainId)
  ) {
    return
  }
  chain.value = getChain(provider.value.chainId)
  accountAddress.value = provider.value.selectedAddress

  dapp.init(config.CONTRACTS[provider.value.chainId][CONTRACT_NAMES.DAPP])
  await dapp.loadDetails()
}

const trySwitchChain = async (chainId: string | number) => {
  try {
    await provider.value.switchChain(chainId)
  } catch (error) {
    ErrorHandler.process(error)
  }
}

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

watch(
  () => provider.value.selectedAddress,
  () => {
    init()
  },
)

const isProviderButtonShown = computed(
  () =>
    windowWidth.value >= WINDOW_BREAKPOINTS.medium ||
    !provider.value.selectedAddress,
)

init()
</script>

<template>
  <div class="app-navbar">
    <div class="app-navbar__logo-wrp">
      <icon
        class="app-navbar__search-icon-mobile"
        :name="$icons.searchFilled"
      />
      <app-logo class="app-navbar__logo" />
    </div>
    <template v-if="provider.isConnected">
      <div class="app-navbar__farm-farm-balance">
        <span class="app-navbar__farm-farm-balance-amount">
          <icon
            class="app-navbar__farm-farm-balance-icon"
            :name="$icons.gift"
          />
          {{
            formatAmount(
              account.dappBalance,
              dapp?.decimals.value,
              dapp?.symbol.value,
            )
          }}
        </span>
        <app-button
          :text="$t('app-navbar.farm-link')"
          size="small"
          :route="{ name: $routes.farming }"
        />
      </div>
      <input-field
        class="app-navbar__search"
        v-model="searchInput"
        :placeholder="$t('app-navbar.search-placeholder')"
        scheme="secondary"
      >
        <template #nodeRight>
          <icon class="app-navbar__search-icon" :name="$icons.searchFilled" />
        </template>
      </input-field>
      <dropdown class="app-navbar__chain">
        <template #head="{ dropdown }">
          <app-button
            class="app-navbar__chain-btn"
            :class="{ 'app-navbar__chain-btn--active': dropdown.isOpen }"
            size="small"
            :text="localizeChain(provider.chainId)"
            :icon-left="$icons.circleFilled"
            :icon-right="
              dropdown.isOpen ? $icons.chevronUp : $icons.chevronDown
            "
            @click="dropdown.toggle"
          />
        </template>
        <template #default>
          <div class="app-navbar__dropdown-body">
            <app-button
              v-for="chainName in ETHEREUM_CHAINS"
              :key="chainName"
              class="app-navbar__chain-item"
              color="tertiary"
              :text="localizeChain(chainName)"
              :icon-left="$icons.circleFilled"
              @click="trySwitchChain(chainName)"
            />
          </div>
        </template>
      </dropdown>
      <div class="app-navbar__wallet">
        <span class="app-navbar__wallet-balance">
          {{
            formatAmount(account.nativeBalance, chain?.decimals, chain?.symbol)
          }}
        </span>
        <span class="app-navbar__wallet-address">
          {{ cropAddress(provider.selectedAddress ?? '') }}
          <icon
            class="app-navbar__wallet-address-icon"
            :name="$icons.circleFilled"
          />
        </span>
      </div>
    </template>
    <app-button
      v-if="isProviderButtonShown"
      class="app-navbar__provider-btn"
      size="small"
      :text="
        !provider.selectedAddress ? $t('app-navbar.connect-btn') : undefined
      "
      :icon-right="provider.selectedAddress ? $icons.logout : undefined"
      @click="handleProviderBtnClick"
    />
    <div v-if="provider.selectedAddress" class="app-navbar__menu-farming-wrp">
      <icon class="app-navbar__farming-btn-icon" :name="$icons.gift" />
      <menu-drawer
        class="app-navbar__menu-drawer"
        @try-switch-chain="trySwitchChain"
        @provider-btn-click="handleProviderBtnClick"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  padding: toRem(10) var(--app-padding-right) toRem(10) var(--app-padding-left);
  background: var(--background-primary);
  border-bottom: toRem(1) solid var(--border-primary-main);
  gap: toRem(10);

  @include respond-to(xmedium) {
    justify-content: space-between;
  }

  @include respond-to(medium) {
    padding: toRem(25) var(--app-padding-right) toRem(25)
      var(--app-padding-left);
  }
}

.app-navbar__logo-wrp {
  display: flex;
  align-items: center;
  gap: toRem(20);
}

.app-navbar__logo {
  max-width: toRem(70);
}

.app-navbar__search-icon-mobile {
  width: toRem(14);
  height: toRem(14);
  min-width: toRem(14);
  min-height: toRem(14);
}

.app-navbar__farm-farm-balance {
  display: flex;
  height: 100%;

  @include respond-to(medium) {
    display: none;
  }
}

.app-navbar__farm-farm-balance-amount {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  white-space: nowrap;
  gap: toRem(12);
  background: var(--background-secondary);
  border: toRem(1) solid var(--border-secondary-main);
  padding: toRem(10);
  font-size: toRem(12);
  line-height: 1;
  font-weight: 700;
}

.app-navbar__farm-farm-balance-icon {
  width: toRem(14);
  height: toRem(14);
  min-width: toRem(14);
  min-height: toRem(14);
}

.app-navbar__search {
  height: 100%;
  display: grid;

  @include respond-to(xmedium) {
    display: none;
  }
}

.app-navbar__search-icon {
  width: toRem(14);
  height: toRem(14);
  min-height: toRem(14);
  min-width: toRem(14);

  &--tablet {
    display: none;

    @include respond-to(xmedium) {
      display: block;
    }
  }
}

.app-navbar__chain {
  min-width: toRem(200);

  @include respond-to(medium) {
    display: none;
  }
}

.app-navbar__chain-btn {
  justify-content: space-between;
  width: 100%;

  &--active {
    background-color: var(--secondary-main);

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      background-color: var(--secondary-main);
    }
  }
}

.app-navbar__dropdown-body {
  top: 0;
  left: 0;

  &--search {
    background-color: var(--secondary-main);
    width: 100vw;
  }
}

.app-navbar__chain-item {
  justify-content: start;
  width: 100%;
  padding: toRem(16) toRem(24);
}

.app-navbar__wallet {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  line-height: 1;
  font-weight: 700;
  border: toRem(1) solid var(--border-secondary-main);
  height: 100%;

  @include respond-to(medium) {
    display: none;
  }
}

.app-navbar__wallet-balance {
  padding: toRem(10);
  font-size: toRem(12);
  white-space: nowrap;
}

.app-navbar__wallet-address {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: toRem(10);
  border-left: toRem(1) solid var(--border-secondary-main);
  background: var(--background-secondary);
  height: calc(100% - #{toRem(2)});
  margin-right: toRem(1);
  padding: toRem(10);
  font-size: toRem(12);
}

.app-navbar__wallet-address-icon {
  height: toRem(16);
  width: toRem(16);
  min-height: toRem(16);
  min-width: toRem(16);
}

.app-navbar__provider-btn {
  margin-left: auto;

  @include respond-to(xmedium) {
    margin: 0;
  }
}

.app-navbar__menu-farming-wrp {
  display: none;
  gap: toRem(35);

  @include respond-to(medium) {
    display: flex;
  }
}

.app-navbar__farming-btn-icon {
  height: toRem(16);
  width: toRem(16);
}
</style>
