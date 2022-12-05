<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { InfoTooltip, AppButton, LinkCopy } from '@/common'
import { handleTxError } from '@/helpers'
import { useFormValidation } from '@/composables'
import { required, numeric, integer } from '@/validators'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

const props = defineProps<{
  token: ProductErc721Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'token-uri.title-lbl': 'Token URI',
      'token-uri.title-info':
        'Returns the Uniform Resource Identifier (URI) for `tokenId` token.',
      'token-uri.token-lbl': 'Token Id',
      'token-uri.token-info': 'Enter the token ID',
      'token-uri.btn-lbl': 'Read',
    },
  },
})

const form = reactive({
  tokenId: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    tokenId: { required, numeric, integer },
  },
)

const result = ref('')

const submit = async () => {
  try {
    result.value = await props.token.tokenURI(form.tokenId)
  } catch (e) {
    handleTxError(e)
  }
}
</script>

<template>
  <div class="app__common-form">
    <div class="app__form-control">
      <span class="app__form-control-title app__common-form__title">
        <info-tooltip :text="t('token-uri.title-info')" />
        {{ t('token-uri.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          class="app__module-field"
          v-model="form.tokenId"
          scheme="secondary"
          :label="t('token-uri.token-lbl')"
          :error-message="getFieldErrorMessage('tokenId')"
          @blur="touchField('tokenId')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('token-uri.token-info')" />
        </div>
      </div>
      <div class="app__common-form__button-wrp">
        <app-button
          class="app__submit-btn"
          type="button"
          size="small"
          :text="t('token-uri.btn-lbl')"
          :disabled="!isFieldsValid"
          @click="submit"
        />
        <div v-if="result">
          <link-copy
            class="app__link--accented"
            :address="result"
            :href="result"
            :is-cropped="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
