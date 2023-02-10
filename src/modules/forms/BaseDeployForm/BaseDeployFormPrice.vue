<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { AppButton, Collapse, Icon, InfoTooltip, Loader } from '@/common'
import { SelectField, InputField, CheckboxField, SwitchField } from '@/fields'
import { BN } from '@/utils'
import { useProduct } from '@/composables'
import { config } from '@/config'
import { formatAmount } from '@/helpers'
import {
  useWeb3ProvidersStore,
  useAccountStore,
  useContractsStore,
} from '@/store'
import { Post } from '@/types'

import postsData from '@/assets/posts.json'

const posts = postsData as unknown as Post[]

enum EVENTS {
  updatePaymentToken = 'update:paymentToken',
  updateProductPriceWithDiscount = 'update:productPriceWithDiscount',
  updateDiscounts = 'update:discounts',
  updateIsBalanceInsuficient = 'update:isBalanceInsuficient',
}

const emits = defineEmits<{
  (e: EVENTS.updatePaymentToken, paymentTokenAddress: string): void
  (
    e: EVENTS.updateProductPriceWithDiscount,
    productPriceWithDiscount: string,
  ): void
  (e: EVENTS.updateDiscounts, discounts: Map<string, string>): void
  (e: EVENTS.updateIsBalanceInsuficient, isBalanceInsuficient: boolean): void
}>()

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { account } = storeToRefs(useAccountStore())
const contracts = useContractsStore()

const route = useRoute()
const product = useProduct()

const paymentTokens = ref<Record<string, Array<string>>>({
  symbols: [],
  addresses: [],
})

const selectedPaymentToken = ref({
  address: '',
  balance: '',
  symbol: '',
  decimals: 0,
})

const discount = ref<{
  usedDiscount: string
  maxDiscount: string
  pools: {
    title: string
    alias: string
    discount: string
    value: string
  }[]
}>({
  usedDiscount: '',
  maxDiscount: '0',
  pools: [],
})

const productPriceInPointToken = ref('0')
const productPrice = ref('0')
const productPriceWithDiscount = ref('0')
const isDiscountCheckboxActive = ref(false)
const loading = ref(true)
const isPaymentLoaded = ref(false)
const isBalanceInsuficient = ref(false)

const updatePayment = async (selectedSymbol: string | number) => {
  if (!contracts.loaded) return

  isPaymentLoaded.value = false

  // Start setup `selectedPaymentToken`
  const selectedIndex = paymentTokens.value.symbols.findIndex(
    symbol => symbol === selectedSymbol,
  )
  const selectedAddress = paymentTokens.value.addresses[selectedIndex]

  const { symbol, decimals, balance } =
    await product.getSelectedPaymentTokenInfo(selectedAddress)

  selectedPaymentToken.value = {
    address: selectedAddress,
    symbol,
    decimals: Number(decimals),
    balance,
  }
  // End

  // Recalculate product price with current payment `selectedAddress`
  // and without discount
  productPrice.value = await contracts.payment.getPriceWithDiscount(
    selectedAddress,
    productPriceInPointToken.value,
    '0',
    '0',
  )
  // End

  isBalanceInsuficient.value =
    new BN(productPrice.value)
      .fromFraction()
      .compare(
        new BN(selectedPaymentToken.value.balance).fromFraction(
          selectedPaymentToken.value.decimals,
        ),
      ) === 1

  isPaymentLoaded.value = true

  emits(EVENTS.updateIsBalanceInsuficient, isBalanceInsuficient.value)
  emits(EVENTS.updatePaymentToken, selectedAddress)

  updateProductPriceWithDiscount()
}

const updateProductPriceWithDiscount = async () => {
  const totalDiscount = discount.value.pools
    .reduce(
      (total, pool) => new BN(total).add(pool.value === '' ? '0' : pool.value),
      new BN(0),
    )
    .toFraction()
    .toString()

  productPriceWithDiscount.value = await contracts.payment.getPriceWithDiscount(
    selectedPaymentToken.value.address,
    productPriceInPointToken.value,
    '0',
    totalDiscount,
  )

  emits(EVENTS.updateProductPriceWithDiscount, productPriceWithDiscount.value)
}

const toggleUseDiscount = (func: () => void) => {
  isDiscountCheckboxActive.value = !isDiscountCheckboxActive.value
  func()
}

const emitUpdateDiscounts = () => {
  const emitData = new Map()
  discount.value.pools.forEach(pool => {
    emitData.set(
      pool.alias,
      new BN(pool.value === '' ? '0' : pool.value).toFraction().toString(),
    )
  })

  emits(EVENTS.updateDiscounts, emitData)
}

const onUsedDiscountChange = (input: string | number) => {
  // Return if empty input
  // Return if `0.` or `123.`
  if (input === '' || /^[0-9]*\.$/.test(input as string)) {
    discount.value.pools.forEach(pool => (pool.value = '0'))
    return
  }

  discount.value.pools.forEach(pool => {
    // If `input` > `pool.discount`
    if (new BN(input).compare(pool.discount) === 1) {
      pool.value = pool.discount
      input = new BN(input).sub(pool.discount).toString()
    } else {
      pool.value = input as string
      input = 0
    }
  })

  updateProductPriceWithDiscount()
  emitUpdateDiscounts()
}

