<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { required, isAddress } from '@/validators'
import { formatAmount } from '@/helpers'
import { ProductInteractionForm } from '@/modules/common'
import { RESULT_TYPES } from '@/modules/enums'
import { ProductErc20Contract } from '@/modules/erc20/erc20/composables/use-product-erc20'

const props = defineProps<{
  token: ProductErc20Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'allowance-form.title-lbl': 'Allowance',
      'allowance-form.title-info':
        'Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through transfer. This value changes when `approve` or `transferFrom` are called',
      'allowance-form.owner-lbl': 'Owner',
      'allowance-form.owner-info': 'Enter the token holder address',
      'allowance-form.spender-lbl': 'Spender',
      'allowance-form.spender-info': 'Enter the spender address',
      'allowance-form.btn-lbl': 'Read',
    },
  },
})

const allowanceFormResult = {
  type: RESULT_TYPES.amountWithSymbol,
  data: ref(''),
}

const allowanceFormData = {
  title: t('allowance-form.title-lbl'),
  titleTooltip: t('allowance-form.title-info'),
  inputs: [
    {
      label: t('allowance-form.owner-lbl'),
      tooltip: t('allowance-form.owner-info'),
      validators: [required, isAddress],
    },
    {
      label: t('allowance-form.spender-lbl'),
      tooltip: t('allowance-form.spender-info'),
      validators: [required, isAddress],
    },
  ],
  button: t('allowance-form.btn-lbl'),
}

const submit = async ([owner, spender]: string[]) => {
  allowanceFormResult.data.value = formatAmount(
    await props.token.allowance(owner, spender),
    props.token.decimals.value,
    props.token.symbol.value,
  )
}
</script>

<template>
  <product-interaction-form
    :form-data="allowanceFormData"
    :result="allowanceFormResult"
    @submit="submit"
  />
</template>
