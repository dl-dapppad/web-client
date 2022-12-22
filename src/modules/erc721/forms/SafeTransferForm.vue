<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, isAddress, numeric, integer } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { ProductErc721BaseContract } from '@/modules/erc721/erc721-base/composables/use-product-erc721-base'

enum EMITS {
  changeBalance = 'change-balance',
}

const emit = defineEmits<{
  (e: EMITS.changeBalance): void
}>()

const props = defineProps<{
  token: ProductErc721BaseContract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'safe-transfer-form.title-lbl': 'Safe Transfer',
      'safe-transfer-form.title-info':
        'Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked',
      'safe-transfer-form.from-lbl': 'Sender',
      'safe-transfer-form.from-info': 'Enter the sender address',
      'safe-transfer-form.to-lbl': 'Recipient',
      'safe-transfer-form.to-info': 'Enter the recipient address',
      'safe-transfer-form.token-lbl': 'Token ID',
      'safe-transfer-form.token-info': 'Enter the token ID',
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
      label: t('safe-transfer-form.from-lbl'),
      tooltip: t('safe-transfer-form.from-info'),
      validators: [required, isAddress],
    },
    {
      label: t('safe-transfer-form.to-lbl'),
      tooltip: t('safe-transfer-form.to-info'),
      validators: [required, isAddress],
    },
    {
      label: t('safe-transfer-form.token-lbl'),
      tooltip: t('safe-transfer-form.token-info'),
      validators: [required, numeric, integer],
    },
  ],
  button: t('safe-transfer-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([from, to, tokenId]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.safeTransferFrom, { from, to, tokenId })

  emit(EMITS.changeBalance)

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
