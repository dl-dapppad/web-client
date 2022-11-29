<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { txWrapper } from '@/helpers'
import { InfoTooltip, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required } from '@/validators'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

enum EMITS {
  changeBaseURI = 'change-base-uri',
}

const emit = defineEmits<{
  (e: EMITS.changeBaseURI): void
}>()

const props = defineProps<{
  token: ProductErc721Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'base-uri-form.title-lbl': 'Set base URI',
      'base-uri-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Internal function to set the base URI for all token IDs. It is automatically added as a prefix to the value returned in tokenURI, or to the token ID if tokenURI is empty',
      'base-uri-form.uri-lbl': 'Collection URI',
      'base-uri-form.uri-info': 'Enter a uniform resource identifier',
      'base-uri-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)
const form = reactive({
  baseURI: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    baseURI: { required },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.setBaseURI, {
    baseURI: form.baseURI,
  })

  emit(EMITS.changeBaseURI)

  txProcessing.value = false
}
</script>

<template>
  <div class="app__common-form">
    <div class="app__form-control">
      <span class="app__form-control-title app__common-form__title">
        <info-tooltip :text="t('base-uri-form.title-info')" />
        {{ t('base-uri-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          v-model="form.baseURI"
          scheme="secondary"
          :label="t('base-uri-form.uri-lbl')"
          :error-message="getFieldErrorMessage('baseURI')"
          @blur="touchField('baseURI')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('base-uri-form.uri-info')" />
        </div>
      </div>
      <app-button
        type="button"
        size="small"
        :text="t('base-uri-form.btn-lbl')"
        :disabled="!isFieldsValid || txProcessing"
        @click="submit"
      />
    </div>
  </div>
</template>
