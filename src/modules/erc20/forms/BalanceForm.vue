<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { InfoTooltip, AppButton } from '@/common'
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
      'balance-form.title-lbl': 'Balance',
      'balance-form.title-info': 'Get the amount of tokens owned by `account`',
      'balance-form.account-lbl': 'Account',
      'balance-form.account-info': 'Enter the account address',
      'balance-form.btn-lbl': 'Read',
    },
  },
})

const form = reactive({
  account: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    account: { required, isAddress },
  },
)

const result = ref('')

const submit = async () => {
  result.value = await props.token.balanceOf(form.account)
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
          v-model="form.account"
          scheme="secondary"
          :label="t('balance-form.account-lbl')"
          :error-message="getFieldErrorMessage('account')"
          @blur="touchField('account')"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="t('balance-form.account-info')" />
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
          {{ formatAmount(result, props.token.decimals.value) }}
          <span>{{ props.token.symbol.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
