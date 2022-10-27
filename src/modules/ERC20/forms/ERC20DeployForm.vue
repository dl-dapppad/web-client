<script lang="ts" setup>
import { AppBlock, AppButton, Collapse } from '@/common'
import { InputField } from '@/fields'

import { reactive } from 'vue'
import { useFormValidation } from '@/composables'
import { required } from '@/validators'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  paymentToken: '',
  tokenName: '',
  tokenSymbol: '',
  mintAmount: '',
  mintReceiver: '',
  tokenDecimals: '',
  cap: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    paymentToken: { required },
    tokenName: { required },
    tokenSymbol: { required },
    mintAmount: { required },
    mintReceiver: { required },
    tokenDecimals: { required },
    cap: { required },
  },
)
</script>

<template>
  <div class="erc20-deploy-form">
    <div class="erc20-deploy-form__title-wrp">
      <app-button
        class="erc20-deploy-form__back-btn"
        :icon-right="$icons.arrowLeft"
        modification="border-circle"
        color="tertiary"
        @click="router.go(-1)"
      />
      <h2 class="erc20-deploy-form__title">
        {{ 'Deploy' }}
      </h2>
    </div>
    <span class="erc20-deploy-form__subtitle">
      {{
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
      }}
    </span>
    <app-block class="erc20-deploy-form__parameters-wrp">
      <div class="erc20-deploy-form__parameters">
        <div class="erc20-deploy-form__parameters-content">
          <collapse is-opened-by-default :is-close-by-click-outside="false">
            <template #head="{ collapse }">
              <app-button
                class="erc20-deploy-form__parameters-title"
                scheme="default"
                color="default"
                size="default"
                :text="'Base parameters'"
                :icon-left="collapse.isOpen ? $icons.arrowUp : $icons.arrowDown"
                @click="collapse.toggle"
              />
            </template>
            <template #default>
              <div class="erc20-deploy-form__form-control">
                <input-field
                  scheme="secondary"
                  v-model="form.paymentToken"
                  :label="'Payment token'"
                  :error-message="getFieldErrorMessage('paymentToken')"
                  @blur="touchField('paymentToken')"
                />
                <input-field
                  scheme="secondary"
                  v-model="form.tokenName"
                  :label="'Token name'"
                  :error-message="getFieldErrorMessage('tokenName')"
                  @blur="touchField('tokenName')"
                />
              </div>
            </template>
          </collapse>
          <h4 class="erc20-deploy-form__parameters-title">
            {{ 'Other fields' }}
          </h4>
          <div class="erc20-deploy-form__form-control">
            <input-field
              scheme="secondary"
              v-model="form.tokenSymbol"
              :label="'Tokens symbol'"
              :error-message="getFieldErrorMessage('tokenSymbol')"
              @blur="touchField('tokenSymbol')"
            />
            <input-field
              scheme="secondary"
              v-model="form.mintAmount"
              :label="'Mint amount'"
              :error-message="getFieldErrorMessage('mintAmount')"
              @blur="touchField('mintAmount')"
            />
            <input-field
              scheme="secondary"
              v-model="form.mintReceiver"
              :label="'Mint receiver'"
              :error-message="getFieldErrorMessage('mintReceiver')"
              @blur="touchField('mintReceiver')"
            />
            <input-field
              scheme="secondary"
              v-model="form.tokenDecimals"
              :label="'Decimals'"
              :error-message="getFieldErrorMessage('tokenDecimals')"
              @blur="touchField('tokenDecimals')"
            />
            <input-field
              scheme="secondary"
              v-model="form.cap"
              :label="'Cap'"
              :error-message="getFieldErrorMessage('cap')"
              @blur="touchField('cap')"
            />
            <app-button
              class="erc20-deploy-form__submit-btn"
              :text="'Buy'"
              size="small"
              :disabled="!isFieldsValid"
            />
          </div>
        </div>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
.erc20-deploy-form {
  display: flex;
  flex-direction: column;
  padding: toRem(50) 0 toRem(30);
  max-width: toRem(990);
  width: 100%;
  margin: 0 auto;
}

.erc20-deploy-form__title-wrp {
  position: relative;
}

.erc20-deploy-form__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  right: calc(100% + #{toRem(56)});
  padding: 0;
}

.erc20-deploy-form__title {
  font-size: toRem(70);
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--text-primary-main);
}

.erc20-deploy-form__subtitle {
  font-size: toRem(16);
  line-height: 1.3;
  font-weight: 400;
  letter-spacing: 0.1em;
  margin: toRem(20) 0 toRem(40);
}

.erc20-deploy-form__parameters-wrp {
  flex: 1;
}

.erc20-deploy-form__parameters {
  display: flex;
  flex-direction: column;
  padding: toRem(40) toRem(165);
}

.erc20-deploy-form__parameters-content {
  max-width: toRem(660);
  width: 100%;
  margin: 0 auto;
}

.erc20-deploy-form__parameters-title {
  font-size: toRem(24);
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin: toRem(20) 0;
  grid-gap: toRem(20);
}

.erc20-deploy-form__form-control {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  padding: toRem(10) 0;
}

.erc20-deploy-form__submit-btn {
  min-width: toRem(240);
}
</style>
