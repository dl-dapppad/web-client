<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useWeb3ProvidersStore } from '@/store'
import { required, isAddress, numeric } from '@/validators'
import { BN } from '@/utils'
import { DeployMetadata } from '@/modules/common'
import { BaseDeployForm } from '@/modules/forms'
import { useProduct } from '@/composables'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc20-min-burn-cap.subtitle': 'ERC-20 Mint Burn Cap',
    },
  },
})

const { provider } = storeToRefs(useWeb3ProvidersStore())
const route = useRoute()
const product = useProduct()

const isSuccessModalShown = ref(false)

const deployMetadata = ref<DeployMetadata>({
  name: '',
  symbol: '',
  contract: '',
  erc20Metadata: {
    decimals: '',
    cap: '',
    mintAmount: '',
    mintReceiver: '',
  },
})
const potentialContractAddress = ref('')
const txProcessing = ref(false)

const headingData = {
  subtitle: t('erc20-min-burn-cap.subtitle'),
  description: t('product-deploy.erc20-common.description'),
}

const buttonData = {
  label: t('product-deploy.erc20-common.btn-lbl'),
  isHidden: txProcessing,
}

const modalData = {
  potentialContractAddress,
  metadata: deployMetadata,
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
      {
        label: t('product-deploy.erc20-common.cap-lbl'),
        tooltip: t('product-deploy.erc20-common.cap-info'),
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
    cap,
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
      new BN(cap).toFraction(Number(decimals)).toString(),
    ],
  )

  if (!potentialContractAddress.value) {
    txProcessing.value = false
    return
  }

  deployMetadata.value = {
    name: name,
    symbol: symbol,
    contract: potentialContractAddress.value,
    erc20Metadata: {
      decimals: decimals,
      cap: cap,
      mintAmount: mintAmount,
      mintReceiver: mintReceiver,
    },
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
