<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, isAddress, numeric } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { BN } from '@/utils'
import { ProductErc20BaseContract } from '@/modules/erc20/erc20-base/composables/use-product-erc20-base'

const props = defineProps<{
  token: ProductErc20BaseContract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'approve-form.title-lbl': 'Approve',
      'approve-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Sets `amount` as the allowance of `spender` over the caller\'s tokens',
      'approve-form.spender-lbl': 'Spender',
      'approve-form.spender-info': 'Enter the spender address',
      'approve-form.amount-lbl': 'Amount',
      'approve-form.amount-info': 'Enter the approved amount',
      'approve-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('approve-form.title-lbl'),
  titleTooltip: t('approve-form.title-info'),
  inputs: [
    {
      label: t('approve-form.spender-lbl'),
      tooltip: t('approve-form.spender-info'),
      validators: [required, isAddress],
    },
    {
      label: t('approve-form.amount-lbl'),
      tooltip: t('approve-form.amount-info'),
      validators: [required, numeric],
    },
  ],
  button: t('approve-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([spender, amount]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.approve, {
    spender,
    amount: new BN(amount).toFraction(props.token.decimals.value).toString(),
  })

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
