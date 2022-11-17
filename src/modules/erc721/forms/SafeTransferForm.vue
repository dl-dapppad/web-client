<script lang="ts" setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { txWrapper } from '@/helpers'
import { Icon, InfoTooltip, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required, isAddress, numeric } from '@/validators'
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
    tokenId: { required, numeric },
  },
)

const submit = async () => {
  await txWrapper(props.token.safeTransferFrom, {
    from: form.from,
    to: form.to,
    tokenId: form.tokenId,
  })
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
          :label="t('mint-form.from-lbl')"
          :error-message="getFieldErrorMessage('from')"
          @blur="touchField('from')"
        />
        <info-tooltip
          class="app__field-tooltip"
          :text="t('mint-form.from-info')"
        />
      </div>
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
        :disabled="!isFieldsValid"
        @click="submit"
      />
    </div>
  </div>
</template>