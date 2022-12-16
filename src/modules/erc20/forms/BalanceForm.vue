<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatAmount } from '@/helpers'
import { required, isAddress } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { PRODUCT_INT_FORM_RESULT_TYPES } from '@/modules/enums'
import { ProductErc20BaseContract } from '@/modules/erc20/erc20-base/composables/use-product-erc20-base'

const props = defineProps<{
  token: ProductErc20BaseContract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'balance-form.title-lbl': 'Balance',
      'balance-form.title-info': 'Get the amount of tokens owned by `account`',
      'balance-form.account-lbl': 'Account',
      'balance-form.account-info': 'Enter the account address',
      'balance-form.btn-lbl': 'Read',
    },
  },
})

const formResult = {
  type: PRODUCT_INT_FORM_RESULT_TYPES.amountWithSymbol,
  data: ref(''),
}

const formData = {
  title: t('balance-form.title-lbl'),
  titleTooltip: t('balance-form.title-info'),
  inputs: [
    {
      label: t('balance-form.account-lbl'),
      tooltip: t('balance-form.account-info'),
      validators: [required, isAddress],
    },
  ],
  button: t('balance-form.btn-lbl'),
}

const submit = async ([account]: string[]) => {
  formResult.data.value = formatAmount(
    await props.token.balanceOf(account),
    props.token.decimals.value,
    props.token.symbol.value,
  )
}
</script>

<template>
  <product-interaction-form
    :form-data="formData"
    :result="formResult"
    @submit="submit"
  />
</template>
