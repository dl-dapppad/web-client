<script lang="ts" setup>
import { Drawer, AppButton, Icon, Dropdown, AddressCopy } from '@/common'
import { formatAmount } from '@/helpers'
import { ETHEREUM_CHAINS } from '@/enums'
import { localizeChain } from '@/localization'
import { useWeb3ProvidersStore, useAccountStore } from '@/store'

import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { config } from '@/config'

defineProps<{
  isOpenedState: boolean
}>()

const web3Store = useWeb3ProvidersStore()
const { provider } = storeToRefs(useWeb3ProvidersStore())
const { account } = storeToRefs(useAccountStore())

const chain = web3Store.currentChain

enum EVENTS {
  trySwitchChain = 'try-switch-chain',
  switchIsOpenedState = 'switch-is-opened-state',
}

const route = useRoute()

watch(route, () => {
  emit(EVENTS.switchIsOpenedState, false)
})

const emit = defineEmits<{
  (e: EVENTS.trySwitchChain, value: string | number): void
  (e: EVENTS.switchIsOpenedState, value?: boolean): void
}>()

const trySwitchChain = (chainId: string | number) => {
  emit(EVENTS.trySwitchChain, chainId)
}

const switchIsOpenedState = () => {
  emit(EVENTS.switchIsOpenedState)
}
</script>

<template>
  <div class="menu-drawer">
    <app-button
      class="menu-drawer__trigger"
      scheme="default"
      size="x-small"
      :icon-right="isOpenedState ? $icons.x : $icons.menu"
      @click="switchIsOpenedState"
    />
    <drawer class="menu-drawer__drawer" :is-shown="isOpenedState">
      <div class="menu-drawer__content">
        <div class="menu-drawer__section">
          <span class="menu-drawer__section-key">
            {{ $t('app-navbar.wallet-address-lbl') }}
          </span>
          <span class="menu-drawer__section-value">
            <icon
              class="menu-drawer__section-icon"
              :name="$icons.circleFilled"
            />
            <address-copy
              :address="provider.selectedAddress ?? ''"
              :copy-without-icon="true"
            />
          </span>
        </div>
        <div class="menu-drawer__section">
          <span class="menu-drawer__section-key">
            {{ $t('app-navbar.balance-lbl') }}
          </span>
          <span class="menu-drawer__section-value">
            {{
              formatAmount(
                account.nativeBalance,
                chain?.decimals,
                chain?.symbol,
              )
            }}
          </span>
        </div>
        <dropdown class="menu-drawer__chain-dropdown">
          <template #head="{ dropdown }">
            <app-button
              class="menu-drawer__chain-dropdown-btn"
              scheme="borderless"
              :class="{
                'menu-drawer__chain-dropdown-btn--active': dropdown.isOpen,
              }"
              :text="localizeChain(provider.chainId)"
              :icon-left="$icons.circleFilled"
              :icon-right="
                dropdown.isOpen ? $icons.chevronUp : $icons.chevronDown
              "
              @click="dropdown.toggle"
            />
          </template>
          <template #default>
            <div class="menu-drawer__chain-dropdown-body">
              <div
                v-for="chainName in ETHEREUM_CHAINS"
                class="menu-drawer__chain-dropdown-item-wrp"
                :key="chainName"
              >
                <app-button
                  v-if="config.AVAILABLE_CHAINS.includes(chainName)"
                  class="menu-drawer__chain-dropdown-item"
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
      </div>
    </drawer>
  </div>
</template>

<style lang="scss" scoped>
.menu-drawer__trigger {
  font-size: toRem(17);
  transform: translateY(10%);
}

.menu-drawer__trigger-icon {
  max-width: toRem(22);
  max-height: toRem(22);
}

.menu-drawer__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(30);
  height: 100%;
  width: 100%;
  padding: toRem(24) var(--app-padding-right) toRem(30) var(--app-padding-left);
}

.menu-drawer__section {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: toRem(10);
}

.menu-drawer__section-icon {
  max-width: toRem(16);
  max-height: toRem(16);
  min-width: toRem(16);
  min-height: toRem(16);
}

.menu-drawer__section-key {
  font-weight: 700;
  font-size: toRem(12);
  color: var(--text-secondary-main);
}

.menu-drawer__section-value {
  display: flex;
  align-items: center;
  gap: toRem(10);
  font-weight: 700;
  font-size: toRem(20);
}

.menu-drawer__chain-dropdown {
  width: 100%;
}

.menu-drawer__chain-dropdown-body {
  &:last-child {
    border-bottom: toRem(1) solid var(--primary-main);
  }
}

.menu-drawer__chain-dropdown-item {
  width: 100%;
  justify-content: start;
  border: toRem(1) solid var(--primary-main);
  border-bottom: 0;

  &:not([disabled]):hover,
  &:not([disabled]):focus,
  &:not([disabled]):active {
    border: toRem(1) solid var(--primary-main);
    border-bottom: 0;
  }
}

.menu-drawer__chain-dropdown-btn {
  width: 100%;
  justify-content: space-between;

  &--active {
    background-color: var(--secondary-main);

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      background-color: var(--secondary-main);
    }
  }
}

.menu-drawer__logout-btn {
  margin-top: auto;
}
</style>