const onProductDiscountChange = (input: string | number) => {
  // Return if empty input
  // Return if `0.` or `123.`
  if (input === '' || /^[0-9]*\.$/.test(input as string)) {
    return
  }

  let sum = new BN(0)
  discount.value.pools.forEach(pool => {
    sum = sum.add(pool.value === '' ? '0' : pool.value)
  })

  discount.value.usedDiscount = sum.toString()

  updateProductPriceWithDiscount()
  emitUpdateDiscounts()
}

const initDiscount = async () => {
  discount.value.pools = []

  account.value.accountCashbackPools.forEach(pool => {
    if (pool.cashback === '0') return

    const produtId = product.getProductIdByAlias(pool.alias)
    discount.value.pools.push({
      title: posts.find(el => el.id === produtId)?.title ?? '',
      alias: pool.alias,
      discount: new BN(pool.cashback).fromFraction().toString(),
      value: '0',
    })
  })

  discount.value.maxDiscount = new BN(account.value.accountCashback)
    .fromFraction()
    .toString()
}

const init = async () => {
  if (!contracts.loaded) return

  const alias = config.PRODUCT_ALIASES[route.params.id as string]
  const productInfo = await contracts.factory.products(alias)
  productPriceInPointToken.value = productInfo.currentPrice

  const { symbols, addresses } = await product.getAvailablePaymentTokenList()
  paymentTokens.value.symbols = symbols
  paymentTokens.value.addresses = addresses

  if (productPriceInPointToken.value === '0') {
    emits(EVENTS.updatePaymentToken, addresses[0])
    emits(EVENTS.updateProductPriceWithDiscount, '0')
  }

  initDiscount()

  loading.value = false
}

watch(
  () => [
    provider.value.selectedAddress,
    provider.value.chainId,
    contracts.loaded,
  ],
  () => {
    if (selectedPaymentToken.value.symbol) {
      updatePayment(selectedPaymentToken.value.symbol)
    }
  },
)
watch(() => contracts.loaded, init)
watch(() => account.value.accountCashbackPools, initDiscount)

init()
</script>

