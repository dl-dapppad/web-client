<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { handleTxError } from '@/helpers'
import { required, numeric, integer } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { PRODUCT_INT_FORM_RESULT_TYPES } from '@/modules/enums'
import { ProductErc721EnumContract } from '@/modules/erc721/erc721-enum/composables/use-product-erc721-enum'

const props = defineProps<{
  token: ProductErc721EnumContract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'balance-form.title-lbl': 'Token by Index',
      'balance-form.title-info':
        'Returns a token ID at a given `index` of all the tokens stored by the contract',
      'balance-form.index-lbl': 'Index',
      'balance-form.index-info': 'Enter the token index',
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
      label: t('balance-form.index-lbl'),
      tooltip: t('balance-form.index-info'),
      validators: [required, numeric, integer],
    },
  ],
  button: t('balance-form.btn-lbl'),
}

const submit = async ([index]: string[]) => {
  try {
    formResult.data.value = await props.token.tokenByIndex(index)
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
