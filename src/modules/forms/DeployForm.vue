<script lang="ts" setup>
import { ref, computed, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  AppBlock,
  AppButton,
  Collapse,
  Icon,
  InfoTooltip,
  Loader,
  Modal,
} from '@/common'
import { SelectField } from '@/fields'
import { Product } from '@/composables'
import { formatAmount } from '@/helpers'
import { config } from '@/config'
import { BN } from '@/utils'

import { SCHEMES } from '@/common/Loader.vue'
import { DeploySuccessMessage } from '@/modules/common'
import { DeployMetadata } from '@/modules/common'
import {
  getSelectedTokenInfo,
  getAvailableTokenList,
  getProduct,
} from '@/helpers/deploy.helper'

const router = useRouter()
const route = useRoute()

defineProps<{
  paymentValue: string | number
  isSuccessModalShown?: boolean
  headingData?: {
    title?: string
    subtitle?: string
    description?: string
  }
  button?: {
    label?: string
    isEnabled?: Ref<boolean>
    isShown?: Ref<boolean>
  }
  modal: {
    metadata: DeployMetadata
    potentialContractAddress: string
  }
}>()

enum EVENTS {
  submit = 'submit',
  updatePaymentValue = 'update:paymentValue',
  updateisSuccessModalShown = 'update:isSuccessModalShown',
}

const emits = defineEmits<{
  (e: EVENTS.submit): void
  (e: EVENTS.updatePaymentValue, val: string | number): void
  (e: EVENTS.updateisSuccessModalShown, val: boolean): void
}>()

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

const isBalanceInsuficient = computed(() =>
  product.value?.currentPrice
    ? new BN(product.value?.currentPrice).compare(
        selectedPaymentToken.value.balance,
      ) === 1
    : false,
)

const submit = () => {
  emits(EVENTS.submit)
}

const updateIsShownModal = (val: boolean) => {
  emits(EVENTS.updateisSuccessModalShown, val)
}

const updatePayment = async (val: string | number) => {
  emits(EVENTS.updatePaymentValue, val)

  const { symbol, decimals, balance } = await getSelectedTokenInfo(
    paymentTokens.value.addresses[
      paymentTokens.value.symbols.findIndex(symbol => symbol === val)
    ],
  )

  selectedPaymentToken.value = {
    ...selectedPaymentToken.value,
    symbol,
    decimals: Number(decimals),
    balance,
  }
}

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
              params: { id: route.params.id },
            })
          "
        />
        <h2 class="app__module-title">
          {{
            headingData?.title
              ? headingData.title
              : $t('deploy-form.default-title')
          }}
        </h2>
      </div>
      <span class="app__module-subtitle">
        {{
          headingData?.subtitle
            ? headingData.subtitle
            : $t('deploy-form.default-subtitle')
        }}
      </span>
      <span class="app__module-description">
        {{
          headingData?.description
            ? headingData.description
            : $t('deploy-form.default-description')
        }}
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
                {{ $t('deploy-form.payment-group') }}
              </app-button>
            </template>
            <template #default>
              <div class="app__form-control app__collapsed-fields">
                <div class="app__select-wrp">
                  <div class="app__field-row">
                    <select-field
                      class="app__module-field"
                      :model-value="paymentValue"
                      :label="$t('deploy-form.payment-lbl')"
                      :value-options="paymentTokens.symbols"
                      @update:model-value="updatePayment"
                    />
                    <div class="app__field-tooltip">
                      <info-tooltip :text="$t('deploy-form.payment-info')" />
                    </div>
                  </div>
                  <template
                    v-if="selectedPaymentToken.balance && product?.currentPrice"
                  >
                    <div class="app__row">
                      <span class="app__row-title">
                        {{ $t('deploy-form.product-price') }}
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
                        {{ $t('deploy-form.payment-balance') }}
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
          <slot />
          <app-button
            v-if="button?.isShown"
            class="app__submit-btn app__submit-btn--cutted"
            type="submit"
            :text="
              button?.label ? button.label : $t('deploy-form.default-btn-lbl')
            "
            size="small"
            :disabled="!button?.isEnabled?.value"
          />
          <div v-else class="app__deploy-loader">
            <loader :scheme="SCHEMES.cubes" />
            <p>{{ $t('product-deploy.tx-processing') }}</p>
            <p>{{ $t('product-deploy.tx-processing-description') }}</p>
          </div>
        </div>
      </div>
    </app-block>
    <modal
      :is-shown="isSuccessModalShown"
      @update:is-shown="updateIsShownModal"
    >
      <template #default>
        <deploy-success-message
          :deploy-metadata="modal.metadata"
          @submit="
            () => {
              updateIsShownModal(false)
              router.push({
                name: $routes.productEdit,
                params: {
                  id: route.params.id,
                  contractAddress: modal.potentialContractAddress,
                },
              })
            }
          "
          @close="updateIsShownModal(false)"
        />
      </template>
    </modal>
  </form>
</template>

<style lang="scss" scoped></style>
