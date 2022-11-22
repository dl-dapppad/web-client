<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { txWrapper } from '@/helpers'
import { InfoTooltip, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required, isAddress } from '@/validators'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

const props = defineProps<{
  token: ProductErc721Contract
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
const form = reactive({
  to: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    to: { required, isAddress },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.setApprovalForAll, {
    operator: form.to,
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