<template>
  <div
    class="base-deploy-form-price app__form-control"
    v-if="productPriceInPointToken !== '0'"
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
          {{ $t('product-deploy.default.payment-group') }}
        </app-button>
      </template>
      <template #default>
        <div class="app__form-control app__collapsed-fields">
          <div class="app__select-wrp">
            <div v-if="!loading" class="app__field-row">
              <select-field
                class="app__module-field"
                :model-value="selectedPaymentToken.symbol"
                :label="$t('product-deploy.default.payment-lbl')"
                :value-options="paymentTokens.symbols"
                @update:model-value="updatePayment"
              />
              <div class="app__field-tooltip">
                <info-tooltip
                  :text="$t('product-deploy.default.payment-info')"
                />
              </div>
            </div>
            <loader v-else class="base-deploy-form-price__input-loader" />
            <div
              class="app__row"
              v-if="isPaymentLoaded && provider.selectedAddress"
            >
              <span class="app__row-title">
                {{ $t('product-deploy.default.product-price') }}
              </span>
              <div class="app__balance">
                {{ formatAmount(productPrice, selectedPaymentToken.decimals) }}
                <span>{{ selectedPaymentToken.symbol }}</span>
              </div>
            </div>
            <div
              class="app__row base-deploy-form-price__balance"
              v-if="isPaymentLoaded && provider.selectedAddress"
            >
              <span class="app__row-title">
                {{ $t('product-deploy.default.payment-balance') }}
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
          </div>
        </div>
        <collapse
          class="app__form-control base-deploy-form-price__discount"
          :is-close-by-click-outside="false"
        >
          <!--eslint-disable -->
          <template
            #head="{ collapse }"
            v-if="
              isPaymentLoaded &&
              provider.selectedAddress &&
              account.accountCashback !== '0'
            "
          >
          <!--eslint-enablee -->
            <div class="base-deploy-form-price__discount-checkbox">
              <!--eslint-disable -->
              <checkbox-field
                class=""
                :model-value="isDiscountCheckboxActive"
                :label="$t('product-deploy.default.discount-checkbox-lbl')"
                :disabled="
                  selectedPaymentToken.address === '' ||
                  account.accountCashback === '0'
                "
                @click="toggleUseDiscount(collapse.toggle)"
              />
              <!--eslint-enablee -->
            </div>
          </template>
          <template #default  v-if="
              isPaymentLoaded &&
              provider.selectedAddress &&
              account.accountCashback !== '0'
            ">
            <div class="app__field-row base-deploy-form-price__amount-input">
              <input-field
                class="app__module-field"
                scheme="secondary"
                v-model="discount.usedDiscount"
                type="number"
                :max="discount.maxDiscount"
                :label="$t('product-deploy.default.discount-input-lbl')"
                @update:model-value="onUsedDiscountChange"
              />
              <div class="app__field-tooltip">
                <info-tooltip
                  :text="$t('product-deploy.default.discount-tooltip-lbl')"
                  :move-side="'left'"
                />
              </div>
            </div>
            <div class="base-deploy-form-price__discount-block">
              <div class="base-deploy-form-price__row-wrp">
                <div class="app__row">
                  <span class="app__row-title">
                    {{ $t('product-deploy.default.discount-available-lbl') }}
                  </span>
                  <div class="app__balance">
                    {{ formatAmount(account.accountCashback) }}
                    <span>{{ contracts.pointToken.symbol }}</span>
                  </div>
                </div>
                <div class="app__row">
                  <span class="app__row-title">
                    {{ $t('product-deploy.default.discount-price-lbl') }}
                  </span>
                  <div class="app__balance">
                    {{
                      formatAmount(
                        productPriceWithDiscount,
                        selectedPaymentToken.decimals,
                      )
                    }}
                    <span>{{ selectedPaymentToken.symbol }}</span>
                  </div>
                </div>
              </div>
              <div class="app__row base-deploy-form-price__manual-lbl">
                {{ $t('product-deploy.default.discount-manual-lbl') }}
              </div>
              <collapse :is-close-by-click-outside="false">
                <template #head="{ collapse }">
                  <div class="base-deploy-form-price__discount-switch">
                    <switch-field
                      :right-lbl="
                        $t('product-deploy.default.discount-manual-switch-lbl')
                      "
                      v-model="collapse.isOpen"
                      @click="collapse.toggle"
                    />
                  </div>
                </template>
                <template #default>
                  <div class="base-deploy-form-price__manual">
                    <div
                      v-for="(pool, idx) in discount.pools"
                      class="app__row base-deploy-form-price__manual-row"
                      :key="idx"
                    >
                      <div class="base-deploy-form-price__manual-key">
                        <span class="base-deploy-form-price__manual-title">
                          {{ pool.title }}
                        </span>
                        <!--eslint-disable -->
                        {{
                          `(${$t(
                            'product-deploy.default.discount-manual-available-lbl',
                          )} `
                        }}
                        <!--eslint-enable -->
                        <span class="base-deploy-form-price__manual-available">
                          {{
                            formatAmount(
                              pool.discount,
                              0,
                              contracts.pointToken.symbol,
                            )
                          }} </span
                        >{{ `)` }}
                      </div>
                      <!--eslint-disable -->
                      <input-field
                        class="base-deploy-form-price__manual-input app__module-field"
                        scheme="secondary"
                        v-model="pool.value"
                        type="number"
                        :max="pool.discount"
                        :label="
                          $t('product-deploy.default.discount-manual-inp-lbl', {
                            symbol: contracts.pointToken.symbol,
                          })
                        "
                        @update:model-value="onProductDiscountChange"
                      />
                      <!--eslint-enable -->
                    </div>
                  </div>
                </template>
              </collapse>
            </div>
          </template>
        </collapse>
      </template>
    </collapse>
  </div>
</template>

<style lang="scss" scoped>
.base-deploy-form-price__balance {
  line-height: 1.3;
}

.base-deploy-form-price__balance-loader {
  padding: toRem(10) toRem(28) 0 0;
  width: 100%;
}

.base-deploy-form-price__input-loader {
  padding-right: toRem(28);
  height: toRem(56);
  width: 100%;
}

.base-deploy-form-price__discount {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
}

.base-deploy-form-price__discount-block {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.base-deploy-form-price__row-wrp {
  display: flex;
  flex-direction: column;
}

.base-deploy-form-price__discount-checkbox {
  font-size: toRem(16);
  display: flex;
  margin-top: toRem(30);
}

.base-deploy-form-price__manual-lbl {
  color: var(--text-secondary-main);
  line-height: 1.3;
  letter-spacing: 0.1em;

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.base-deploy-form-price__discount-switch {
  display: flex;
  gap: toRem(12);
  font-size: toRem(16);

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.base-deploy-form-price__manual {
  display: flex;
  flex-direction: column;
  gap: toRem(6);
}

.base-deploy-form-price__manual-key {
  color: var(--text-secondary-main);

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.base-deploy-form-price__manual-title {
  font-weight: 700;
  font-size: inherit;

  @include respond-to(medium) {
    display: block;
    padding: 0 0 toRem(5) 0;
  }
}

.base-deploy-form-price__manual-available {
  color: var(--secondary-main);
}

.base-deploy-form-price__manual-input {
  min-width: toRem(200);
  max-width: toRem(200);

  @include respond-to(medium) {
    max-width: 100%;
    width: 100%;
    padding-right: toRem(28);
  }
}

.base-deploy-form-price__manual-row {
  display: flex;
  gap: toRem(12);

  @include respond-to(medium) {
    flex-direction: column;
    align-items: start;
    padding: toRem(20) 0 0 0;
  }
}

.base-deploy-form-price__amount-input {
  margin-top: toRem(6);
}

.app__collapsed-fields {
  margin-bottom: 0;
}
</style>
