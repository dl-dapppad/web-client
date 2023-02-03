<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

import {
  AppLogo,
  Icon,
  AppButton,
  Dropdown,
  MenuDrawer,
  AddressCopy,
  InvalidBrowserModal,
} from '@/common'
import { useProduct, useBreakpoints, useSystemContracts } from '@/composables'
import { formatAmount, ErrorHandler } from '@/helpers'
import { InputField } from '@/fields'
import { useWeb3ProvidersStore, useAccountStore } from '@/store'
import { ETHEREUM_CHAINS } from '@/enums'
import { localizeChain } from '@/localization'
import { config } from '@/config'

enum PROVIDER_TYPE {
  browser = 'browser',
  rpc = 'rpc',
}

const web3Store = useWeb3ProvidersStore()
const { provider } = storeToRefs(useWeb3ProvidersStore())
const { account } = storeToRefs(useAccountStore())

const systemContracts = useSystemContracts()
const composableProduct = useProduct()
const breakpoints = useBreakpoints()

const isMobileDrawerOpened = ref(false)
const isMobileSearchOpened = ref(false)

const isMobileModalMetamaskAppOpened = ref(false)

const addressSearchInput = ref('')
const selectedProvider = ref()

const isNavbarFixed = computed(
  () => isMobileDrawerOpened.value && breakpoints.isMedium.value,
)

const switchIsOpenedMobileState = (value?: boolean) => {
  value === false
    ? (isMobileDrawerOpened.value = false)
    : (isMobileDrawerOpened.value = !isMobileDrawerOpened.value)
  if (value === false || (value === undefined && !isMobileDrawerOpened.value))
    window.scrollTo(0, -1000000)
}

const closeMobileSearch = () => {
  isMobileSearchOpened.value = false
}

const openMobileSearch = () => {
  isMobileSearchOpened.value = true
}

const init = async () => {
  if (!provider.value.chainId || !web3Store.isCurrentChainAvailable) {
    return
  }

  const selectedAddress = provider.value.selectedAddress
  selectedProvider.value = selectedAddress
    ? PROVIDER_TYPE.browser
    : PROVIDER_TYPE.rpc

  await systemContracts.loadDetails()
}

