<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useWeb3ProvidersStore } from '@/store'
import { required, isAddress, numeric } from '@/validators'
import { deploy } from '@/helpers/deploy.helper'
import { BN } from '@/utils'
import { DeployMetadata } from '@/modules/common'
import { BaseDeployForm } from '@/modules/forms'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc20.title': 'Deploy',
      'erc20.subtitle': 'Token ERC-20',
      'erc20.description':
        'Deploy your product on chain. You should deploy product smart contract only one time with a transaction.',

      'erc20.token-group': 'Token info',
      'erc20.name-lbl': 'Token name',
      'erc20.name-info': 'Enter the token name',
      'erc20.symbol-lbl': 'Token symbol',
      'erc20.symbol-info': 'Enter the token symbol',
      'erc20.decimals-lbl': 'Token decimals',
      'erc20.decimals-info': 'Enter the token decimals',

      'erc20.mint-group': 'Mint info',
      'erc20.mint-amount-lbl': 'Mint amount',
      'erc20.mint-amount-info': 'Enter the initial mint amount',
      'erc20.mint-receiver-lbl': 'Mint receiver',
      'erc20.mint-receiver-info': 'Enter the tokens receiver',

      'erc20.btn-lbl': 'Buy',

      'erc20.deploy-success-message.description':
        'Congratulations! You’ve just deployed your contract for Fungible Tokens!',
    },
  },
})

const isSuccessModalShown = ref(false)

const route = useRoute()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const deployMetadata = ref<DeployMetadata>({
  name: '',
  symbol: '',
  contract: '',
  erc20Metadata: {
    decimals: '',
    mintAmount: '',
    mintReceiver: '',
  },
})
const potentialContractAddress = ref('')
const txProcessing = ref(false)

const headingData = {
  title: t('erc20.title'),
  subtitle: t('erc20.subtitle'),
  description: t('erc20.description'),
}

const buttonData = {
  label: t('erc20.btn-lbl'),
  isHidden: txProcessing,
}

const modalData = {
  potentialContractAddress,
  metadata: deployMetadata,
  txt: {
    description: t('erc20.deploy-success-message.description'),
  },
}

const categoriesData = [
  {
    title: t('erc20.token-group'),
    inputs: [
      {
        label: t('erc20.name-lbl'),
        tooltip: t('erc20.name-info'),
        validators: [required],
      },
      {
        label: t('erc20.symbol-lbl'),
        tooltip: t('erc20.symbol-info'),
        validators: [required],
      },
      {
        label: t('erc20.decimals-lbl'),
        tooltip: t('erc20.decimals-info'),
        validators: [required, numeric],
      },
    ],
  },
  {
    title: t('erc20.mint-group'),
    inputs: [
      {
        value: provider.value.selectedAddress as string,
        label: t('erc20.mint-receiver-lbl'),
        tooltip: t('erc20.mint-receiver-info'),
        validators: [required, isAddress],
      },
      {
        label: t('erc20.mint-amount-lbl'),
        tooltip: t('erc20.mint-amount-info'),
        validators: [required, numeric],
      },
    ],
  },
]

const submit = async ([
  [paymentTokenAddress],
  [name, symbol, decimals],
  [mintReceiver, mintAmount],
]: string[][]) => {
  txProcessing.value = true
  potentialContractAddress.value = await deploy(
    route.params.id as string,
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

  deployMetadata.value = {
    name: name,
    symbol: symbol,
    contract: potentialContractAddress.value,
    erc20Metadata: {
      decimals: decimals,
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
