<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { handleTxError } from '@/helpers'
import { required, numeric, integer } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { PRODUCT_INT_FORM_RESULT_TYPES } from '@/modules/enums'
import { ProductErc721BaseContract } from '@/modules/erc721/erc721-base/composables/use-product-erc721-base'

const props = defineProps<{
  token: ProductErc721BaseContract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'token-uri.title-lbl': 'Token URI',
      'token-uri.title-info':
        'Returns the Uniform Resource Identifier (URI) for `tokenId` token.',
      'token-uri.token-lbl': 'Token Id',
      'token-uri.token-info': 'Enter the token ID',
      'token-uri.btn-lbl': 'Read',
    },
  },
})

const formResult = {
  type: PRODUCT_INT_FORM_RESULT_TYPES.link,
  data: ref(''),
}

const formData = {
  title: t('token-uri.title-lbl'),
  titleTooltip: t('token-uri.title-info'),
  inputs: [
    {
      label: t('token-uri.token-lbl'),
      tooltip: t('token-uri.token-info'),
      validators: [required, numeric, integer],
    },
  ],
  button: t('token-uri.btn-lbl'),
}

const submit = async ([tokenId]: string[]) => {
  try {
    formResult.data.value = await props.token.tokenURI(tokenId)
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