const trySwitchChain = async (chainId: string | number) => {
  try {
    await provider.value.switchChain(chainId)
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const handleProviderBtnClick = async () => {
  try {
    await web3Store.connect()

    if (provider.value.selectedAddress) {
      selectedProvider.value = PROVIDER_TYPE.browser
    } else {
      selectedProvider.value = PROVIDER_TYPE.rpc
    }
  } catch (error) {
    if (breakpoints.isSmall.value) {
      isMobileModalMetamaskAppOpened.value = true
    } else {
      ErrorHandler.process(error)
    }
  }
}

const clickContractSearch = async () => {
  if (breakpoints.isMedium.value && !isMobileSearchOpened.value) return
  composableProduct.handleContractSearch(addressSearchInput.value)
}

watch(
  () => provider.value.selectedAddress,
  () => {
    init()
  },
)

const handleMobileSearchBtn = () => {
  isMobileSearchOpened.value ? clickContractSearch() : openMobileSearch()
}

const keypressHandleSearch = (e: KeyboardEvent) => {
  if (e.key === 'Enter') clickContractSearch()
}

init()
</script>

<template>
  <div class="app-navbar__wrp">
    <div
      class="app-navbar"
      :class="{
        'app-navbar--fixed': isNavbarFixed,
        'app-navbar--disconnected': !provider.selectedAddress,
      }"
    >
      <app-logo class="app-navbar__logo" />
      <div
        v-if="selectedProvider === PROVIDER_TYPE.browser"
        class="app-navbar__farm-farm-balance"
      >
        <span class="app-navbar__farm-farm-balance-amount">
          <icon
            class="app-navbar__farm-farm-balance-icon"
            :name="$icons.gift"
          />
          {{
            formatAmount(
              account.accountCashback,
              18,
              systemContracts.pointToken.symbol.value,
            )
          }}
        </span>
        <app-button
          :text="$t('app-navbar.farm-link')"
          size="small"
          :route="{ name: $routes.cashback }"
        />
      </div>
      <input-field
        class="app-navbar__search"
        v-model="addressSearchInput"
        :placeholder="$t('app-navbar.search-placeholder')"
        scheme="secondary"
        @keypress.stop="keypressHandleSearch"
      >
        <template #nodeRight>
          <app-button
            scheme="default"
            class="app-navbar__search-icon"
            :class="{
              'app-navbar__search-icon--inactive': !addressSearchInput,
            }"
            :icon-right="$icons.searchFilled"
            :disabled="!addressSearchInput"
            @click="clickContractSearch"
          />
        </template>
      </input-field>
      <div v-if="provider.selectedAddress" class="app-navbar__menu-wrp">
        <transition name="app-navbar__mobile-search-transition">
          <input-field
            class="app-navbar__search-mobile"
            :class="{
              'app-navbar__search-mobile--disconnected':
                !provider.selectedAddress,
            }"
            v-show="isMobileSearchOpened"
            v-model="addressSearchInput"
            :placeholder="$t('app-navbar.search-placeholder')"
            scheme="secondary"
            @keypress.stop="keypressHandleSearch"
          >
            <template #nodeLeft>
              <app-button
                class="app-navbar__search-mobile-close-btn"
                scheme="default"
                :icon-right="$icons.x"
                @click="closeMobileSearch"
              />
            </template>
            <template #nodeRight></template>
          </input-field>
        </transition>
        <div
          class="app-navbar__menu-wrp-item app-navbar__menu-wrp-item--search"
        >
          <app-button
            class="app-navbar__menu-wrp-item"
            scheme="default"
            :icon-right="$icons.searchFilled"
            :disabled="!addressSearchInput && isMobileSearchOpened"
            @click.stop="handleMobileSearchBtn"
          />
        </div>
        <app-button
          class="app-navbar__menu-wrp-item"
          scheme="default"
          :icon-right="$icons.gift"
          :route="{ name: $routes.cashback }"
        />
        <menu-drawer
          class="app-navbar__menu-drawer"
          :is-opened-state="isMobileDrawerOpened"
          @switch-is-opened-state="switchIsOpenedMobileState"
          @try-switch-chain="trySwitchChain"
        />
      </div>
      <dropdown class="app-navbar__chain">
        <template #head="{ dropdown }">
          <app-button
            class="app-navbar__chain-btn"
            :class="{ 'app-navbar__chain-btn--active': dropdown.isOpen }"
            size="small"
            scheme="borderless"
            :text="localizeChain(provider.chainId as string)"
            :icon-left="$icons.circleFilled"
            :icon-right="
              dropdown.isOpen ? $icons.chevronUp : $icons.chevronDown
            "
            @click="dropdown.toggle"
          />
        </template>
        <template #default>
          <div class="app-navbar__dropdown-body">
            <div
              class="app-navbar__chain-item-wrp"
              v-for="chainName in ETHEREUM_CHAINS"
              :key="chainName"
            >
              <app-button
                v-if="config.AVAILABLE_CHAINS.includes(chainName)"
                class="app-navbar__chain-item"
                color="tertiary"
                scheme="borderless"
                :text="localizeChain(chainName)"
                :icon-left="$icons.circleFilled"
                @click="trySwitchChain(chainName)"
              />
            </div>
          </div>
        </template>
      </dropdown>
      <div
        v-if="provider.selectedAddress && web3Store.isCurrentChainAvailable"
        class="app-navbar__wallet"
      >
        <span class="app-navbar__wallet-balance">
          {{
            formatAmount(
              account.nativeBalance,
              web3Store.currentChain.decimals,
              web3Store.currentChain.symbol,
            )
          }}
        </span>
        <span class="app-navbar__wallet-address">
          <address-copy
            :address="provider.selectedAddress ?? ''"
            :copy-without-icon="true"
          />
          <icon
            class="app-navbar__wallet-address-icon"
            :name="$icons.circleFilled"
          />
        </span>
      </div>
      <app-button
        v-if="!provider.selectedAddress"
        class="app-navbar__provider-btn"
        size="small"
        :text="$t('app-navbar.connect-btn')"
        @click="handleProviderBtnClick"
      />
    </div>
    <div
      class="app-navbar__mobile-filler"
      :class="{ 'app-navbar__mobile-filler--visible': isNavbarFixed }"
    />
  </div>

  <invalid-browser-modal v-model:is-shown="isMobileModalMetamaskAppOpened" />
</template>

<style lang="scss" scoped>
$navbar-z-index: 10;

.app-navbar {
  display: flex;
  align-items: stretch;
  width: 100%;
  min-height: toRem(65);
  padding: toRem(10) var(--app-padding-right) toRem(10) var(--app-padding-left);
  background: var(--background-primary);
  border-bottom: toRem(1) solid var(--border-primary-main);
  gap: toRem(10);
  z-index: $navbar-z-index;

  &--fixed {
    position: fixed;
  }

  &--disconnected:not(.app-navbar--fixed) {
    @include respond-to(medium) {
      padding: toRem(5) var(--app-padding-right) toRem(5)
        var(--app-padding-left);
    }
  }

  @include respond-to(medium) {
    padding: toRem(15) var(--app-padding-right) toRem(15)
      var(--app-padding-left);
    align-items: center;
    justify-content: space-between;
  }
}

