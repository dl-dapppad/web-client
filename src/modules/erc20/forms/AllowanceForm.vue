<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { Icon, InfoTooltip, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required, isAddress } from '@/validators'
import { formatAmount } from '@/helpers'
import { ProductErc20Contract } from '@/modules/erc20/erc20/composables/use-product-erc20'

const props = defineProps<{
  token: ProductErc20Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'allowance-form.title-lbl': 'Allowance',
      'allowance-form.title-info':
        'Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through transfer. This value changes when `approve` or `transferFrom` are called',
      'allowance-form.owner-lbl': 'Owner',
      'allowance-form.owner-info': 'Enter the token holder address',
      'allowance-form.spender-lbl': 'Spender',
      'allowance-form.spender-info': 'Enter the spender address',
      'allowance-form.btn-lbl': 'Read',
    },
  },
})

const form = reactive({
  owner: '',
  spender: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    owner: { required, isAddress },
    spender: { required, isAddress },
  },
)

const result = ref('')

const submit = async () => {
  result.value = await props.token.allowance(form.owner, form.spender)
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
            {{ t('allowance-form.title-info') }}
          </div>
        </div>
        {{ t('allowance-form.title-lbl') }}
      </span>
      <div class="app__field-row">
        <input-field
          v-model="form.owner"
          scheme="secondary"
          :label="t('allowance-form.owner-lbl')"
          :error-message="getFieldErrorMessage('owner')"
          @blur="touchField('owner')"
        />
        <info-tooltip
          class="app__field-tooltip"
          :text="t('allowance-form.owner-info')"
        />
      </div>
      <div class="app__field-row">
        <input-field
          v-model="form.spender"
          scheme="secondary"
          :label="t('allowance-form.spender-lbl')"
          :error-message="getFieldErrorMessage('spender')"
          @blur="touchField('spender')"
        />
        <info-tooltip
          class="app__field-tooltip"
          :text="t('allowance-form.spender-info')"
        />
      </div>
      <div class="app__common-form__button-wrp">
        <app-button
          type="button"
          size="small"
          :text="t('allowance-form.btn-lbl')"
          :disabled="!isFieldsValid"
          @click="submit"
        />
        <div v-if="result">
          {{ formatAmount(result, props.token.decimals.value) }}
          <span>{{ props.token.symbol.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
