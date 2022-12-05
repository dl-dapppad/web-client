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
      'transfer-from-form.title-lbl': 'Transfer From',
      'transfer-from-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Moves `amount` tokens from `sender` to `recipient` using the allowance mechanism. `amount` is then deducted from the caller’s `allowance`',
      'transfer-from-form.sender-lbl': 'Sender',
      'transfer-from-form.sender-info': 'Enter the sender address',
      'transfer-from-form.recipient-lbl': 'Recipient',
      'transfer-from-form.recipient-info': 'Enter the recipient address',
      'transfer-from-form.amount-lbl': 'Amount',
      'transfer-from-form.amount-info': 'Enter transfer amount',
      'transfer-from-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)
const form = reactive({
  sender: '',
  recipient: '',
  amount: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    sender: { required, isAddress },
    recipient: { required, isAddress },
    amount: { required, numeric },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.transferFrom, {
    sender: form.sender,
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
        <info-tooltip :text="t('transfer-from-form.title-info')" />
        {{ t('transfer-from-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          class="app__module-field"
          v-model="form.sender"
          scheme="secondary"
          :label="t('transfer-from-form.sender-lbl')"
          :error-message="getFieldErrorMessage('sender')"
          @blur="touchField('sender')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('transfer-from-form.sender-info')" />
        </div>
      </div>
      <div class="app__field-row">
        <input-field
          class="app__module-field"
          v-model="form.recipient"
          scheme="secondary"
          :label="t('transfer-from-form.recipient-lbl')"
          :error-message="getFieldErrorMessage('recipient')"
          @blur="touchField('recipient')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('transfer-from-form.recipient-info')" />
        </div>
      </div>
      <div class="app__field-row">
        <input-field
          class="app__module-field"
          v-model="form.amount"
          scheme="secondary"
          :label="t('transfer-from-form.amount-lbl')"
          :error-message="getFieldErrorMessage('amount')"
          @blur="touchField('amount')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('transfer-from-form.amount-info')" />
        </div>
      </div>
      <app-button
        class="app__submit-btn"
        type="button"
        size="small"
        :text="t('transfer-from-form.btn-lbl')"
        :disabled="!isFieldsValid || txProcessing"
        @click="submit"
      />
    </div>
  </div>
</template>
