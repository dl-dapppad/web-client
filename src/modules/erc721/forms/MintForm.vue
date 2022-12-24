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
      'mint-form.title-lbl': 'Mint',
      'mint-form.title-info':
        'Safely mints `tokenId` and transfers it to `recipient`',
      'mint-form.to-lbl': 'Recipient',
      'mint-form.to-info': 'Enter the recipient address',
      'mint-form.token-lbl': 'Token ID',
      'mint-form.token-info': 'Enter the token ID',
      'mint-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('mint-form.title-lbl'),
  titleTooltip: t('mint-form.title-info'),
  inputs: [
    {
      label: t('mint-form.to-lbl'),
      tooltip: t('mint-form.to-info'),
      validators: [required, isAddress],
    },
    {
      label: t('mint-form.token-lbl'),
      tooltip: t('mint-form.token-info'),
      validators: [required, numeric, integer],
    },
  ],
  button: t('mint-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([to, tokenId]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.safeMint, { to, tokenId })

  emit(EMITS.changeBalance)

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
