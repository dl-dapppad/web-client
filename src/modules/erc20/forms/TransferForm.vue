<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { txWrapper } from '@/helpers'
import { Icon, InfoTooltip, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required, isAddress, numeric } from '@/validators'
import { ProductErc20Contract } from '@/modules/erc20/erc20/composables/use-product-erc20'
import { BN } from '@/utils'

enum EMITS {
  changeBalance = 'change-balance',
}

const emit = defineEmits<{
  (e: EMITS.changeBalance): void
}>()

const props = defineProps<{
  token: ProductErc20Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'transfer-form.title-lbl': 'Transfer',
      'transfer-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Moves `amount` tokens from the caller\'s account to `recipient`',
      'transfer-form.recipient-lbl': 'Recipient',
      'transfer-form.recipient-info': 'Enter the recipient address',
      'transfer-form.amount-lbl': 'Amount',
      'transfer-form.amount-info': 'Enter transfer amount',
      'transfer-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)
const form = reactive({
  recipient: '',
  amount: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    recipient: { required, isAddress },
    amount: { required, numeric },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.transfer, {
    recipient: form.recipient,
    amount: new BN(form.amount)
      .toFraction(props.token.decimals.value)
      .toString(),
  })

  emit(EMITS.changeBalance)

  txProcessing.value = false
}
</script>

<template>
  <div class="app__common-form">
    <div class="app__form-control">
      <span class="app__form-control-title app__common-form__title">
        <div class="app__common-form__icon">
          <icon
            :name="$icons.informationCircleFilled"
            class="app__common-form__title-icon"
          />
          <div class="app__common-form__popup">
            {{ t('transfer-form.title-info') }}
          </div>
        </div>
        {{ t('transfer-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          v-model="form.recipient"
          scheme="secondary"
          :label="t('transfer-form.recipient-lbl')"
          :error-message="getFieldErrorMessage('recipient')"
          @blur="touchField('spender')"
        />
        <info-tooltip
          class="app__field-tooltip"
          :text="t('transfer-form.recipient-info')"
        />
      </div>
      <div class="app__field-row">
        <input-field
          v-model="form.amount"
          scheme="secondary"
          :label="t('transfer-form.amount-lbl')"
          :error-message="getFieldErrorMessage('amount')"
          @blur="touchField('amount')"
        />
        <info-tooltip
          class="app__field-tooltip"
          :text="t('transfer-form.amount-info')"
        />
      </div>
      <app-button
        type="button"
        size="small"
        :text="t('transfer-form.btn-lbl')"
        :disabled="!isFieldsValid || txProcessing"
        @click="submit"
      />
    </div>
  </div>
</template>
