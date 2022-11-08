<script lang="ts" setup>
import {
  AppBlock,
  AppButton,
  Collapse,
  Modal,
  Icon,
  InfoTooltip,
} from '@/common'
import { InputField, SelectField } from '@/fields'
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
import { PRODUCT_IDS } from '@/enums'
import { BN } from '@/utils'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      title: 'Deploy',
      subtitle:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      'content-title-1': 'Base parameters',
      'payment-token-lbl': 'Payment token',
      'payment-token-tooltip-msg': 'Payment token information',
      'balance-lbl': 'Balance',
      'balance-tooltip-msg': 'Balance information',
      'content-title-2': 'Other fields',
      'token-name-lbl': 'Token name',
      'token-name-tooltip-msg': 'Token name information',
      'token-symbol-lbl': 'Tokens symbol',
      'token-symbol-tooltip-msg': 'Token symbol information',
      'decimals-lbl': 'Decimals',
      'decimals-tooltip-msg': 'Decimals information',
      'cap-lbl': 'Cap',
      'cap-tooltip-msg': 'Cap information',
      'mint-amount-lbl': 'Mint amount',
      'mint-amount-tooltip-msg': 'Mint amount information',
      'mint-receiver-lbl': 'Mint receiver',
      'mint-receiver-tooltip-msg': 'Mint receiver information',
      'submit-btn': 'Approve & Buy',
    },
  },
})

const tokens = ['USDT', 'DAPP']

const isSuccessModalShown = ref(false)

const router = useRouter()
const route = useRoute()

const deployMetadata = ref<DeployERC20Metadata>()
const potentialContractAddress = ref('')
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
    potentialContractAddress.value = await deploy(
      route.params.id as string,
      '0xe7deB4238d6AcFEE0B457dfa3f51d2e88a085367',
      [
        form.tokenName,
        form.tokenSymbol,
        new BN(form.mintAmount)
          .toFraction(Number(form.tokenDecimals))
          .toString(),
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
      contract: potentialContractAddress.value,
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
        @click="
          router.push({
            name: $routes.product,
            params: { id: PRODUCT_IDS.ERC20 },
          })
        "
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
                @click="collapse.toggle"
              >
                <icon
                  class="erc20-deploy-form__title-icon"
                  :name="
                    collapse.isOpen
                      ? $icons.arrowUpTriangle
                      : $icons.arrowDownTriangle
                  "
                />
                {{ t('content-title-1') }}
              </app-button>
            </template>
            <template #default>
              <div
                class="app__form-control erc20-deploy-form__collapsed-fields"
              >
                <div class="erc20-deploy-form__select-wrp">
                  <div class="erc20-deploy-form__field-row">
                    <select-field
                      v-model="form.paymentToken"
                      :label="t('payment-token-lbl')"
                      :value-options="tokens"
                    />
                    <info-tooltip
                      class="erc20-deploy-form__tooltip"
                      :text="t('payment-token-tooltip-msg')"
                    />
                  </div>
                  <div class="erc20-deploy-form__row">
                    <span class="erc20-deploy-form__row-title">
                      {{ t('balance-lbl') }}
                    </span>
                    <span class="erc20-deploy-form__row-value">
                      {{ `12,345.1234 USDT` }}
                    </span>
                  </div>
                </div>
                <div class="erc20-deploy-form__field-row">
                  <input-field
                    scheme="secondary"
                    v-model="form.tokenName"
                    :label="t('token-name-lbl')"
                    :error-message="getFieldErrorMessage('tokenName')"
                    @blur="touchField('tokenName')"
                  />
                  <info-tooltip
                    class="erc20-deploy-form__tooltip"
                    :text="t('token-name-tooltip-msg')"
                  />
                </div>
              </div>
            </template>
          </collapse>
          <h4 class="app__module-content-title">
            {{ t('content-title-2') }}
          </h4>
          <div class="app__form-control">
            <div class="erc20-deploy-form__field-row">
              <input-field
                scheme="secondary"
                v-model="form.tokenSymbol"
                :label="t('token-symbol-lbl')"
                :error-message="getFieldErrorMessage('tokenSymbol')"
                @blur="touchField('tokenSymbol')"
              />
              <info-tooltip
                class="erc20-deploy-form__tooltip"
                :text="t('token-symbol-tooltip-msg')"
              />
            </div>
            <div class="erc20-deploy-form__field-row">
              <input-field
                scheme="secondary"
                v-model="form.mintAmount"
                :label="t('mint-amount-lbl')"
                :error-message="getFieldErrorMessage('mintAmount')"
                @blur="touchField('mintAmount')"
              />
              <info-tooltip
                class="erc20-deploy-form__tooltip"
                :text="t('mint-amount-tooltip-msg')"
              />
            </div>
            <div class="erc20-deploy-form__field-row">
              <input-field
                scheme="secondary"
                v-model="form.mintReceiver"
                :label="t('mint-receiver-lbl')"
                :error-message="getFieldErrorMessage('mintReceiver')"
                @blur="touchField('mintReceiver')"
              />
              <info-tooltip
                class="erc20-deploy-form__tooltip"
                :text="t('mint-receiver-tooltip-msg')"
              />
            </div>
            <div class="erc20-deploy-form__field-row">
              <input-field
                scheme="secondary"
                v-model="form.tokenDecimals"
                :label="t('decimals-lbl')"
                :error-message="getFieldErrorMessage('tokenDecimals')"
                @blur="touchField('tokenDecimals')"
              />
              <info-tooltip
                class="erc20-deploy-form__tooltip"
                :text="t('decimals-tooltip-msg')"
              />
            </div>
            <div class="erc20-deploy-form__field-row">
              <input-field
                scheme="secondary"
                v-model="form.cap"
                :label="t('cap-lbl')"
                :error-message="getFieldErrorMessage('cap')"
                @blur="touchField('cap')"
              />
              <info-tooltip
                class="erc20-deploy-form__tooltip"
                :text="t('cap-tooltip-msg')"
              />
            </div>
          </div>
          <app-button
            class="erc20-deploy-form__submit-btn"
            type="submit"
            :text="t('submit-btn')"
            size="small"
            :disabled="!isFieldsValid"
          />
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
              router.push({
                name: $routes.productEdit,
                params: {
                  id: PRODUCT_IDS.ERC20,
                  contractAddress: potentialContractAddress,
                },
              })
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

.erc20-deploy-form__field-row {
  position: relative;
  padding-right: toRem(33);
}

.erc20-deploy-form__tooltip {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.erc20-deploy-form__title-icon {
  height: toRem(11);
  width: toRem(31);
  padding: 0 toRem(20) 0 0;
}

.erc20-deploy-form__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: toRem(10) 0 0 0;
}

.erc20-deploy-form__row-title {
  font-weight: 700;
  font-size: toRem(14);
  color: var(--text-secondary-main);
}

.erc20-deploy-form__row-value {
  font-weight: 700;
  font-size: toRem(16);
}
</style>
