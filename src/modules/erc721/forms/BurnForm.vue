<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, numeric, integer } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { ProductErc721BurnContract } from '@/modules/erc721/erc721-burn/composables/use-product-erc721-burn'

enum EMITS {
  changeBalance = 'change-balance',
}

const emit = defineEmits<{
  (e: EMITS.changeBalance): void
}>()

const props = defineProps<{
  token: ProductErc721BurnContract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'safe-transfer-form.title-lbl': 'Burn',
      'safe-transfer-form.title-info': 'Burns `tokenId`',
      'safe-transfer-form.token-lbl': 'Token ID',
      'safe-transfer-form.token-info': 'Enter the token ID to burn',
      'safe-transfer-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('safe-transfer-form.title-lbl'),
  titleTooltip: t('safe-transfer-form.title-info'),
  inputs: [
    {
      label: t('safe-transfer-form.token-lbl'),
      tooltip: t('safe-transfer-form.token-info'),
      validators: [required, numeric, integer],
    },
  ],
  button: t('safe-transfer-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([tokenId]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.burn, { tokenId })

  emit(EMITS.changeBalance)

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
