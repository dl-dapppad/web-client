<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, isAddress, numeric, integer } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

const props = defineProps<{
  token: ProductErc721Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'approve-form.title-lbl': 'Approve',
      'approve-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Gives permission to `spender` to transfer `tokenId` token to another account',
      'approve-form.to-lbl': 'Spender',
      'approve-form.to-info': 'Enter the spender address',
      'approve-form.token-lbl': 'Token ID',
      'approve-form.token-info': 'Enter the token ID',
      'approve-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('approve-form.title-lbl'),
  titleTooltip: t('approve-form.title-info'),
  inputs: [
    {
      label: t('approve-form.to-lbl'),
      tooltip: t('approve-form.to-info'),
      validators: [required, isAddress],
    },
    {
      label: t('approve-form.token-lbl'),
      tooltip: t('approve-form.token-info'),
      validators: [required, numeric, integer],
    },
  ],
  button: t('approve-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([to, tokenId]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.approve, { to, tokenId })

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
