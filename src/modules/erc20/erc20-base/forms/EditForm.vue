<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ROUTE_NAMES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { AppBlock, AppButton, Tabs, LinkCopy } from '@/common'
import { TransferOwnershipForm, UpgradeToForm } from '@/modules/forms'
import { formatAmount } from '@/helpers'
import { OVERVIEW_ROW } from '@/modules/enums'
import { OverviewRow } from '@/modules/types'
import {
  BalanceForm,
  ApproveForm,
  AllowanceForm,
  TransferForm,
  TransferFromForm,
} from '@/modules/erc20/forms'
import { EditOverview } from '@/modules/common'
import { useProductErc20Base } from '../composables/use-product-erc20-base'
import { BN } from '@/utils'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc20.title': 'Editing',
      'erc20.description':
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
const overviewRows = ref<Array<OverviewRow>>([
  {
    name: t('erc20.tracker'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('erc20.total'),
    value: '',
    type: OVERVIEW_ROW.amount,
  },
  {
    name: t('erc20.decimals'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('erc20.owner'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
  {
    name: t('erc20.balance'),
    value: '',
    type: OVERVIEW_ROW.amount,
  },
])
const balance = ref('0')

const router = useRouter()
const route = useRoute()
const erc20 = useProductErc20Base(route.params.contractAddress as string)

const isLoaded = ref(false)

const init = async () => {
  erc20.init(route.params.contractAddress as string)

  if (provider.value.selectedAddress) {
    await Promise.all([
      erc20.loadDetails(),
      erc20.balanceOf(provider.value.selectedAddress),
    ]).then(res => {
      balance.value = res[1]

      return
    })
  }

  overviewRows.value[0].value = `${erc20.name.value} (${erc20.symbol.value})`
  overviewRows.value[1].value = formatAmount(
    erc20.totalSupply.value,
    erc20.decimals.value,
    erc20.symbol.value,
  )
  overviewRows.value[2].value = String(erc20.decimals.value)
  overviewRows.value[3].value = erc20.owner.value
  overviewRows.value[4].value = formatAmount(
    balance.value,
    erc20.decimals.value,
    erc20.symbol.value,
  )

  isLoaded.value = true
}

const formBalance = computed(() => {
  return new BN(balance.value).fromFraction(erc20.decimals.value).toString()
})

const updateBalance = async () => {
  if (!overviewRows.value || !provider.value.selectedAddress) return

  overviewRows.value[4].value = formatAmount(
    await erc20.balanceOf(provider.value.selectedAddress),
    erc20.decimals.value,
    erc20.symbol.value,
  )
}

const updateOwner = async () => {
  if (!overviewRows.value) return

  await erc20.updateOwner()
  overviewRows.value[3].value = erc20.owner.value
}

watch(
  () => provider.value.selectedAddress,
  () => {
    init()
  },
)

init()
</script>

<template>
  <div class="erc20-edit-form">
    <div class="app__module-heading">
      <div class="app__module-title-wrp">
        <app-button
          type="button"
          class="app__module-back-btn"
          :icon-right="$icons.arrowLeft"
          modification="border-circle"
          color="tertiary"
          @click="
            router.push({
              name: ROUTE_NAMES.product,
              params: {
                id: route.params.id,
              },
            })
          "
        />
        <h2 class="app__module-title">
          {{ t('erc20.title') }}
        </h2>
      </div>
      <span class="app__module-subtitle">
        <link-copy
          :address="erc20.address.value"
          class="app__module-subtitle"
        />
      </span>
      <span class="app__module-description">
        {{ t('erc20.description') }}
      </span>
    </div>
    <edit-overview :is-loaded="isLoaded" :rows="overviewRows" />
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
          <allowance-form :token="erc20" />
          <balance-form :token="erc20" />
        </div>
        <div
          v-if="currentTabNumber === FORM_TABS[1].number"
          class="app__module-content"
        >
          <approve-form :token="erc20" />
          <transfer-form
            :token="erc20"
            :balance="formBalance"
            @change-balance="updateBalance"
          />
          <transfer-from-form :token="erc20" @change-balance="updateBalance" />
          <transfer-ownership-form :token="erc20" @change-owner="updateOwner" />
          <upgrade-to-form :token="erc20" />
        </div>
      </app-block>
    </div>
  </div>
</template>
