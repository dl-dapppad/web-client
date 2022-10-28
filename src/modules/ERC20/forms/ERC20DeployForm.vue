<script lang="ts" setup>
import { AppBlock, AppButton, Collapse, Modal } from '@/common'
import { InputField } from '@/fields'

import DeploySuccessMessage from '@/modules/ERC20/common/DeploySuccessMessage.vue'

import { reactive, ref } from 'vue'
import { useFormValidation } from '@/composables'
import { required } from '@/validators'
import { useRouter } from 'vue-router'
import { ErrorHandler } from '@/helpers'

const isSuccessModalShown = ref(false)

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

const submit = async () => {
  try {
    isSuccessModalShown.value = true
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<template>
  <form class="erc20-deploy-form" @submit.prevent="submit">
    <div class="app__module-title-wrp">
      <app-button
        class="app__module-back-btn"
        :icon-right="$icons.arrowLeft"
        modification="border-circle"
        color="tertiary"
        @click="router.go(-1)"
      />
      <h2 class="app__module-title">
        {{ 'Deploy' }}
      </h2>
    </div>
    <span class="app__module-subtitle">
      {{
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
      }}
    </span>
    <app-block class="app__module-content-wrp">
      <div class="app__module-content">
        <div class="app__module-content-inner">
          <collapse is-opened-by-default :is-close-by-click-outside="false">
            <template #head="{ collapse }">
              <app-button
                class="app__module-content-title"
                scheme="default"
                color="default"
                size="default"
                :text="'Base parameters'"
                :icon-left="collapse.isOpen ? $icons.arrowUp : $icons.arrowDown"
                @click="collapse.toggle"
              />
            </template>
            <template #default>
              <div class="app__form-control">
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
          <h4 class="app__module-content-title">
            {{ 'Other fields' }}
          </h4>
          <div class="app__form-control">
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
              type="submit"
              :text="'Buy'"
              size="small"
              :disabled="!isFieldsValid"
            />
          </div>
        </div>
      </div>
    </app-block>
    <modal v-model:is-shown="isSuccessModalShown">
      <template #default="{ modal }">
        <deploy-success-message @submit="modal.close" @close="modal.close" />
      </template>
    </modal>
  </form>
</template>
