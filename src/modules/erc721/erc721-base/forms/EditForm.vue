<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
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
} from '../../forms'
import { useProductErc721Base } from '../composables/use-product-erc721'
import { BaseEditForm } from '@/modules/forms'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc721.title': 'Editing',
      'erc721.description':
        'Editing your product smart contract parameters on chain. After each edition transaction is initiated. After transaction is added to the blockchain new parameters take effect.',
      'erc721.tracker': 'Token tracker',
      'erc721.owner': 'Owner address',
      'erc721.balance': 'Your balance',
      'erc721.interaction': 'Interaction',
      'erc721.baseURI': 'Base URI',
      'erc721.baseURI-default-value': 'Not set yet',
    },
  },
})

const route = useRoute()
const erc721 = useProductErc721Base(route.params.contractAddress as string)

const isLoaded = ref(false)

const overviewRows = ref<Array<OverviewRow>>([
  {
    name: t('erc721.tracker'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('erc721.owner'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
  {
    name: t('erc721.baseURI'),
    value: '',
    type:
      erc721.baseURI.value === '' ? OVERVIEW_ROW.default : OVERVIEW_ROW.link,
  },
  {
    name: t('erc721.balance'),
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
      ? t('erc721.baseURI-default-value')
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
  title: t('erc721.title'),
  description: t('erc721.description'),
  overviewLbl: t('erc721.overview'),
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
