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
      'owner-form.title-lbl': 'Owner',
      'owner-form.title-info': 'Returns the owner of the `tokenId` token',
      'owner-form.token-lbl': 'Token Id',
      'owner-form.token-info': 'Enter the token ID',
      'owner-form.btn-lbl': 'Read',
    },
  },
})

const formResult = {
  type: PRODUCT_INT_FORM_RESULT_TYPES.address,
  data: ref(''),
}

const formData = {
  title: t('owner-form.title-lbl'),
  titleTooltip: t('owner-form.title-info'),
  inputs: [
    {
      label: t('owner-form.token-lbl'),
      tooltip: t('owner-form.token-info'),
      validators: [required, numeric, integer],
    },
  ],
  button: t('owner-form.btn-lbl'),
}

const submit = async ([tokenId]: string[]) => {
  try {
    formResult.data.value = await props.token.ownerOf(tokenId)
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
