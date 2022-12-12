<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { required } from '@/validators'
import { deploy } from '@/helpers'
import { BaseDeployForm } from '@/modules/forms'
import { DeployMetadata } from '@/modules/common/index'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc721.title': 'Deploy',
      'erc721.subtitle': 'Token ERC-721',
      'erc721.description':
        'Deploy your product on chain. You should deploy product smart contract only one time with a transaction.',

      'erc721.token-group': 'NFT info',
      'erc721.name-lbl': 'NFT name',
      'erc721.name-info': 'Enter the token name',
      'erc721.symbol-lbl': 'Token symbol',
      'erc721.symbol-info': 'Enter the token symbol',

      'erc721.btn-lbl': 'Buy',

      'erc721.deploy-success.message.description':
        'Congratulations! You’ve just deployed your contract for Non Fungible Tokens!',
    },
  },
})

const isSuccessModalShown = ref(false)

const route = useRoute()

const deployMetadata = ref<DeployMetadata>({
  name: '',
  symbol: '',
  contract: '',
})
const potentialContractAddress = ref('')
const txProcessing = ref(false)

const headingData = {
  title: t('erc721.title'),
  subtitle: t('erc721.subtitle'),
  description: t('erc721.description'),
}

const buttonData = {
  label: t('erc721.btn-lbl'),
  isShown: txProcessing,
}

const modalData = {
  potentialContractAddress,
  metadata: deployMetadata,
  txt: {
    description: t('erc721.deploy-success.message.description'),
  },
}

const categoriesData = [
  {
    title: t('erc721.token-group'),
    inputs: [
      {
        label: t('erc721.name-lbl'),
        tooltip: t('erc721.name-info'),
        validators: [required],
      },
      {
        label: t('erc721.symbol-lbl'),
        tooltip: t('erc721.symbol-info'),
        validators: [required],
      },
    ],
  },
]

const submit = async ([[paymentTokenAddress], [name, symbol]]: string[][]) => {
  txProcessing.value = true
  potentialContractAddress.value = await deploy(
    route.params.id as string,
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
