<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { AppButton, Collapse, Icon, InfoTooltip, Loader } from '@/common'
import { SelectField, InputField, CheckboxField, SwitchField } from '@/fields'
import { BN } from '@/utils'
import { Product, useProduct } from '@/composables'
import { config } from '@/config'
import { formatAmount } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { Post } from '@/types'

import postsData from '@/assets/posts.json'

const posts = postsData as unknown as Post[]

const props = defineProps<{
  isBalanceInsuficient: boolean
  data: string[]
  isDiscountUsed: boolean
}>()

enum EVENTS {
  updateIsBalanceInsuficient = 'update:isBalanceInsuficient',
  updateData = 'update:data',
  updateDiscountData = 'update:discountData',
  updateisDiscountUsed = 'update:isDiscountUsed',
}

const emits = defineEmits<{
  (e: EVENTS.updateIsBalanceInsuficient, isBalanceInsuficient: boolean): void
  (e: EVENTS.updateData, data: string[]): void
  (
    e: EVENTS.updateDiscountData,
    data: {
      id: string
      value: string
    }[],
  ): void
  (e: EVENTS.updateisDiscountUsed, isDiscountUsed: boolean): void
}>()

const product = useProduct()
const route = useRoute()
const { provider } = storeToRefs(useWeb3ProvidersStore())

const paymentTokens = ref<Record<string, Array<string>>>({
  symbols: [],
  addresses: [],
})
const productPaymentToken = ref({
  balance: '',
  symbol: '',
  decimals: 0,
  amount: '0',
})
const selectedPaymentToken = ref({
  balance: '',
  symbol: '',
  decimals: 0,
  amount: '0',
})

const selectedProduct = ref<Product>()
const isPaymentLoaded = ref(false)

const discount = ref<{
  usedDiscount: string
  products: {
    id?: string
    discount?: string
    value: string
  }[]
}>({
  usedDiscount: '',
  products: [
    {
      id: 'erc20-mint-burn',
      discount: '10000000000000000000',
      value: '',
    },
    {
      id: 'erc20-mint',
      discount: '30000000000000000000',
      value: '',
    },
    {
      id: 'erc721-enum',
      discount: '341757683104456907300',
      value: '',
    },
  ],
})

const maxUsedDiscount = computed(() => {
  return new BN(
    new BN(availableDiscount.value).compare(
      selectedProduct.value?.currentPrice as string,
    ) === 1
      ? (selectedProduct.value?.currentPrice as string)
      : availableDiscount.value,
  )
    .fromFraction()
    .toString()
})

const availableDiscount = computed(() => {
  let result = '0'

  discount.value.products.forEach(
    item => (result = new BN(result).add(item.discount as string).toString()),
  )

  return result.toString()
})

const productPriceWithDiscount = computed(() =>
  new BN(selectedProduct.value?.currentPrice as string).sub(
    new BN(
      discount.value.usedDiscount === '' ? 0 : discount.value.usedDiscount,
    ).toFraction(),
  ),
)

const isBalanceInsuficientCalc = computed(() => {
  if (!selectedProduct.value) return false

  const currentPrice = new BN(selectedProduct.value?.currentPrice)
    .fromFraction(productPaymentToken.value.decimals)
    .toString()
  const paymentBalance = new BN(selectedPaymentToken.value.balance)
    .fromFraction(selectedPaymentToken.value.decimals)
    .toString()

  const isBalanceInsuficient =
    new BN(currentPrice).compare(paymentBalance) === 1

  emits(EVENTS.updateIsBalanceInsuficient, isBalanceInsuficient)

  return isBalanceInsuficient
})

const updatePayment = async (selectedSymbol: string | number) => {
  isPaymentLoaded.value = false

  emits(
    EVENTS.updateData,
    props.data.map((val, ind) => {
      if (ind === 0) return selectedSymbol as string
      else return val
    }),
  )

  const selectedIndex = paymentTokens.value.symbols.findIndex(
    symbol => symbol === selectedSymbol,
  )
  const selectedAddress = paymentTokens.value.addresses[selectedIndex]

  let symbol, decimals, balance, amount
  if (selectedIndex === 0) {
    ;({ symbol, decimals, balance, amount } =
      await product.getSelectedPaymentTokenInfo(selectedAddress))

    selectedPaymentToken.value = {
      ...selectedPaymentToken.value,
      symbol,
      decimals: Number(decimals),
      balance,
      amount: selectedProduct.value?.currentPrice ?? '0',
    }
  } else {
    ;({ symbol, decimals, balance, amount } =
      await product.getSelectedPaymentTokenInfo(
        selectedAddress,
        true,
        selectedProduct.value?.currentPrice ?? '0',
      ))

    selectedPaymentToken.value = {
      ...selectedPaymentToken.value,
      symbol,
      decimals: Number(decimals),
      balance,
      amount,
    }
  }

  emits(
    EVENTS.updateData,
    props.data.map((val, ind) => {
      if (ind === 1) return selectedPaymentToken.value.amount
      else return val
    }),
  )

  isPaymentLoaded.value = true
}

