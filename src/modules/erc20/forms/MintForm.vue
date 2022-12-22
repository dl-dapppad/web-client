<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, isAddress, numeric } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { BN } from '@/utils'
import { ProductErc20MintContract } from '@/modules/erc20/erc20-mint/composables/use-product-erc20-mint'

enum EMITS {
  changeBalance = 'change-balance',
}

const emit = defineEmits<{
  (e: EMITS.changeBalance): void
}>()

const props = defineProps<{
  token: ProductErc20MintContract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'mint-form.title-lbl': 'Mint',
      'mint-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Mint `amount` of tokens to `recipient`',
      'mint-form.recipient-lbl': 'Recipient',
      'mint-form.recipient-info': 'Enter the recipient address',
      'mint-form.amount-lbl': 'Amount',
      'mint-form.amount-info': 'Enter the mint amount',
      'mint-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('mint-form.title-lbl'),
  titleTooltip: t('mint-form.title-info'),
  inputs: [
    {
      label: t('mint-form.recipient-lbl'),
      tooltip: t('mint-form.recipient-info'),
      validators: [required, isAddress],
    },
    {
      label: t('mint-form.amount-lbl'),
      tooltip: t('mint-form.amount-info'),
      validators: [required, numeric],
    },
  ],
  button: t('mint-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([recipient, amount]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.mint, {
    recipient,
    amount: new BN(amount).toFraction(props.token.decimals.value).toString(),
  })

  emit(EMITS.changeBalance)

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