.app-navbar__logo {
  max-width: toRem(70);
  margin-right: auto;
}

.app-navbar__farm-farm-balance {
  display: flex;

  @include respond-to(xmedium) {
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
  border-right: 0;
  padding: toRem(10);
  font-size: toRem(12);
  line-height: 1;
  font-weight: 700;
}

.app-navbar__farm-farm-balance-icon {
  max-width: toRem(14);
  max-height: toRem(14);
  min-width: toRem(14);
  min-height: toRem(14);
}

.app-navbar__search {
  padding: 0;
  display: grid;

  :not([disabled]) {
    height: 100%;
  }

  @include respond-to(xmedium) {
    display: none;
  }
}

.app-navbar__search-mobile {
  padding: 0;
  display: none;
  position: absolute;
  right: toRem(50);
  z-index: $navbar-z-index;
  width: calc(100% - toRem(50));
  min-height: toRem(44);
  min-width: toRem(135);
  overflow: hidden;

  :not([disabled]) {
    height: 100%;
  }

  /* stylelint-disable */
  &:not(.app-navbar__mobile-search-transition-enter-active)
    :not(.app-navbar__mobile-search-transition-leave-active)
    :deep(input) {
    width: 100%;
  }

  &--disconnected {
    display: none !important;
  }
  /* stylelint-enable */

  @include respond-to(xmedium) {
    display: grid;
  }

  @include respond-to(medium) {
    right: toRem(90);
    min-height: toRem(30);
    width: 100%;
  }
}

.app-navbar__search-mobile-close-btn {
  padding: 0;
  width: toRem(16);
  height: toRem(16);
  display: flex;
  align-items: center;
}

.app-navbar__search-icon {
  max-width: toRem(14);
  max-height: toRem(14);
  min-height: toRem(14);
  min-width: toRem(14);
  padding: 0;
  height: 100%;

  &--mobile {
    max-width: toRem(15);
    max-height: toRem(15);
    min-height: toRem(15);
    min-width: toRem(15);
  }

  &--inactive {
    cursor: default;
  }
}

.app-navbar__chain {
  display: grid;
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
}

.app-navbar__chain-item {
  justify-content: start;
  width: 100%;
  padding: toRem(12) toRem(24);
  border: toRem(1) solid var(--primary-main);
  border-bottom: 0;

  &:not([disabled]):hover,
  &:not([disabled]):focus,
  &:not([disabled]):active {
    border: toRem(1) solid var(--primary-main);
    border-bottom: 0;
  }
}

.app-navbar__chain-item-wrp {
  &:last-child {
    border-bottom: toRem(1) solid var(--primary-main);
  }
}

.app-navbar__wallet {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  line-height: 1;
  font-weight: 700;
  border: toRem(1) solid var(--border-secondary-main);

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
  max-height: toRem(16);
  max-width: toRem(16);
  min-height: toRem(16);
  min-width: toRem(16);
}

.app-navbar__provider-btn {
  margin-left: auto;
  padding: toRem(10) toRem(24);

  @include respond-to(xmedium) {
    margin: 0;
  }
}

.app-navbar__menu-wrp {
  display: none;
  align-items: center;
  position: relative;
  gap: toRem(35);
  padding-right: toRem(20);

  @include respond-to(xmedium) {
    display: flex;
    flex: 1;
    justify-content: end;
  }

  @include respond-to(medium) {
    padding: 0;
  }
}

.app-navbar__menu-wrp-item {
  padding: 0;
  font-size: toRem(14);

  &--search {
    z-index: $navbar-z-index;
  }
}

.app-navbar__mobile-filler {
  height: toRem(65);
  width: 100%;
  display: none;

  &--visible {
    display: block;
  }
}

.app-navbar__menu-drawer {
  display: none;

  @include respond-to(medium) {
    display: block;
  }
}

.app-navbar__mobile-search-transition-enter-active {
  animation: mobile-search-frame-keyframes 0.25s ease-in-out;
  min-width: 0;
}

.app-navbar__mobile-search-transition-leave-active {
  animation: mobile-search-frame-keyframes 0.25s ease-in-out reverse;
  min-width: 0;
}

@keyframes mobile-search-frame-keyframes {
  from {
    width: 0;
  }
}
</style>
