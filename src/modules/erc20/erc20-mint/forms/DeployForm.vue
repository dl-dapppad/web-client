<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { i18n } from '@/localization'
import { useWeb3ProvidersStore } from '@/store'
import { required, isAddress, numeric } from '@/validators'
import { BN } from '@/utils'
import { OverviewRow } from '@/modules/types'
import { OVERVIEW_ROW } from '@/modules/enums'
import { BaseDeployForm } from '@/modules/forms'
import { useProduct } from '@/composables'

const { t } = i18n.global

const { provider } = storeToRefs(useWeb3ProvidersStore())
const route = useRoute()
const product = useProduct()

const isSuccessModalShown = ref(false)

const overviewRows = ref<Array<OverviewRow>>([
  {
    name: t('product-deploy.modal.name-lbl'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('product-deploy.modal.symbol-lbl'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('product-deploy.modal.decimals-lbl'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('product-deploy.modal.mint-amount-lbl'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('product-deploy.modal.mint-receiver-lbl'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
  {
    name: t('product-deploy.modal.contract-lbl'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
])
const potentialContractAddress = ref('')
const txProcessing = ref(false)

const headingData = {
  subtitle: t('product.erc20.mint'),
  description: t('product-deploy.erc20-common.description'),
}

const buttonData = {
  label: t('product-deploy.erc20-common.btn-lbl'),
  isHidden: txProcessing,
}

const modalData = {
  potentialContractAddress,
  rows: overviewRows,
  txt: {
    description: t('product-deploy.erc20-common.deploy-success-message'),
  },
}

const categoriesData = [
  {
    title: t('product-deploy.erc20-common.token-group'),
    inputs: [
      {
        label: t('product-deploy.erc20-common.name-lbl'),
        tooltip: t('product-deploy.erc20-common.name-info'),
        validators: [required],
      },
      {
        label: t('product-deploy.erc20-common.symbol-lbl'),
        tooltip: t('product-deploy.erc20-common.symbol-info'),
        validators: [required],
      },
      {
        label: t('product-deploy.erc20-common.decimals-lbl'),
        tooltip: t('product-deploy.erc20-common.decimals-info'),
        validators: [required, numeric],
      },
    ],
  },
  {
    title: t('product-deploy.erc20-common.mint-group'),
    inputs: [
      {
        value: provider.value.selectedAddress as string,
        label: t('product-deploy.erc20-common.mint-receiver-lbl'),
        tooltip: t('product-deploy.erc20-common.mint-receiver-info'),
        validators: [required, isAddress],
      },
      {
        label: t('product-deploy.erc20-common.mint-amount-lbl'),
        tooltip: t('product-deploy.erc20-common.mint-amount-info'),
        validators: [required, numeric],
      },
    ],
  },
]

const submit = async (values: string[]) => {
  if (!Array.isArray(values)) return
  const [
    paymentTokenAddress,
    productPrice,
    name,
    symbol,
    decimals,
    mintReceiver,
    mintAmount,
  ] = values

  txProcessing.value = true
  potentialContractAddress.value = await product.deploy(
    route.params.id as string,
    productPrice,
    paymentTokenAddress,
    [
      name,
      symbol,
      new BN(mintAmount).toFraction(Number(decimals)).toString(),
      mintReceiver,
      decimals,
    ],
  )

  if (!potentialContractAddress.value) {
    txProcessing.value = false
    return
  }

  overviewRows.value[0].value = name
  overviewRows.value[1].value = symbol
  overviewRows.value[2].value = decimals
  overviewRows.value[3].value = mintAmount
  overviewRows.value[4].value = mintReceiver
  overviewRows.value[5].value = potentialContractAddress.value

  isSuccessModalShown.value = true
  txProcessing.value = false
}
</script>

<template>
  <base-deploy-form
    :heading-data="headingData"
    :button="buttonData"
    :modal="modalData"
    :categories="categoriesData"
    v-model:is-success-modal-shown="isSuccessModalShown"
    @submit="submit"
  />
</template>
