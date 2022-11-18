<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { txWrapper } from '@/helpers'
import { Icon, InfoTooltip, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required, isAddress, numeric } from '@/validators'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

enum EMITS {
  changeBalance = 'change-balance',
}

const emit = defineEmits<{
  (e: EMITS.changeBalance): void
}>()

const props = defineProps<{
  token: ProductErc721Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'mint-form.title-lbl': 'Mint',
      'mint-form.title-info':
        'Safely mints `tokenId` and transfers it to `recipient`',
      'mint-form.to-lbl': 'Recipient',
      'mint-form.to-info': 'Enter the recipient address',
      'mint-form.token-lbl': 'Token ID',
      'mint-form.token-info': 'Enter the token ID',
      'mint-form.btn-lbl': 'Write',
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
    tokenId: { required, numeric },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.safeMint, {
    to: form.to,
    tokenId: form.tokenId,
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
            {{ t('mint-form.title-info') }}
          </div>
        </div>
        {{ t('mint-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          v-model="form.to"
          scheme="secondary"
          :label="t('mint-form.to-lbl')"
          :error-message="getFieldErrorMessage('to')"
          @blur="touchField('to')"
        />
        <info-tooltip
          class="app__field-tooltip"
          :text="t('mint-form.to-info')"
        />
      </div>
      <div class="app__field-row">
        <input-field
          v-model="form.tokenId"
          scheme="secondary"
          :label="t('mint-form.token-lbl')"
          :error-message="getFieldErrorMessage('tokenId')"
          @blur="touchField('tokenId')"
        />
        <info-tooltip
          class="app__field-tooltip"
          :text="t('mint-form.token-info')"
        />
      </div>
      <app-button
        type="button"
        size="small"
        :text="t('mint-form.btn-lbl')"
        :disabled="!isFieldsValid || txProcessing"
        @click="submit"
      />
    </div>
  </div>
</template>
