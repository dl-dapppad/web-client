<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, isAddress, numeric, maxBNValue } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { ProductErc20Contract } from '@/modules/erc20/erc20/composables/use-product-erc20'
import { BN } from '@/utils'

enum EMITS {
  changeBalance = 'change-balance',
}

const emit = defineEmits<{
  (e: EMITS.changeBalance): void
}>()

const props = defineProps<{
  token: ProductErc20Contract
  balance: BN | number | string
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'transfer-form.title-lbl': 'Transfer',
      'transfer-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Moves `amount` tokens from the caller\'s account to `recipient`',
      'transfer-form.recipient-lbl': 'Recipient',
      'transfer-form.recipient-info': 'Enter the recipient address',
      'transfer-form.amount-lbl': 'Amount',
      'transfer-form.amount-info': 'Enter transfer amount',
      'transfer-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('transfer-form.title-lbl'),
  titleTooltip: t('transfer-form.title-info'),
  inputs: [
    {
      label: t('transfer-form.recipient-lbl'),
      tooltip: t('transfer-form.recipient-info'),
      validators: [required, isAddress],
    },
    {
      label: t('transfer-form.amount-lbl'),
      tooltip: t('transfer-form.amount-info'),
      validators: [required, numeric, maxBNValue(props.balance)],
    },
  ],
  button: t('transfer-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([recipient, amount]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.transfer, {
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
