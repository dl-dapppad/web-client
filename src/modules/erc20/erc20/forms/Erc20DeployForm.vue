<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useWeb3ProvidersStore } from '@/store'
import {
  AppBlock,
  AppButton,
  Collapse,
  Modal,
  Icon,
  InfoTooltip,
  Loader,
} from '@/common'
import { InputField, SelectField } from '@/fields'
import { useFormValidation, Product } from '@/composables'
import { required, isAddress, numeric } from '@/validators'
import { formatAmount } from '@/helpers'
import {
  deploy,
  getAvailableTokenList,
  getSelectedTokenInfo,
  getProduct,
} from '@/helpers/deploy.helper'
import { config } from '@/config'
import { BN } from '@/utils'
import {
  DeploySuccessMessage,
  DeployERC20Metadata,
} from '@/modules/erc20/common'
import { PRODUCT_IDS } from '@/enums'
import { SCHEMES } from '@/common/Loader.vue'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc20.title': 'Deploy',
      'erc20.subtitle': 'Token ERC-20',
      'erc20.description':
        'Deploy your product on chain. You should deploy product smart contract only one time with a transaction.',
      'erc20.payment-group': 'Payment info',
      'erc20.payment-lbl': 'Payment token',
      'erc20.payment-info': 'Select the token you want to pay with',
      'erc20.payment-balance': 'Your balance',
      'erc20.product-price': 'Product price',

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
const productPaymentToken = ref({
  balance: '',
  symbol: '',
  decimals: 0,
})
const selectedPaymentToken = ref({
  balance: '',
  symbol: '',
  decimals: 0,
})
const product = ref<Product>()

const isSuccessModalShown = ref(false)

const router = useRouter()
const route = useRoute()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const deployMetadata = ref<DeployERC20Metadata>()
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

const isBalanceInsuficient = computed(() =>
  product.value?.currentPrice
    ? new BN(product.value?.currentPrice).compare(
        selectedPaymentToken.value.balance,
      ) === 1
    : false,
)

const init = async () => {
  const { symbols, addresses } = await getAvailableTokenList()

  paymentTokens.value.symbols = symbols
  paymentTokens.value.addresses = addresses

  form.mintReceiver = provider.value.selectedAddress as string

  const alias = config.PRODUCT_ALIASES[route.params.id as string]
  product.value = await getProduct(alias)

  if (!addresses.length) return

  const { symbol, decimals, balance } = await getSelectedTokenInfo(addresses[0])
  productPaymentToken.value.symbol = symbol
  productPaymentToken.value.decimals = Number(decimals)
  productPaymentToken.value.balance = balance
}

const getSelectedPaymentAddress = () => {
  return paymentTokens.value.addresses[
    paymentTokens.value.symbols.findIndex(
      symbol => symbol === form.paymentToken,
    )
  ]
}

const onPaymentChange = async () => {
  const { symbol, decimals, balance } = await getSelectedTokenInfo(
    getSelectedPaymentAddress(),
  )

  selectedPaymentToken.value = {
    ...selectedPaymentToken.value,
    symbol,
    decimals: Number(decimals),
    balance,
  }
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
    decimals: form.decimals,
    mintAmount: form.mintAmount,
    mintReceiver: form.mintReceiver,
    contract: potentialContractAddress.value,
  }

  isSuccessModalShown.value = true
  txProcessing.value = false
}

init()
</script>

<template>
  <form class="app" @submit.prevent="submit">
    <div class="app__module-heading">
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
          {{ t('erc20.title') }}
        </h2>
      </div>
      <span class="app__module-subtitle">
        {{ t('erc20.subtitle') }}
      </span>
      <span class="app__module-description">
        {{ t('erc20.description') }}
      </span>
    </div>
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
                  class="app__title-icon"
                  :name="
                    collapse.isOpen
                      ? $icons.arrowUpTriangle
                      : $icons.arrowDownTriangle
                  "
                />
                {{ t('erc20.payment-group') }}
              </app-button>
            </template>
            <template #default>
              <div class="app__form-control app__collapsed-fields">
                <div class="app__select-wrp">
                  <div class="app__field-row">
                    <select-field
                      class="app__module-field"
                      v-model="form.paymentToken"
                      :label="t('erc20.payment-lbl')"
                      :value-options="paymentTokens.symbols"
                      @update:model-value="onPaymentChange"
                    />
                    <div class="app__field-tooltip">
                      <info-tooltip :text="t('erc20.payment-info')" />
                    </div>
                  </div>
                  <template
                    v-if="selectedPaymentToken.balance && product?.currentPrice"
                  >
                    <div class="app__row">
                      <span class="app__row-title">
                        {{ t('erc20.product-price') }}
                      </span>
                      <div class="app__balance">
                        {{
                          formatAmount(
                            product.currentPrice,
                            productPaymentToken.decimals,
                          )
                        }}
                        <span>{{ productPaymentToken.symbol }}</span>
                      </div>
                    </div>
                    <div v-if="selectedPaymentToken.balance" class="app__row">
                      <span class="app__row-title">
                        {{ t('erc20.payment-balance') }}
                      </span>
                      <div
                        class="app__balance app__balance-small"
                        :class="{
                          'app__balance-insufficient': isBalanceInsuficient,
                        }"
                      >
                        {{
                          formatAmount(
                            selectedPaymentToken.balance,
                            selectedPaymentToken.decimals,
                          )
                        }}
                        <span>{{ selectedPaymentToken.symbol }}</span>
                      </div>
                    </div>
                  </template>
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
          <app-button
            v-if="!txProcessing"
            class="app__submit-btn app__submit-btn--cutted"
            type="submit"
            :text="t('erc20.btn-lbl')"
            size="small"
            :disabled="!isFieldsValid"
          />
          <div v-else class="app__deploy-loader">
            <loader :scheme="SCHEMES.cubes" />
            <p>{{ t('product-deploy.tx-processing') }}</p>
            <p>{{ t('product-deploy.tx-processing-description') }}</p>
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
