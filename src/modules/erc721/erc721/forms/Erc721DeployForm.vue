<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

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
import { required } from '@/validators'
import { formatAmount } from '@/helpers'
import {
  deploy,
  getAvailableTokenList,
  getSelectedTokenInfo,
  getProduct,
} from '@/helpers/deploy.helper'
import { PRODUCT_IDS } from '@/enums'
import { config } from '@/config'
import { BN } from '@/utils'
import DeploySuccessMessage from '@/modules/erc721/common/DeploySuccessMessage.vue'
import { DeployERC721Metadata } from '@/modules/erc721/common/index'
import { SCHEMES } from '@/common/Loader.vue'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc721.title': 'Deploy',
      'erc721.subtitle': 'Token ERC-721',
      'erc721.description':
        'Deploy your product on chain. You should deploy product smart contract only one time with a transaction.',
      'erc721.payment-group': 'Payment info',
      'erc721.payment-lbl': 'Payment token',
      'erc721.payment-info': 'Select the token you want to pay with',
      'erc721.payment-balance': 'Your balance',
      'erc721.product-price': 'Product price',

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

const deployMetadata = ref<DeployERC721Metadata>()
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

  selectedPaymentToken.value.symbol = symbol
  selectedPaymentToken.value.decimals = Number(decimals)
  selectedPaymentToken.value.balance = balance
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

init()
</script>

<template>
  <form @submit.prevent="submit">
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
              params: { id: PRODUCT_IDS.ERC721 },
            })
          "
        />
        <h2 class="app__module-title">
          {{ t('erc721.title') }}
        </h2>
      </div>
      <span class="app__module-subtitle">
        {{ t('erc721.subtitle') }}
      </span>
      <span class="app__module-description">
        {{ t('erc721.description') }}
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
                {{ t('erc721.payment-group') }}
              </app-button>
            </template>
            <template #default>
              <div class="app__form-control app__collapsed-fields">
                <div class="app__select-wrp">
                  <div class="app__field-row">
                    <select-field
                      v-model="form.paymentToken"
                      :label="t('erc721.payment-lbl')"
                      :value-options="paymentTokens.symbols"
                      @update:model-value="onPaymentChange"
                    />
                    <div class="app__field-tooltip">
                      <info-tooltip :text="t('erc721.payment-info')" />
                    </div>
                  </div>
                  <template
                    v-if="selectedPaymentToken.balance && product?.currentPrice"
                  >
                    <div class="app__row">
                      <span class="app__row-title">
                        {{ t('erc721.product-price') }}
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
                        {{ t('erc721.payment-balance') }}
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
          <app-button
            v-if="!txProcessing"
            class="app__submit-btn app__submit-btn--cutted"
            type="submit"
            :text="t('erc721.btn-lbl')"
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
                  id: PRODUCT_IDS.ERC721,
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
