<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { handleTxError } from '@/helpers'
import { required, isAddress } from '@/validators'
import { ProductInteractionForm } from '@/modules/common'
import { PRODUCT_INT_FORM_RESULT_TYPES } from '@/modules/enums'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

const props = defineProps<{
  token: ProductErc721Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'balance-form.title-lbl': 'Balance',
      'balance-form.title-info': 'Get the amount of NFTs owned by `account`',
      'balance-form.account-lbl': 'Account',
      'balance-form.account-info': 'Enter the account address',
      'balance-form.btn-lbl': 'Read',
    },
  },
})

const formResult = {
  type: PRODUCT_INT_FORM_RESULT_TYPES.amount,
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
  try {
    formResult.data.value = await props.token.balanceOf(account)
  } catch (e) {
    handleTxError(e)
  }
}
</script>

<template>
  <product-interaction-form
    :form-data="formData"
    :result="formResult"
    @submit="submit"
  />
</template>
