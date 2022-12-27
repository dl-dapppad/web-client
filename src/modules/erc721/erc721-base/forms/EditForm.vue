<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { i18n } from '@/localization'
import { useWeb3ProvidersStore } from '@/store'
import { TransferOwnershipForm, UpgradeToForm } from '@/modules/forms'
import { OVERVIEW_ROW } from '@/modules/enums'
import { OverviewRow } from '@/modules/types'
import {
  BalanceForm,
  MintForm,
  ApproveForm,
  ApproveAllForm,
  SafeTransferForm,
  OwnerForm,
  SetBaseUriForm,
  TokenUriForm,
} from '@/modules/erc721/forms'
import { useProductErc721Base } from '@/modules/erc721/erc721-base/composables/use-product-erc721-base'
import { BaseEditForm } from '@/modules/forms'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = i18n.global

const route = useRoute()
const erc721 = useProductErc721Base(route.params.contractAddress as string)

const isLoaded = ref(false)

const overviewRows = ref<Array<OverviewRow>>([
  {
    name: t('product-edit.erc721-common.tracker'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('product-edit.erc721-common.owner'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
  {
    name: t('product-edit.erc721-common.baseURI'),
    value: '',
    type:
      erc721.baseURI.value === '' ? OVERVIEW_ROW.default : OVERVIEW_ROW.link,
  },
  {
    name: t('product-edit.erc721-common.balance'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
])

const init = async () => {
  erc721.init(route.params.contractAddress as string)

  if (provider.value.selectedAddress) {
    const [amount] = await Promise.all([
      erc721.balanceOf(provider.value.selectedAddress),
      erc721.loadDetails(),
    ])
    overviewRows.value[3].value = amount
  }

  overviewRows.value[0].value = `${erc721.name.value} (${erc721.symbol.value})`
  overviewRows.value[1].value = erc721.owner.value
  overviewRows.value[2].value =
    erc721.baseURI.value === ''
      ? t('product-edit.erc721-common.baseURI-default-value')
      : erc721.baseURI.value

  isLoaded.value = true
}

const updateBalance = async () => {
  if (!overviewRows.value || !provider.value.selectedAddress) return

  overviewRows.value[3].value = await erc721.balanceOf(
    provider.value.selectedAddress,
  )
}

const updateOwner = async () => {
  if (!overviewRows.value) return

  await erc721.updateOwner()
  overviewRows.value[1].value = erc721.owner.value
}

const updateBaseURI = async () => {
  if (!overviewRows.value) return

  await erc721.updateBaseURI()
  overviewRows.value[2].value = erc721.baseURI.value
}

const formOverviewData = ref({
  isLoaded,
  rows: overviewRows,
})

const headingData = {
  title: t('product-edit.erc721-common.title'),
  subtitle: t('product.erc721.base'),
  description: t('product-edit.erc721-common.description'),
  overviewLbl: t('product-edit.erc721-common.overview'),
}

init()
</script>

<template>
  <base-edit-form :heading-data="headingData" :overview="formOverviewData">
    <template #tabFirst>
      <balance-form :token="erc721" />
      <owner-form :token="erc721" />
      <token-uri-form :token="erc721" />
    </template>
    <template #tabSecond>
      <set-base-uri-form :token="erc721" @change-base-uri="updateBaseURI" />
      <approve-form :token="erc721" />
      <approve-all-form :token="erc721" />
      <mint-form :token="erc721" @change-balance="updateBalance" />
      <safe-transfer-form :token="erc721" />
      <transfer-ownership-form :token="erc721" @change-owner="updateOwner" />
      <upgrade-to-form :token="erc721" />
    </template>
  </base-edit-form>
</template>
