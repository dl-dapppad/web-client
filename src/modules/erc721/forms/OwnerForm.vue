<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { InfoTooltip, AppButton } from '@/common'
import { copyToClipboard, handleTxError } from '@/helpers'
import { useFormValidation } from '@/composables'
import { required, numeric } from '@/validators'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

const props = defineProps<{
  token: ProductErc721Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'balance-form.title-lbl': 'Owner',
      'balance-form.title-info': 'Returns the owner of the `tokenId` token',
      'balance-form.token-lbl': 'Token Id',
      'balance-form.token-info': 'Enter the token ID',
      'balance-form.btn-lbl': 'Read',
    },
  },
})

const form = reactive({
  tokenId: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    tokenId: { required, numeric },
  },
)

const result = ref('')

const submit = async () => {
  try {
    result.value = await props.token.ownerOf(form.tokenId)
  } catch (e) {
    handleTxError(e)
  }
}
</script>

<template>
  <div class="app__common-form">
    <div class="app__form-control">
      <span class="app__form-control-title app__common-form__title">
        <info-tooltip :text="t('balance-form.title-info')" />
        {{ t('balance-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          v-model="form.tokenId"
          scheme="secondary"
          :label="t('balance-form.token-lbl')"
          :error-message="getFieldErrorMessage('tokenId')"
          @blur="touchField('tokenId')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('balance-form.token-info')" />
        </div>
      </div>
      <div class="app__common-form__button-wrp">
        <app-button
          type="button"
          size="small"
          :text="t('balance-form.btn-lbl')"
          :disabled="!isFieldsValid"
          @click="submit"
        />
        <div v-if="result">
          <app-button
            scheme="default"
            color="secondary"
            size="default"
            :text="result"
            :icon-right="$icons.duplicate"
            @click="copyToClipboard(result)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
