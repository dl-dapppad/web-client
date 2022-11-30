<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { txWrapper } from '@/helpers'
import { InfoTooltip, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required, isAddress, numeric, integer } from '@/validators'
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
const form = reactive({
  to: '',
  tokenId: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    to: { required, isAddress },
    tokenId: { required, numeric, integer },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.approve, {
    to: form.to,
    tokenId: form.tokenId,
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
          v-model="form.to"
          scheme="secondary"
          :label="t('approve-form.to-lbl')"
          :error-message="getFieldErrorMessage('to')"
          @blur="touchField('to')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('approve-form.to-info')" />
        </div>
      </div>
      <div class="app__field-row">
        <input-field
          v-model="form.tokenId"
          scheme="secondary"
          :label="t('approve-form.token-lbl')"
          :error-message="getFieldErrorMessage('tokenId')"
          @blur="touchField('tokenId')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('approve-form.token-info')" />
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
