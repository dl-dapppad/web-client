<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
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
import { useProductErc20 } from '../composables/use-product-erc20'
import { BaseEditForm } from '@/modules/forms'
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

const route = useRoute()
const erc20 = useProductErc20(route.params.contractAddress as string)

const isLoaded = ref(false)

const init = async () => {
  erc20.init(route.params.contractAddress as string)

  await erc20.loadDetails()

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

const formOverviewData = ref({
  isLoaded,
  rows: overviewRows,
})

const headingData = {
  title: t('erc20.title'),
  description: t('erc20.description'),
  overviewLbl: t('erc20.overview'),
}

init()
</script>

<template>
  <base-edit-form :heading-data="headingData" :overview="formOverviewData">
    <template #tabFirst>
      <allowance-form :token="erc20" />
      <balance-form :token="erc20" />
    </template>
    <template #tabSecond>
      <approve-form :token="erc20" />
      <transfer-form
        :token="erc20"
        :balance="formBalance"
        @change-balance="updateBalance"
      />
      <transfer-from-form :token="erc20" @change-balance="updateBalance" />
      <transfer-ownership-form :token="erc20" @change-owner="updateOwner" />
      <upgrade-to-form :token="erc20" />
    </template>
  </base-edit-form>
</template>
