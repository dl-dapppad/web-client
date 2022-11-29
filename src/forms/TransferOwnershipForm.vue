<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { txWrapper } from '@/helpers'
import { InfoTooltip, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required } from '@/validators'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'
import { ProductErc20Contract } from '@/modules/erc20/erc20/composables/use-product-erc20'

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
      'transfer-owner-form.owner-lbl': 'New contract owner',
      'transfer-owner-form.owner-info': 'Enter a new owner address',
      'transfer-owner-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)
const form = reactive({
  newOwner: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    newOwner: { required },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.transferOwnership, {
    newOwner: form.newOwner,
  })

  emit(EMITS.changeOwner)

  txProcessing.value = false
}
</script>

<template>
  <div class="app__common-form">
    <div class="app__form-control">
      <span class="app__form-control-title app__common-form__title">
        <info-tooltip :text="t('transfer-owner-form.title-info')" />
        {{ t('transfer-owner-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          v-model="form.newOwner"
          scheme="secondary"
          :label="t('transfer-owner-form.owner-lbl')"
          :error-message="getFieldErrorMessage('newOwner')"
          @blur="touchField('newOwner')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('transfer-owner-form.owner-info')" />
        </div>
      </div>
      <app-button
        type="button"
        size="small"
        :text="t('transfer-owner-form.btn-lbl')"
        :disabled="!isFieldsValid || txProcessing"
        @click="submit"
      />
    </div>
  </div>
</template>
