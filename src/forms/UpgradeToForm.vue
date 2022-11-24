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
  changeImplementation = 'change-implementation',
}

const emit = defineEmits<{
  (e: EMITS.changeImplementation): void
}>()

const props = defineProps<{
  token: ProductErc721Contract | ProductErc20Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'upgrade-to-form.title-lbl': 'Upgrade implementation',
      'upgrade-to-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Upgrade smart contract logic to new implementation',
      'upgrade-to-form.impl-lbl': 'New implementation',
      'upgrade-to-form.impl-info': 'Enter a new implementation address',
      'upgrade-to-form.btn-lbl': 'Write',
    },
  },
})

const txProcessing = ref(false)
const form = reactive({
  implementation: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    implementation: { required },
  },
)

const submit = async () => {
  txProcessing.value = true

  await txWrapper(props.token.upgradeTo, {
    implementation: form.implementation,
  })

  emit(EMITS.changeImplementation)

  txProcessing.value = false
}
</script>

<template>
  <div class="app__common-form">
    <div class="app__form-control">
      <span class="app__form-control-title app__common-form__title">
        <info-tooltip :text="t('upgrade-to-form.title-info')" />
        {{ t('upgrade-to-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          v-model="form.implementation"
          scheme="secondary"
          :label="t('upgrade-to-form.impl-lbl')"
          :error-message="getFieldErrorMessage('implementation')"
          @blur="touchField('implementation')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('upgrade-to-form.impl-info')" />
        </div>
      </div>
      <app-button
        type="button"
        size="small"
        :text="t('upgrade-to-form.btn-lbl')"
        :disabled="!isFieldsValid || txProcessing"
        @click="submit"
      />
    </div>
  </div>
</template>
