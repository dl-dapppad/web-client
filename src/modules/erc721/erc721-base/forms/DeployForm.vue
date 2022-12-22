<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { required } from '@/validators'
import { BaseDeployForm } from '@/modules/forms'
import { DeployMetadata } from '@/modules/common/index'
import { useProduct } from '@/composables'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc721-base.subtitle': 'Token ERC-721',
    },
  },
})

const route = useRoute()
const product = useProduct()

const isSuccessModalShown = ref(false)

const deployMetadata = ref<DeployMetadata>({
  name: '',
  symbol: '',
  contract: '',
})
const potentialContractAddress = ref('')
const txProcessing = ref(false)

const headingData = {
  subtitle: t('erc721-base.subtitle'),
  description: t('product-deploy.erc721-common.description'),
}

const buttonData = {
  label: t('product-deploy.erc721-common.btn-lbl'),
  isHidden: txProcessing,
}

const modalData = {
  potentialContractAddress,
  metadata: deployMetadata,
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

  deployMetadata.value = {
    name: name,
    symbol: symbol,
    contract: potentialContractAddress.value,
  }

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
