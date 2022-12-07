<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useWeb3ProvidersStore } from '@/store'
import { AppButton, Collapse, Icon, InfoTooltip } from '@/common'
import { InputField } from '@/fields'
import { useFormValidation } from '@/composables'
import { required, isAddress, numeric } from '@/validators'
import { deploy } from '@/helpers/deploy.helper'
import { BN } from '@/utils'
import { DeployMetadata } from '@/modules/common'
import { DeployForm } from '@/modules/forms'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc20.title': 'Deploy',
      'erc20.subtitle': 'Token ERC-20',
      'erc20.description':
        'Deploy your product on chain. You should deploy product smart contract only one time with a transaction.',

      'erc20.token-group': 'Token info',
      'erc20.name-lbl': 'Token name',
      'erc20.name-info': 'Enter the token name',
      'erc20.symbol-lbl': 'Token symbol',
      'erc20.symbol-info': 'Enter the token symbol',
      'erc20.decimals-lbl': 'Token decimals',
      'erc20.decimals-info': 'Enter the token decimals',

      'erc20.mint-group': 'Mint info',
      'erc20.mint-amount-lbl': 'Mint amount',
      'erc20.mint-amount-info': 'Enter the initial mint amount',
      'erc20.mint-receiver-lbl': 'Mint receiver',
      'erc20.mint-receiver-info': 'Enter the tokens receiver',

      'erc20.btn-lbl': 'Buy',
    },
  },
})

const paymentTokens = ref<Record<string, Array<string>>>({
  symbols: [],
  addresses: [],
})

const isSuccessModalShown = ref(false)

const route = useRoute()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const deployMetadata = ref<DeployMetadata>({
  name: '',
  symbol: '',
  contract: '',
  erc20Metadata: {
    decimals: '',
    mintAmount: '',
    mintReceiver: '',
  },
})
const potentialContractAddress = ref('')
const txProcessing = ref(false)
const form = reactive({
  paymentToken: '',
  name: '',
  symbol: '',
  mintAmount: '',
  mintReceiver: '',
  decimals: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    paymentToken: { required },
    name: { required },
    symbol: { required },
    mintAmount: { required, numeric },
    mintReceiver: { required, isAddress },
    decimals: { required, numeric },
  },
)

const init = async () => {
  form.mintReceiver = provider.value.selectedAddress as string
}

const getSelectedPaymentAddress = () => {
  return paymentTokens.value.addresses[
    paymentTokens.value.symbols.findIndex(
      symbol => symbol === form.paymentToken,
    )
  ]
}

const headingData = {
  title: t('erc20.title'),
  subtitle: t('erc20.subtitle'),
  description: t('erc20.description'),
}

const buttonData = {
  label: t('erc20.btn-lbl'),
  isEnabled: isFieldsValid,
  isShown: txProcessing,
}

const submit = async () => {
  const paymentTokenAddress = getSelectedPaymentAddress()

  txProcessing.value = true
  potentialContractAddress.value = await deploy(
    route.params.id as string,
    paymentTokenAddress,
    [
      form.name,
      form.symbol,
      new BN(form.mintAmount).toFraction(Number(form.decimals)).toString(),
      form.mintReceiver,
      form.decimals,
    ],
  )

  if (!potentialContractAddress.value) {
    txProcessing.value = false
    return
  }

  deployMetadata.value = {
    name: form.name,
    symbol: form.symbol,
    contract: potentialContractAddress.value,
    erc20Metadata: {
      decimals: form.decimals,
      mintAmount: form.mintAmount,
      mintReceiver: form.mintReceiver,
    },
  }

  isSuccessModalShown.value = true
  txProcessing.value = false
}

init()
</script>

<template>
  <deploy-form
    :heading-data="headingData"
    :button="buttonData"
    :modal="{ potentialContractAddress, metadata: deployMetadata }"
    v-model:paymentValue="form.paymentToken"
    v-model:is-success-modal-shown="isSuccessModalShown"
    @submit="submit"
  >
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
            class="app__title-icon"
            :name="
              collapse.isOpen
                ? $icons.arrowUpTriangle
                : $icons.arrowDownTriangle
            "
          />
          {{ t('erc20.token-group') }}
        </app-button>
      </template>
      <template #default>
        <div class="app__form-control app__collapsed-fields">
          <div class="app__form-control">
            <div class="app__field-row">
              <input-field
                class="app__module-field"
                scheme="secondary"
                v-model="form.name"
                :label="t('erc20.name-lbl')"
                :error-message="getFieldErrorMessage('name')"
                @blur="touchField('name')"
              />
              <div class="app__field-tooltip">
                <info-tooltip :text="t('erc20.name-info')" />
              </div>
            </div>
            <div class="app__field-row">
              <input-field
                class="app__module-field"
                scheme="secondary"
                v-model="form.symbol"
                :label="t('erc20.symbol-lbl')"
                :error-message="getFieldErrorMessage('symbol')"
                @blur="touchField('symbol')"
              />
              <div class="app__field-tooltip">
                <info-tooltip :text="t('erc20.symbol-info')" />
              </div>
            </div>
            <div class="app__field-row">
              <input-field
                class="app__module-field"
                scheme="secondary"
                v-model="form.decimals"
                :label="t('erc20.decimals-lbl')"
                :error-message="getFieldErrorMessage('decimals')"
                @blur="touchField('decimals')"
              />
              <div class="app__field-tooltip">
                <info-tooltip :text="t('erc20.decimals-info')" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </collapse>
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
            class="app__title-icon"
            :name="
              collapse.isOpen
                ? $icons.arrowUpTriangle
                : $icons.arrowDownTriangle
            "
          />
          {{ t('erc20.mint-group') }}
        </app-button>
      </template>
      <template #default>
        <div class="app__form-control app__collapsed-fields">
          <div class="app__form-control">
            <div class="app__field-row">
              <input-field
                class="app__module-field"
                scheme="secondary"
                v-model="form.mintReceiver"
                :label="t('erc20.mint-receiver-lbl')"
                :error-message="getFieldErrorMessage('mintReceiver')"
                @blur="touchField('mintReceiver')"
              />
              <div class="app__field-tooltip">
                <info-tooltip :text="t('erc20.mint-receiver-info')" />
              </div>
            </div>
            <div class="app__field-row">
              <input-field
                class="app__module-field"
                scheme="secondary"
                v-model="form.mintAmount"
                :label="t('erc20.mint-amount-lbl')"
                :error-message="getFieldErrorMessage('mintAmount')"
                @blur="touchField('mintAmount')"
              />
              <div class="app__field-tooltip">
                <info-tooltip :text="t('erc20.mint-amount-info')" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </collapse>
  </deploy-form>
</template>
