<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, isAddress, numeric } from '@/validators'
import { ProductInteractionForm } from '@/modules/common'
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
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'transfer-from-form.title-lbl': 'Transfer From',
      'transfer-from-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Moves `amount` tokens from `sender` to `recipient` using the allowance mechanism. `amount` is then deducted from the caller’s `allowance`',
      'transfer-from-form.sender-lbl': 'Sender',
      'transfer-from-form.sender-info': 'Enter the sender address',
      'transfer-from-form.recipient-lbl': 'Recipient',
      'transfer-from-form.recipient-info': 'Enter the recipient address',
      'transfer-from-form.amount-lbl': 'Amount',
      'transfer-from-form.amount-info': 'Enter transfer amount',
      'transfer-from-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('transfer-from-form.title-lbl'),
  titleTooltip: t('transfer-from-form.title-info'),
  inputs: [
    {
      label: t('transfer-from-form.sender-lbl'),
      tooltip: t('transfer-from-form.sender-info'),
      validators: [required, isAddress],
    },
    {
      label: t('transfer-from-form.recipient-lbl'),
      tooltip: t('transfer-from-form.recipient-info'),
      validators: [required, numeric],
    },
    {
      label: t('transfer-from-form.amount-lbl'),
      tooltip: t('transfer-from-form.amount-info'),
      validators: [required, numeric],
    },
  ],
  button: t('transfer-from-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([sender, recipient, amount]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.transferFrom, {
    sender,
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