const toggleIfLoggedIn = (func: () => void) => {
  emits(EVENTS.updateisDiscountUsed, !props.isDiscountUsed)

  if (
    provider?.value.selectedAddress &&
    ![undefined, ''].includes(props.data[0])
  )
    func()
}

const emitDiscountData = () =>
  emits(
    EVENTS.updateDiscountData,
    discount.value.products.map(item => {
      return {
        id: item.id as string,
        value: new BN(item.value === '' ? 0 : item.value)
          .toFraction()
          .toString(),
      }
    }),
  )

const init = async () => {
  isPaymentLoaded.value = false

  const { symbols, addresses } = await product.getAvailablePaymentTokenList()

  paymentTokens.value.symbols = symbols
  paymentTokens.value.addresses = addresses

  const alias = config.PRODUCT_ALIASES[route.params.id as string]
  selectedProduct.value = await product.getProductInfo(alias)

  if (!addresses.length) return

  const { symbol, decimals, balance } =
    await product.getSelectedPaymentTokenInfo(addresses[0])

  productPaymentToken.value.symbol = symbol
  productPaymentToken.value.decimals = Number(decimals)
  productPaymentToken.value.balance = balance
  productPaymentToken.value.amount = selectedProduct.value.currentPrice

  discount.value.products.forEach(item => {
    watch(
      () => item.value,
      async () => {
        item.value =
          new BN((await item.discount) as string)
            .fromFraction()
            .compare(item.value === '' ? 0 : item.value) === 1
            ? item.value
            : new BN(item.discount as string).fromFraction().toString()

        let sum = new BN(0)

        discount.value.products.forEach(
          item => (sum = sum.add(item.value === '' ? 0 : item.value)),
        )

        discount.value.usedDiscount = sum.toString()

        emitDiscountData()
      },
    )
  })

  isPaymentLoaded.value = true
}

watch(
  () => discount.value.usedDiscount,
  async () => {
    if (discount.value.usedDiscount === '') {
      discount.value.products.forEach(item => (item.value = ''))
      emitDiscountData()
      return
    }

    discount.value.usedDiscount =
      new BN(await discount.value.usedDiscount).compare(
        maxUsedDiscount.value,
      ) === 1
        ? maxUsedDiscount.value
        : discount.value.usedDiscount

    let sum = new BN(0)

    discount.value.products.forEach(
      item => (sum = sum.add(item.value === '' ? 0 : item.value)),
    )

    const sumOfDiscounts = sum.toString()

    const compareSumAndUse = new BN(sumOfDiscounts).compare(
      discount.value.usedDiscount,
    )

    if (compareSumAndUse === 0) return

    let diff: BN

    if (compareSumAndUse === 1) {
      diff = new BN(sumOfDiscounts).sub(discount.value.usedDiscount)

      discount.value.products.forEach(item => {
        if (new BN(item.value === '' ? 0 : item.value).compare(diff) === -1) {
          diff = diff.sub(item.value === '' ? 0 : item.value)
          item.value = ''
        } else {
          item.value = new BN(item.value === '' ? 0 : item.value)
            .sub(diff)
            .toString()
          diff = new BN(0)
        }

        if (item.value === '0') item.value = ''
      })

      emitDiscountData()
    } else {
      diff = new BN(discount.value.usedDiscount).sub(sumOfDiscounts)

      discount.value.products.forEach(item => {
        const freeDiscount = new BN(item.discount as string)
          .fromFraction()
          .sub(item.value === '' ? 0 : item.value)

        if (diff.compare(freeDiscount) === 1) {
          diff = diff.sub(freeDiscount)
          item.value = new BN(item.discount as string).fromFraction().toString()
        } else {
          item.value = new BN(item.value === '' ? 0 : item.value)
            .add(diff)
            .toString()
          diff = new BN(0)
        }

        if (item.value === '0') item.value = ''
      })

      emitDiscountData()
    }
  },
)

watch(
  () => isBalanceInsuficientCalc.value,
  () =>
    emits(EVENTS.updateIsBalanceInsuficient, isBalanceInsuficientCalc.value),
)

