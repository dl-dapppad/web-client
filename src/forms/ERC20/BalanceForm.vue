<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { InputField } from '@/fields'
import { Icon, AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { required, isAddress } from '@/validators'
import { formatAmount } from '@/helpers'
import { ProductErc20Contract } from '@/modules/ERC20/composables/use-product-erc20'

const props = defineProps<{
  token: ProductErc20Contract
}>()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'balance-form.title-lbl': 'Address balance',
      'balance-form.title-info': 'Get account or smart contract balance',
      'balance-form.address-lbl': 'Address',
      'balance-form.address-info':
        'Enter the address of the user or smart contract',
      'balance-form.btn-lbl': 'Send',
    },
  },
})

const form = reactive({
  address: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    address: { required, isAddress },
  },
)

const result = ref('')

const submit = async () => {
  result.value = await props.token.balanceOf(form.address)
}
</script>

<template>
  <div class="common-rw-form">
    <div class="app__form-control">
      <span class="app__form-control-title common-rw-form__title">
        <div class="common-rw-form__icon">
          <icon
            :name="$icons.informationCircleFilled"
            class="common-rw-form__title-icon"
          />
          <div class="common-rw-form__popup">
            {{ t('balance-form.title-info') }}
          </div>
        </div>
        {{ t('balance-form.title-lbl') }}
      </span>
      <div class="common-rw-form__input-wrp">
        <input-field
          v-model="form.address"
          scheme="secondary"
          :label="t('balance-form.address-lbl')"
          class="common-rw-form__input"
          :error-message="getFieldErrorMessage('address')"
          @blur="touchField('address')"
        />
        <div class="common-rw-form__input-icon">
          <icon :name="$icons.informationCircleFilled" />
          <div class="common-rw-form__popup">
            {{ t('balance-form.address-info') }}
          </div>
        </div>
      </div>
      <app-button
        type="button"
        size="small"
        :text="t('balance-form.btn-lbl')"
        :disabled="!isFieldsValid"
        @click="submit"
      />
      <div v-if="result">
        {{
          formatAmount(
            result,
            props.token.decimals.value,
            props.token.symbol.value,
          )
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.common-rw-form__title-icon {
  height: toRem(28);
  width: toRem(28);
  padding: toRem(6);
  position: relative;
}
</style>
