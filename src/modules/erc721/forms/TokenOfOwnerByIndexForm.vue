<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { handleTxError } from '@/helpers'
import { required, isAddress, numeric, integer } from '@/validators'
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
      'balance-form.title-lbl': 'Token of Owner by Index',
      'balance-form.title-info':
        'Returns a token ID owned by `owner` at a given `index` of its token list',
      'balance-form.owner-lbl': 'Token owner',
      'balance-form.owner-info': 'Enter the token owner',
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
      label: t('balance-form.owner-lbl'),
      tooltip: t('balance-form.owner-info'),
      validators: [required, isAddress],
    },
    {
      label: t('balance-form.index-lbl'),
      tooltip: t('balance-form.index-info'),
      validators: [required, numeric, integer],
    },
  ],
  button: t('balance-form.btn-lbl'),
}

const submit = async ([owner, index]: string[]) => {
  try {
    formResult.data.value = await props.token.tokenOfOwnerByIndex(owner, index)
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
