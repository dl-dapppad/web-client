<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { ProductErc721Contract } from '@/modules/erc721/erc721-base/composables/use-product-erc721'
import { ProductErc20Contract } from '@/modules/erc20/erc20-base/composables/use-product-erc20'

enum EMITS {
  changeImplementation = 'change-implementation',
}

const emit = defineEmits<{
  (e: EMITS.changeImplementation): void
}>()

const props = defineProps<{
  token: ProductErc721Contract | ProductErc20Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'upgrade-to-form.title-lbl': 'Upgrade implementation',
      'upgrade-to-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Upgrade smart contract logic to new implementation',
      'upgrade-to-form.impl-lbl': 'Implementation',
      'upgrade-to-form.impl-info': 'Enter a new implementation address',
      'upgrade-to-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('upgrade-to-form.title-lbl'),
  titleTooltip: t('upgrade-to-form.title-info'),
  inputs: [
    {
      label: t('upgrade-to-form.impl-lbl'),
      tooltip: t('upgrade-to-form.impl-info'),
      validators: [required],
    },
  ],
  button: t('upgrade-to-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([implementation]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.upgradeTo, { implementation })

  emit(EMITS.changeImplementation)

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
