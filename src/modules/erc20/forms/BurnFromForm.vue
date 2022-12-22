<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { txWrapper } from '@/helpers'
import { required, isAddress, numeric } from '@/validators'
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
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'burn-from-form.title-lbl': 'Burn From',
      'burn-from-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Burn `amount` of tokens from `account`',
      'burn-from-form.account-lbl': 'Recipient',
      'burn-from-form.account-info': 'Enter the burn account address',
      'burn-from-form.amount-lbl': 'Amount',
      'burn-from-form.amount-info': 'Enter the burn amount',
      'burn-from-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)

const formData = {
  title: t('burn-from-form.title-lbl'),
  titleTooltip: t('burn-from-form.title-info'),
  inputs: [
    {
      label: t('burn-from-form.account-lbl'),
      tooltip: t('burn-from-form.account-info'),
      validators: [required, isAddress],
    },
    {
      label: t('burn-from-form.amount-lbl'),
      tooltip: t('burn-from-form.amount-info'),
      validators: [required, numeric],
    },
  ],
  button: t('burn-from-form.btn-lbl'),
  buttonDisabled: txProcessing,
}

const submit = async ([account, amount]: string[]) => {
  txProcessing.value = true

  await txWrapper(props.token.burnFrom, {
    account,
    amount: new BN(amount).toFraction(props.token.decimals.value).toString(),
  })

  emit(EMITS.changeBalance)

  txProcessing.value = false
}
</script>

<template>
  <product-interaction-form :form-data="formData" @submit="submit" />
</template>
