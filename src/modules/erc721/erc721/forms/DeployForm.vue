<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { AppButton, Collapse, Icon, InfoTooltip } from '@/common'
import { InputField } from '@/fields'
import { useFormValidation } from '@/composables'
import { required } from '@/validators'
import { deploy } from '@/helpers/deploy.helper'
import { DeployForm } from '@/modules/forms'
import { DeployMetadata } from '@/modules/common/index'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc721.title': 'Deploy',
      'erc721.subtitle': 'Token ERC-721',
      'erc721.description':
        'Deploy your product on chain. You should deploy product smart contract only one time with a transaction.',

      'erc721.token-group': 'NFT info',
      'erc721.name-lbl': 'NFT name',
      'erc721.name-info': 'Enter the token name',
      'erc721.symbol-lbl': 'Token symbol',
      'erc721.symbol-info': 'Enter the token symbol',

      'erc721.btn-lbl': 'Buy',
    },
  },
})

const paymentTokens = ref<Record<string, Array<string>>>({
  symbols: [],
  addresses: [],
})

const isSuccessModalShown = ref(false)

const route = useRoute()

const deployMetadata = ref<DeployMetadata>({
  name: '',
  symbol: '',
  contract: '',
})
const potentialContractAddress = ref('')
const txProcessing = ref(false)
const form = reactive({
  paymentToken: '',
  name: '',
  symbol: '',
})

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  {
    paymentToken: { required },
    name: { required },
    symbol: { required },
  },
)

const getSelectedPaymentAddress = () => {
  return paymentTokens.value.addresses[
    paymentTokens.value.symbols.findIndex(
      symbol => symbol === form.paymentToken,
    )
  ]
}

const headingData = {
  title: t('erc721.title'),
  subtitle: t('erc721.subtitle'),
  description: t('erc721.description'),
}

const buttonData = {
  label: t('erc721.btn-lbl'),
  isEnabled: isFieldsValid,
  isShown: txProcessing,
}

const submit = async () => {
  const paymentTokenAddress = getSelectedPaymentAddress()

  txProcessing.value = true
  potentialContractAddress.value = await deploy(
    route.params.id as string,
    paymentTokenAddress,
    [form.name, form.symbol],
  )

  if (!potentialContractAddress.value) {
    txProcessing.value = false
    return
  }

  deployMetadata.value = {
    name: form.name,
    symbol: form.symbol,
    contract: potentialContractAddress.value,
  }

  isSuccessModalShown.value = true
  txProcessing.value = false
}
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
          {{ t('erc721.token-group') }}
        </app-button>
      </template>
      <template #default>
        <div class="app__form-control app__collapsed-fields">
          <div class="app__form-control">
            <div class="app__field-row">
              <input-field
                scheme="secondary"
                v-model="form.name"
                :label="t('erc721.name-lbl')"
                :error-message="getFieldErrorMessage('name')"
                @blur="touchField('name')"
              />
              <div class="app__field-tooltip">
                <info-tooltip :text="t('erc721.name-info')" />
              </div>
            </div>
            <div class="app__field-row">
              <input-field
                scheme="secondary"
                v-model="form.symbol"
                :label="t('erc721.symbol-lbl')"
                :error-message="getFieldErrorMessage('symbol')"
                @blur="touchField('symbol')"
              />
              <div class="app__field-tooltip">
                <info-tooltip :text="t('erc721.symbol-info')" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </collapse>
  </deploy-form>
</template>
