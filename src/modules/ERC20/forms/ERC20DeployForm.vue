<script lang="ts" setup>
import { AppBlock, AppButton, Collapse, Modal } from '@/common'
import { InputField } from '@/fields'
import DeploySuccessMessage, {
  DeployERC20Metadata,
} from '@/modules/ERC20/common/DeploySuccessMessage.vue'
import { reactive, ref } from 'vue'
import { useFormValidation } from '@/composables'
import { required } from '@/validators'
import { useRoute, useRouter } from 'vue-router'
import { ErrorHandler } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { deploy } from '@/helpers/deploy.helper'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      title: 'Deploy',
      subtitle:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      'content-title-1': 'Payment information',
      'payment-token-lbl': 'Payment token',
      'content-title-2': 'Token info',
      'token-name-lbl': 'Token name',
      'token-symbol-lbl': 'Tokens symbol',
      'decimals-lbl': 'Decimals',
      'content-title-3': 'Mint info',
      'mint-amount-lbl': 'Mint amount',
      'mint-receiver-lbl': 'Mint receiver',
      'submit-btn': 'Buy',
    },
  },
})

const isSuccessModalShown = ref(false)

const router = useRouter()
const route = useRoute()

const deployMetadata = ref<DeployERC20Metadata>()
const form = reactive({
  paymentToken: '',
  tokenName: '',
  tokenSymbol: '',
  mintAmount: '',
  mintReceiver: '',
  tokenDecimals: '',
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
  },
)

const submit = async () => {
  try {
    const potentialContractAddress = await deploy(
      route.params.id as string,
      '0xe7deB4238d6AcFEE0B457dfa3f51d2e88a085367',
      [
        form.tokenName,
        form.tokenSymbol,
        form.mintAmount,
        form.mintReceiver,
        form.tokenDecimals,
      ],
    )

    deployMetadata.value = {
      name: form.tokenName,
      symbol: form.tokenSymbol,
      decimals: form.tokenDecimals,
      mintAmount: form.mintAmount,
      mintReceiver: form.mintReceiver,
      contract: potentialContractAddress,
    }

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
        {{ t('title') }}
      </h2>
    </div>
    <span class="app__module-subtitle">
      {{ t('subtitle') }}
    </span>
    <app-block class="app__module-content-wrp">
      <div class="app__module-content">
        <div class="app__module-content-inner">
          <collapse
            class="app__form-control"
            is-opened-by-default
            :is-close-by-click-outside="false"
          >
            <template #head="{ collapse }">
              <app-button
                class="app__module-content-title"
                scheme="default"
                color="default"
                size="default"
                :text="t('content-title-1')"
                :icon-left="collapse.isOpen ? $icons.arrowUp : $icons.arrowDown"
                @click="collapse.toggle"
              />
            </template>
            <template #default>
              <div
                class="app__form-control erc20-deploy-form__collapsed-fields"
              >
                <input-field
                  scheme="secondary"
                  v-model="form.paymentToken"
                  :label="t('content-title-1')"
                  :error-message="getFieldErrorMessage('paymentToken')"
                  @blur="touchField('paymentToken')"
                />
              </div>
            </template>
          </collapse>
          <h4 class="app__module-content-title">
            {{ t('content-title-2') }}
          </h4>
          <div class="app__form-control">
            <input-field
              scheme="secondary"
              v-model="form.tokenName"
              :label="t('token-name-lbl')"
              :error-message="getFieldErrorMessage('tokenName')"
              @blur="touchField('tokenName')"
            />
            <input-field
              scheme="secondary"
              v-model="form.tokenSymbol"
              :label="t('token-symbol-lbl')"
              :error-message="getFieldErrorMessage('tokenSymbol')"
              @blur="touchField('tokenSymbol')"
            />
            <input-field
              scheme="secondary"
              v-model="form.tokenDecimals"
              :label="t('decimals-lbl')"
              :error-message="getFieldErrorMessage('tokenDecimals')"
              @blur="touchField('tokenDecimals')"
            />
            <h4 class="app__module-content-title">
              {{ t('content-title-3') }}
            </h4>
            <input-field
              scheme="secondary"
              v-model="form.mintAmount"
              :label="t('mint-amount-lbl')"
              :error-message="getFieldErrorMessage('mintAmount')"
              @blur="touchField('mintAmount')"
            />
            <input-field
              scheme="secondary"
              v-model="form.mintReceiver"
              :label="t('mint-receiver-lbl')"
              :error-message="getFieldErrorMessage('mintReceiver')"
              @blur="touchField('mintReceiver')"
            />

            <app-button
              class="erc20-deploy-form__submit-btn"
              type="submit"
              :text="t('submit-btn')"
              size="small"
              :disabled="!isFieldsValid"
            />
          </div>
        </div>
      </div>
    </app-block>
    <modal v-model:is-shown="isSuccessModalShown">
      <template #default="{ modal }">
        <deploy-success-message
          :deploy-metadata="deployMetadata"
          @submit="
            () => {
              modal.close()
              router.push({ name: $routes.productEdit, params: { id: 2 } })
            }
          "
          @close="modal.close"
        />
      </template>
    </modal>
  </form>
</template>

<style lang="scss" scoped>
.erc20-deploy-form__collapsed-fields {
  padding: toRem(8) 0;
}
</style>
