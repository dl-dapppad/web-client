<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { i18n } from '@/localization'
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
  BurnForm,
  BurnFromForm,
  MintForm,
} from '@/modules/erc20/forms'
import { useProductErc20MintBurn } from '@/modules/erc20/erc20-mint-burn/composables/use-product-erc20-mint-burn'
import { BaseEditForm } from '@/modules/forms'
import { BN } from '@/utils'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = i18n.global

const overviewRows = ref<Array<OverviewRow>>([
  {
    name: t('product-edit.erc20-common.tracker'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('product-edit.erc20-common.total'),
    value: '',
    type: OVERVIEW_ROW.amount,
  },
  {
    name: t('product-edit.erc20-common.decimals'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('product-edit.erc20-common.owner'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
  {
    name: t('product-edit.erc20-common.balance'),
    value: '',
    type: OVERVIEW_ROW.amount,
  },
])
const balance = ref('0')

const route = useRoute()
const token = useProductErc20MintBurn(route.params.contractAddress as string)

const isLoaded = ref(false)

const init = async () => {
  token.init(route.params.contractAddress as string)

  if (provider.value.selectedAddress) {
    const [amount] = await Promise.all([
      token.balanceOf(provider.value.selectedAddress),
      token.loadDetails(),
    ])
    balance.value = amount
  }

  overviewRows.value[0].value = `${token.name.value} (${token.symbol.value})`
  overviewRows.value[1].value = formatAmount(
    token.totalSupply.value,
    token.decimals.value,
    token.symbol.value,
  )
  overviewRows.value[2].value = String(token.decimals.value)
  overviewRows.value[3].value = token.owner.value
  overviewRows.value[4].value = formatAmount(
    balance.value,
    token.decimals.value,
    token.symbol.value,
  )

  isLoaded.value = true
}

const formBalance = computed(() => {
  return new BN(balance.value).fromFraction(token.decimals.value).toString()
})

const updateBalance = async () => {
  if (!overviewRows.value || !provider.value.selectedAddress) return

  overviewRows.value[4].value = formatAmount(
    await token.balanceOf(provider.value.selectedAddress),
    token.decimals.value,
    token.symbol.value,
  )
}

const updateOwner = async () => {
  if (!overviewRows.value) return

  await token.updateOwner()
  overviewRows.value[3].value = token.owner.value
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
  title: t('product-edit.erc20-common.title'),
  description: t('product-edit.erc20-common.description'),
  overviewLbl: t('product-edit.erc20-common.overview'),
}

init()
</script>

<template>
  <base-edit-form :heading-data="headingData" :overview="formOverviewData">
    <template #tabFirst>
      <allowance-form :token="token" />
      <balance-form :token="token" />
    </template>
    <template #tabSecond>
      <mint-form :token="token" @change-balance="updateBalance" />
      <burn-form
        :token="token"
        :balance="formBalance"
        @change-balance="updateBalance"
      />
      <burn-from-form :token="token" @change-balance="updateBalance" />
      <approve-form :token="token" />
      <transfer-form
        :token="token"
        :balance="formBalance"
        @change-balance="updateBalance"
      />
      <transfer-from-form :token="token" @change-balance="updateBalance" />
      <transfer-ownership-form :token="token" @change-owner="updateOwner" />
      <upgrade-to-form :token="token" />
    </template>
  </base-edit-form>
</template>
