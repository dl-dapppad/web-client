<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { txWrapper } from '@/helpers'
import { InfoTooltip, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required, isAddress, numeric } from '@/validators'
import { ProductErc20Contract } from '@/modules/erc20/erc20/composables/use-product-erc20'
import { BN } from '@/utils'

const props = defineProps<{
  token: ProductErc20Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'approve-form.title-lbl': 'Approve',
      'approve-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Sets `amount` as the allowance of `spender` over the caller\'s tokens',
      'approve-form.spender-lbl': 'Spender',
      'approve-form.spender-info': 'Enter the spender address',
      'approve-form.amount-lbl': 'Amount',
      'approve-form.amount-info': 'Enter the approved amount',
      'approve-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)
const form = reactive({
  spender: '',
  amount: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    spender: { required, isAddress },
    amount: { required, numeric },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.approve, {
    spender: form.spender,
    amount: new BN(form.amount)
      .toFraction(props.token.decimals.value)
      .toString(),
  })

  txProcessing.value = false
}
</script>

<template>
  <div class="app__common-form">
    <div class="app__form-control">
      <span class="app__form-control-title app__common-form__title">
        <info-tooltip :text="t('approve-form.title-info')" />
        {{ t('approve-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          v-model="form.spender"
          scheme="secondary"
          :label="t('approve-form.spender-lbl')"
          :error-message="getFieldErrorMessage('spender')"
          @blur="touchField('spender')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('approve-form.spender-info')" />
        </div>
      </div>
      <div class="app__field-row">
        <input-field
          v-model="form.amount"
          scheme="secondary"
          :label="t('approve-form.amount-lbl')"
          :error-message="getFieldErrorMessage('amount')"
          @blur="touchField('amount')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('approve-form.amount-info')" />
        </div>
      </div>
      <app-button
        type="button"
        size="small"
        :text="t('approve-form.btn-lbl')"
        :disabled="!isFieldsValid || txProcessing"
        @click="submit"
      />
    </div>
  </div>
</template>
