<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, isAddress } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { ProductErc721Contract } from '@/modules/erc721/erc721-base/composables/use-product-erc721'
import { ProductErc20Contract } from '@/modules/erc20/erc20-base/composables/use-product-erc20'

enum EMITS {
  changeOwner = 'change-owner',
}

const emit = defineEmits<{
  (e: EMITS.changeOwner): void
}>()

const props = defineProps<{
  token: ProductErc721Contract | ProductErc20Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'transfer-owner-form.title-lbl': 'Transfer ownership',
      'transfer-owner-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Transfers ownership of the contract to a new account (newOwner). Can only be called by the current owner',
      'transfer-owner-form.owner-lbl': 'New owner',
      'transfer-owner-form.owner-info': 'Enter a new owner address',
      'transfer-owner-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('transfer-owner-form.title-lbl'),
  titleTooltip: t('transfer-owner-form.title-info'),
  inputs: [
    {
      label: t('transfer-owner-form.owner-lbl'),
      tooltip: t('transfer-owner-form.owner-info'),
      validators: [required, isAddress],
    },
  ],
  button: t('transfer-owner-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([newOwner]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.transferOwnership, { newOwner })

  emit(EMITS.changeOwner)

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
