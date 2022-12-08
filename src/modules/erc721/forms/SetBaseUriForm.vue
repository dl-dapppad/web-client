<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, url } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

enum EMITS {
  changeBaseURI = 'change-base-uri',
}

const emit = defineEmits<{
  (e: EMITS.changeBaseURI): void
}>()

const props = defineProps<{
  token: ProductErc721Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'base-uri-form.title-lbl': 'Set base URI',
      'base-uri-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Internal function to set the base URI for all token IDs. It is automatically added as a prefix to the value returned in tokenURI, or to the token ID if tokenURI is empty',
      'base-uri-form.uri-lbl': 'Collection URI',
      'base-uri-form.uri-info': 'Enter a uniform resource identifier',
      'base-uri-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('base-uri-form.title-lbl'),
  titleTooltip: t('base-uri-form.title-info'),
  inputs: [
    {
      label: t('base-uri-form.uri-lbl'),
      tooltip: t('base-uri-form.uri-info'),
      validators: [required, url],
    },
  ],
  button: t('base-uri-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([baseURI]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.setBaseURI, { baseURI })

  emit(EMITS.changeBaseURI)

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
