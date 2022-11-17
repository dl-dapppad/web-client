<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { Icon, InfoTooltip, AppButton } from '@/common'
import { handleTxError } from '@/helpers'
import { useFormValidation } from '@/composables'
import { required, isAddress } from '@/validators'
import { ProductErc721Contract } from '@/modules/erc721/erc721/composables/use-product-erc721'

const props = defineProps<{
  token: ProductErc721Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'balance-form.title-lbl': 'Balance',
      'balance-form.title-info': 'Get the amount of NFTs owned by `account`',
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
  try {
    result.value = await props.token.balanceOf(form.account)
  } catch (e) {
    handleTxError(e)
  }
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
            {{ t('balance-form.title-info') }}
          </div>
        </div>
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
        <info-tooltip
          class="app__field-tooltip"
          :text="t('balance-form.account-info')"
        />
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
          {{ result }}
        </div>
      </div>
    </div>
  </div>
</template>
