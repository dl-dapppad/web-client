<script lang="ts" setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { txWrapper } from '@/helpers'
import { Icon, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required, isAddress, numeric } from '@/validators'
import { ProductErc20Contract } from '@/modules/ERC20/composables/use-product-erc20'
import { BN } from '@/utils'

const props = defineProps<{
  token: ProductErc20Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'approve-form.title-lbl': 'Approve tokens',
      'approve-form.title-info': 'Approve tokens amount for address',
      'approve-form.spender-lbl': 'Address',
      'approve-form.spender-info': 'Enter the spender address',
      'approve-form.amount-lbl': 'Amount',
      'approve-form.amount-info': 'Enter the approved amount',
      'approve-form.btn-lbl': 'Send',
    },
  },
})

const form = reactive({
  spender: '',
  amount: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    spender: { required, isAddress },
    amount: { required, numeric },
  },
)

const submit = async () => {
  await txWrapper(props.token.approve, {
    spender: form.spender,
    amount: new BN(form.amount)
      .toFraction(props.token.decimals.value)
      .toString(),
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
            {{ t('approve-form.title-info') }}
          </div>
        </div>
        {{ t('approve-form.title-lbl') }}
      </span>
      <div class="app__common-form__input-wrp">
        <input-field
          v-model="form.spender"
          scheme="secondary"
          :label="t('approve-form.spender-lbl')"
          class="app__common-form__input"
          :error-message="getFieldErrorMessage('spender')"
          @blur="touchField('spender')"
        />
        <div class="app__common-form__input-icon">
          <icon :name="$icons.informationCircleFilled" />
          <div class="app__common-form__popup">
            {{ t('approve-form.spender-info') }}
          </div>
        </div>
      </div>
      <div class="app__common-form__input-wrp">
        <input-field
          v-model="form.amount"
          scheme="secondary"
          :label="t('approve-form.amount-lbl')"
          class="app__common-form__input"
          :error-message="getFieldErrorMessage('amount')"
          @blur="touchField('amount')"
        />
        <div class="app__common-form__input-icon">
          <icon :name="$icons.informationCircleFilled" />
          <div class="app__common-form__popup">
            {{ t('approve-form.amount-info') }}
          </div>
        </div>
      </div>
      <app-button
        type="button"
        size="small"
        :text="t('approve-form.btn-lbl')"
        :disabled="!isFieldsValid"
        @click="submit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app__common-form__title-icon {
  height: toRem(28);
  width: toRem(28);
  padding: toRem(6);
  position: relative;
}
</style>
