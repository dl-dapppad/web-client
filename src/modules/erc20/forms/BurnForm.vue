<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, numeric, maxBNValue } from '@/validators'
import { ProductInteractionForm } from '@/modules/forms'
import { BN } from '@/utils'
import { ProductErc20BurnContract } from '@/modules/erc20/erc20-burn/composables/use-product-erc20-burn'

enum EMITS {
  changeBalance = 'change-balance',
}

const emit = defineEmits<{
  (e: EMITS.changeBalance): void
}>()

const props = defineProps<{
  token: ProductErc20BurnContract
  balance: string
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'burn-form.title-lbl': 'Burn',
      'burn-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Burn `amount` of tokens from your account',
      'burn-form.amount-lbl': 'Amount',
      'burn-form.amount-info': 'Enter the burn amount',
      'burn-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('burn-form.title-lbl'),
  titleTooltip: t('burn-form.title-info'),
  inputs: [
    {
      label: t('burn-form.amount-lbl'),
      tooltip: t('burn-form.amount-info'),
      validators: [required, numeric, maxBNValue(props.balance)],
    },
  ],
  button: t('burn-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([amount]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.burn, {
    amount: new BN(amount).toFraction(props.token.decimals.value).toString(),
  })

  emit(EMITS.changeBalance)

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
