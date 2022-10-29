<script lang="ts" setup>
import { AppLogo, Icon, AppButton, Dropdown } from '@/common'
import { InputField } from '@/fields'

import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler, formatNumber, cropAddress } from '@/helpers'
import { computed, ref } from 'vue'
import { ETHEREUM_CHAINS } from '@/enums'
import { localizeChain } from '@/localization'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const searchInput = ref('')

const farmBalance = computed(() => ({
  amount: 12345.12345,
  asset: 'DAPP',
}))

const walletBalance = computed(() => ({
  amount: 12345.12345,
  asset: 'ETH',
}))

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
</script>

<template>
  <div class="app-navbar">
    <app-logo class="app-navbar__logo" />
    <template v-if="provider.isConnected">
      <div class="app-navbar__farm-farm-balance">
        <span class="app-navbar__farm-farm-balance-amount">
          <icon
            class="app-navbar__farm-farm-balance-icon"
            :name="$icons.shoppingCart"
          />
          {{ formatNumber(farmBalance.amount) }}
          {{ farmBalance.asset }}
        </span>
        <app-button :text="$t('app-navbar.farm-link')" size="small" />
      </div>
      <input-field
        class="app-navbar___search"
        v-model="searchInput"
        :placeholder="$t('app-navbar.search-placeholder')"
        scheme="secondary"
      >
        <template #nodeRight>
          <icon class="app-navbar___search-icon" :name="$icons.search" />
        </template>
      </input-field>
      <dropdown class="app-navbar__chain">
        <template #head="{ dropdown }">
          <app-button
            class="app-navbar__chain-btn"
            size="small"
            :text="localizeChain(provider.chainId)"
            :icon-right="
              dropdown.isOpen ? $icons.chevronUp : $icons.chevronDown
            "
            @click="dropdown.toggle"
          />
        </template>
        <template #default>
          <div class="app-navbar__chain-body">
            <app-button
              v-for="chain in ETHEREUM_CHAINS"
              :key="chain"
              class="app-navbar__chain-item"
              :text="localizeChain(chain)"
              @click="trySwitchChain(chain)"
            />
          </div>
        </template>
      </dropdown>
      <div class="app-navbar__wallet">
        <span class="app-navbar__wallet-balance">
          {{ formatNumber(walletBalance.amount) }}
          {{ walletBalance.asset }}
        </span>
        <span class="app-navbar__wallet-address">
          {{ cropAddress(provider.selectedAddress) }}
        </span>
      </div>
    </template>
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
  gap: toRem(10);

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.app-navbar__logo {
  max-width: toRem(70);
}

.app-navbar__farm-farm-balance {
  display: flex;
  height: 100%;
}

.app-navbar__farm-farm-balance-amount {
  display: flex;
  align-items: center;
  text-transform: uppercase;
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
}

.app-navbar___search {
  height: 100%;
}

.app-navbar___search-icon {
  width: toRem(14);
  height: toRem(14);
}

.app-navbar__chain {
  min-width: toRem(200);
}

.app-navbar__chain-btn {
  justify-content: space-between;
  width: 100%;
}

.app-navbar__chain-body {
  top: 0;
  left: 0;
}

.app-navbar__chain-item {
  justify-content: space-between;
  width: 100%;
}

.app-navbar__wallet {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-size: toRem(12);
  line-height: 1;
  font-weight: 700;
  border: toRem(1) solid var(--border-secondary-main);
  height: 100%;
}

.app-navbar__wallet-balance {
  padding: toRem(10);
}

.app-navbar__wallet-address {
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: toRem(1) solid var(--border-secondary-main);
  background: var(--background-secondary);
  height: calc(100% - #{toRem(2)});
  margin-right: toRem(1);
  padding: toRem(10);
}

.app-navbar__provider-btn {
  margin-left: auto;
}
</style>
