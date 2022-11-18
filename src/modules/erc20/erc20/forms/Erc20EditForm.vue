<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { AppBlock, AppButton, Tabs, EditOverview } from '@/common'
import { cropAddress, copyToClipboard, formatAmount } from '@/helpers'
import { OVERVIEW_ROW } from '@/enums'
import { OverviewRow } from '@/common/EditOverview.vue'
import {
  BalanceForm,
  ApproveForm,
  AllowanceForm,
  TransferForm,
  TransferFromForm,
} from '../../forms'
import { useProductErc20 } from '../composables/use-product-erc20'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc20.title': 'Editing',
      'erc20.subtitle':
        'Editing your product smart contract parameters on chain. After each edition transaction is initiated. After transaction is added to the blockchain new parameters take effect.',
      'erc20.total': 'Total supply',
      'erc20.tracker': 'Token tracker',
      'erc20.owner': 'Owner address',
      'erc20.decimals': 'Decimals',
      'erc20.balance': 'Your balance',
      'erc20.interaction': 'Interaction',
    },
  },
})

const FORM_TABS = [
  {
    title: 'Read',
    number: 1,
  },
  {
    title: 'Write',
    number: 2,
  },
]

const currentTabNumber = ref(FORM_TABS[0].number)
const overviewRows = ref<Array<OverviewRow>>()

const router = useRouter()
const route = useRoute()
const erc20 = useProductErc20(route.params.contractAddress as string)

const init = async () => {
  erc20.init(route.params.contractAddress as string)

  await erc20.loadDetails()

  let balance = '0'
  if (provider.value.selectedAddress) {
    await Promise.all([
      erc20.loadDetails(),
      erc20.balanceOf(provider.value.selectedAddress),
    ]).then(res => {
      balance = res[1]

      return
    })
  }

  overviewRows.value = [
    {
      name: t('erc20.tracker'),
      value: `${erc20.name.value} (${erc20.symbol.value})`,
      type: OVERVIEW_ROW.default,
    },
    {
      name: t('erc20.total'),
      value: formatAmount(
        erc20.totalSupply.value,
        erc20.decimals.value,
        erc20.symbol.value,
      ),
      type: OVERVIEW_ROW.amount,
    },
    {
      name: t('erc20.decimals'),
      value: String(erc20.decimals.value),
      type: OVERVIEW_ROW.default,
    },
    {
      name: t('erc20.owner'),
      value: cropAddress(erc20.owner.value),
      type: OVERVIEW_ROW.address,
    },
    {
      name: t('erc20.balance'),
      value: formatAmount(balance, erc20.decimals.value, erc20.symbol.value),
      type: OVERVIEW_ROW.amount,
    },
  ]
}

init()
</script>

<template>
  <div class="erc20-edit-form">
    <div class="edit-form__titles-wrp">
      <div class="app__module-title-wrp">
        <app-button
          type="button"
          class="app__module-back-btn"
          :icon-right="$icons.arrowLeft"
          modification="border-circle"
          color="tertiary"
          @click="router.go(-1)"
        />
        <h2 class="app__module-title">
          {{ t('erc20.title') }}
        </h2>
        <app-button
          type="button"
          class="app__module-title-address"
          :text="cropAddress(erc20.address.value)"
          :icon-right="$icons.duplicate"
          scheme="default"
          size="default"
          @click="copyToClipboard(erc20.address.value)"
        />
      </div>
      <span class="app__module-subtitle">
        {{ t('erc20.subtitle') }}
      </span>
    </div>
    <edit-overview :rows="overviewRows"></edit-overview>
    <div>
      <h3 class="app__module-block-title">
        {{ t('erc20.interaction') }}
      </h3>
      <tabs v-model="currentTabNumber" :tabs-data="FORM_TABS" />
      <app-block>
        <div
          v-if="currentTabNumber === FORM_TABS[0].number"
          class="app__module-content"
        >
          <allowance-form :token="erc20"></allowance-form>
          <balance-form :token="erc20"></balance-form>
        </div>
        <div
          v-if="currentTabNumber === FORM_TABS[1].number"
          class="app__module-content"
        >
          <approve-form :token="erc20"></approve-form>
          <transfer-form :token="erc20" @change-balance="init" />
          <transfer-from-form :token="erc20" @change-balance="init" />
        </div>
      </app-block>
    </div>
  </div>
</template>
