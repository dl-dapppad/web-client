<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { handleTxError } from '@/helpers'
import { required, numeric, integer } from '@/validators'
import { ProductInteractionForm } from '@/modules/common'
import { RESULT_TYPES } from '@/modules/enums'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

const props = defineProps<{
  token: ProductErc721Contract
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

const ownerFormResult = {
  type: RESULT_TYPES.address,
  data: ref(''),
}

const ownerFormData = {
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
    ownerFormResult.data.value = await props.token.ownerOf(tokenId)
  } catch (e) {
    handleTxError(e)
  }
}
</script>

<template>
  <product-interaction-form
    :form-data="ownerFormData"
    :result="ownerFormResult"
    @submit="submit"
  />
</template>
