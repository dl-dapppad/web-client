<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, isAddress } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { ProductErc721BaseContract } from '@/modules/erc721/erc721-base/composables/use-product-erc721-base'

const props = defineProps<{
  token: ProductErc721BaseContract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'approve-form.title-lbl': 'Approve All',
      'approve-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Approve or remove `operator` as an operator for the caller',
      'approve-form.to-lbl': 'Spender',
      'approve-form.to-info': 'Enter the spender address',
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
  ],
  button: t('approve-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([to]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.setApprovalForAll, {
    operator: to,
  })

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