init()
</script>
<template>
  <div class="base-deploy-form-price app__form-control">
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
            <div class="app__field-row">
              <select-field
                class="app__module-field"
                :model-value="data[0]"
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
            <!-- eslint-disable -->
            <template
              v-if="
                ![undefined, ''].includes(data[0]) &&
                selectedProduct?.currentPrice
              "
            >
              <!-- eslint-enable -->
              <div class="app__row" v-if="isPaymentLoaded">
                <span class="app__row-title">
                  {{ $t('product-deploy.default.product-price') }}
                </span>
                <div class="app__balance">
                  {{
                    formatAmount(
                      selectedProduct.currentPrice,
                      productPaymentToken.decimals,
                    )
                  }}
                  <span>{{ productPaymentToken.symbol }}</span>
                </div>
              </div>
              <loader v-else class="base-deploy-form-price__balance-loader" />
              <div v-if="data[0] !== productPaymentToken.symbol">
                <div class="app__row" v-if="isPaymentLoaded">
                  <span class="app__row-title">
                    {{
                      $t('product-deploy.default.product-swap-price', {
                        fromSymbol: selectedPaymentToken.symbol,
                        toSymbol: productPaymentToken.symbol,
                      })
                    }}
                  </span>
                  <div class="app__balance">
                    {{
                      formatAmount(
                        selectedPaymentToken.amount,
                        selectedPaymentToken.decimals,
                      )
                    }}
                    <span>{{ selectedPaymentToken.symbol }}</span>
                  </div>
                </div>
                <loader
                  v-else-if="
                    paymentTokens.symbols.findIndex(
                      symbol => symbol === data[0],
                    ) !== 0
                  "
                  class="base-deploy-form-price__balance-loader"
                />
              </div>
              <div v-if="selectedPaymentToken.balance">
                <div
                  class="app__row base-deploy-form-price__balance"
                  v-if="isPaymentLoaded"
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
                <loader v-else class="base-deploy-form-price__balance-loader" />
              </div>
            </template>
          </div>
        </div>
        <collapse
          class="app__form-control base-deploy-form-price__discount"
          :is-close-by-click-outside="false"
        >
          <template #head="{ collapse }">
            <div class="base-deploy-form-price__discount-checkbox">
              <checkbox-field
                class=""
                :model-value="isDiscountUsed"
                :label="$t('product-deploy.default.discount-checkbox-lbl')"
                :disabled="
                  !provider.selectedAddress || [undefined, ''].includes(data[0])
                "
                @click="toggleIfLoggedIn(collapse.toggle)"
              />
            </div>
          </template>
          <template #default>
            <div class="app__field-row base-deploy-form-price__amount-input">
              <input-field
                class="app__module-field"
                v-model="discount.usedDiscount"
                scheme="secondary"
                :label="$t('product-deploy.default.discount-input-lbl')"
              />
              <div class="app__field-tooltip">
                <info-tooltip
                  :text="$t('product-deploy.default.discount-tooltip-lbl')"
                  :move-side="'left'"
                />
              </div>
            </div>
            <div class="base-deploy-form-price__discount-block">
              <div class="app__row">
                <span class="app__row-title">
                  {{ $t('product-deploy.default.discount-available-lbl') }}
                </span>
                <div class="app__balance">
                  {{ formatAmount(availableDiscount) }}
                  <span>{{ productPaymentToken.symbol }}</span>
                </div>
              </div>
              <div class="app__row">
                <span class="app__row-title">
                  {{ $t('product-deploy.default.discount-price-lbl') }}
                </span>
                <div class="app__balance">
                  {{
                    formatAmount(
                      productPriceWithDiscount.toString(),
                      productPaymentToken.decimals,
                    )
                  }}
                  <span>{{ productPaymentToken.symbol }}</span>
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
                      v-for="(item, idx) in discount.products"
                      class="app__row base-deploy-form-price__manual-row"
                      :key="idx"
                    >
                      <div class="base-deploy-form-price__manual-key">
                        <span class="base-deploy-form-price__manual-title">
                          {{ posts.find(el => el.id === item.id)?.title ?? '' }}
                        </span>
                        <!--eslint-disable -->
                        {{
                          ` (${$t(
                            'product-deploy.default.discount-manual-available-lbl',
                          )} `
                        }}
                        <!--eslint-enable -->
                        <span class="base-deploy-form-price__manual-available">
                          {{
                            formatAmount(
                              item.discount,
                              productPaymentToken.decimals,
                              productPaymentToken.symbol,
                            )
                          }} </span
                        >{{ `)` }}
                      </div>
                      <!--eslint-disable -->
                      <input-field
                        class="base-deploy-form-price__manual-input app__module-field"
                        :label="
                          $t('product-deploy.default.discount-manual-inp-lbl', {
                            symbol: productPaymentToken.symbol,
                          })
                        "
                        scheme="secondary"
                        v-model="item.value"
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

.base-deploy-form-price__discount-checkbox {
  font-size: toRem(16);
  display: flex;
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
  padding-top: toRem(6);
}
</style>
