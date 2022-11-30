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
      'mint-form.title-lbl': 'Safe Transfer',
      'mint-form.title-info':
        'Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked',
      'mint-form.from-lbl': 'Sender',
      'mint-form.from-info': 'Enter the sender address',
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
  from: '',
  to: '',
  tokenId: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    from: { required, isAddress },
    to: { required, isAddress },
    tokenId: { required, numeric, integer },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.safeTransferFrom, {
    from: form.from,
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
        <info-tooltip :text="t('mint-form.title-info')" />
        {{ t('mint-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          v-model="form.from"
          scheme="secondary"
          :label="t('mint-form.from-lbl')"
          :error-message="getFieldErrorMessage('from')"
          @blur="touchField('from')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('mint-form.from-info')" />
        </div>
      </div>
      <div class="app__field-row">
        <input-field
          v-model="form.to"
          scheme="secondary"
          :label="t('mint-form.to-lbl')"
          :error-message="getFieldErrorMessage('to')"
          @blur="touchField('to')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('mint-form.to-info')" />
        </div>
      </div>
      <div class="app__field-row">
        <input-field
          v-model="form.tokenId"
          scheme="secondary"
          :label="t('mint-form.token-lbl')"
          :error-message="getFieldErrorMessage('tokenId')"
          @blur="touchField('tokenId')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('mint-form.token-info')" />
        </div>
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
