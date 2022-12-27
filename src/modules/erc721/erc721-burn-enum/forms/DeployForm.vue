<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { i18n } from '@/localization'
import { required } from '@/validators'
import { BaseDeployForm } from '@/modules/forms'
import { OverviewRow } from '@/modules/types'
import { OVERVIEW_ROW } from '@/modules/enums'
import { useProduct } from '@/composables'

const { t } = i18n.global

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
    name: t('product-deploy.modal.contract-lbl'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
])
const potentialContractAddress = ref('')
const txProcessing = ref(false)

const headingData = {
  subtitle: t('product.erc721.burn-enum'),
  description: t('product-deploy.erc721-common.description'),
}

const buttonData = {
  label: t('product-deploy.erc721-common.btn-lbl'),
  isHidden: txProcessing,
}

const modalData = {
  potentialContractAddress,
  rows: overviewRows,
  txt: {
    description: t('product-deploy.erc721-common.deploy-success-message'),
  },
}

const categoriesData = [
  {
    title: t('product-deploy.erc721-common.token-group'),
    inputs: [
      {
        label: t('product-deploy.erc721-common.name-lbl'),
        tooltip: t('product-deploy.erc721-common.name-info'),
        validators: [required],
      },
      {
        label: t('product-deploy.erc721-common.symbol-lbl'),
        tooltip: t('product-deploy.erc721-common.symbol-info'),
        validators: [required],
      },
    ],
  },
]

const submit = async (values: string[]) => {
  if (!Array.isArray(values)) return
  const [paymentTokenAddress, productPrice, name, symbol] = values

  txProcessing.value = true
  potentialContractAddress.value = await product.deploy(
    route.params.id as string,
    productPrice,
    paymentTokenAddress,
    [name, symbol],
  )

  if (!potentialContractAddress.value) {
    txProcessing.value = false
    return
  }

  overviewRows.value[0].value = name
  overviewRows.value[1].value = symbol
  overviewRows.value[2].value = potentialContractAddress.value

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
