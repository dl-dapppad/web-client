<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import {
  formatAmount,
  formatPercent,
  getChain,
  getEmptyChain,
  isChainAvailable,
  ErrorHandler,
} from '@/helpers'
import { Chain, Post } from '@/types'
import {
  useErc20,
  useProductFactory,
  useFarming,
  Product,
  useProduct,
} from '@/composables'
import {
  AppButton,
  AppBlock,
  Icon,
  LineChart,
  InfoTooltip,
  LinkCopy,
} from '@/common'
import { BN } from '@/utils'
import { CONTRACT_NAMES } from '@/enums'
import { config } from '@/config'
import { InputField } from '@/fields'
import { useI18n } from 'vue-i18n'

defineProps<{
  post: Post
}>()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const route = useRoute()
const dapp = useErc20()
const paymentToken = useErc20()
const factory = useProductFactory()
const farming = useFarming()
const composableProduct = useProduct()
const { t } = useI18n()

const addressSearchInput = ref('')
const alias = ref('')
const chain = ref<Chain>(getEmptyChain())
const product = ref<Product>(factory.getEmptyProduct())
const cashback = ref('0')
const chartData = ref<number[]>([])

const clickContractSearch = async () => {
  composableProduct.handleContractSearch(addressSearchInput.value)
}

const getChartData = (product: Product, decimals: number) => {
  let chartData = [] as number[]

  const basePrice = Number(
    new BN(product.currentPrice).fromFraction(decimals).toString(),
  )

  if (!basePrice) return []

  const minPrice = Number(
    new BN(product.minPrice).fromFraction(decimals).toString(),
  )
  let currentPrice = basePrice
  const decreasePercent = Number(
    new BN(product.decreasePercent).fromFraction(27).toString(),
  )
  const salesCount = Number(product.salesCount)
  for (let i = salesCount; i > 0; i--) {
    const price = currentPrice / (1 - decreasePercent)

    chartData.push(price)
    currentPrice = price
  }

  chartData = chartData.reverse()
  chartData.push(basePrice)
  currentPrice = basePrice

  while (currentPrice > minPrice) {
    const price = currentPrice * (1 - decreasePercent)
    if (price < minPrice) {
      for (let i = 0; i < 5; i++) {
        chartData.push(minPrice)
      }
    } else {
      chartData.push(price)
    }

    currentPrice = price
  }

  return chartData
}

const init = async () => {
  if (!provider.value.chainId || !isChainAvailable(provider.value.chainId))
    return

  try {
    alias.value = config.PRODUCT_ALIASES[route.params.id as string]
    if (!alias.value) return

    chain.value = getChain(provider.value.chainId)
    dapp.init(config.CONTRACTS[provider.value.chainId][CONTRACT_NAMES.DAPP])

    await Promise.all([
      dapp.loadDetails(),
      farming.loadDetails(),
      factory.products(alias.value),
      factory.getCashback(alias.value),
    ]).then(res => {
      product.value = res[2]
      cashback.value = res[3]
      return
    })

    paymentToken.init(farming.rewardToken.value)
    await paymentToken.loadDetails()

    chartData.value = getChartData(product.value, paymentToken.decimals.value)
  } catch (error) {
    ErrorHandler.process(error)
  }
}

init()
</script>

<template>
  <div class="post-checkout">
    <template v-if="alias">
      <app-block class="post-checkout__block-wrp">
        <div class="post-checkout__block">
          <div class="app__metadata-row">
            <div class="post-checkout__block-lbl">
              <icon
                class="post-checkout__block-lbl-icon"
                :name="$icons.checkCircleFilled"
              />
              {{ $t('post-checkout.have-product-lbl') }}
            </div>
            <div class="post-checkout__block-input-value">
              <app-button
                class="post-checkout__block-search-btn"
                :icon-right="$icons.searchFilled"
                @click="handleContractAddress"
              />
              <input-field
                scheme="secondary"
                v-model="addressSearchInput"
                :label="t('post-checkout.have-product-input-lbl')"
              />
              <info-tooltip
                class="post-checkout__block-tooltip"
                :text="t('post-checkout.have-product-input-tooltip-txt')"
              />
            </div>
          </div>
        </div>
      </app-block>
      <app-block>
        <div class="post-checkout__block">
          <div class="app__metadata">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-checkout.current-network-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{ chain?.name ?? "Network isn't detected" }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-checkout.sales-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{ product.salesCount }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-checkout__metadata-tooltip"
                  :text="$t('post-checkout.decrease-percent-tooltip')"
                />
                {{ $t('post-checkout.decrease-percent-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{ formatPercent(product.decreasePercent) }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-checkout__metadata-tooltip"
                  :text="$t('post-checkout.cashback-percent-tooltip')"
                />
                {{ $t('post-checkout.cashback-percent-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{ formatPercent(product.cashbackPercent) }}
              </span>
            </div>
          </div>
          <div class="app__metadata">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-checkout.implementation-address-lbl') }}
              </span>
              <link-copy
                :address="product.implementation"
                class="app__link--accented"
              />
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-checkout.factory-address-lbl') }}
              </span>
              <link-copy
                :address="factory.address.value"
                class="app__link--accented"
              />
            </div>
          </div>
        </div>
      </app-block>
      <app-block>
        <div class="post-checkout__block">
          <div class="app__metadata">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-checkout__metadata-tooltip"
                  :text="$t('post-checkout.minimal-price-tooltip')"
                />
                {{ $t('post-checkout.minimal-price-lbl') }}
              </span>
              <span class="app__metadata-value">
                <span class="app__price">
                  {{
                    formatAmount(
                      product.minPrice,
                      paymentToken?.decimals.value ?? '0',
                    )
                  }}
                  <span class="app__price-asset">
                    {{ paymentToken?.symbol.value }}
                  </span>
                </span>
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-checkout__metadata-tooltip"
                  :text="$t('post-checkout.reward-tooltip')"
                />
                {{ $t('post-checkout.reward-lbl') }}
              </span>
              <span class="app__metadata-value">
                <span class="app__price">
                  {{ formatAmount(cashback, dapp?.decimals.value ?? '0') }}
                  <span class="app__price-asset">
                    {{ dapp?.symbol.value }}
                  </span>
                </span>
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-checkout__metadata-tooltip"
                  :text="$t('post-checkout.distribution-tooltip')"
                />
                {{ $t('post-checkout.distribution-lbl') }}
              </span>
              <span class="app__metadata-value">
                <span class="app__price">
                  {{ formatAmount(cashback, paymentToken?.decimals.value) }}
                  <span class="app__price-asset">
                    {{ paymentToken?.symbol.value }}
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div class="post-checkout__buy-wrp">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-checkout.current-price-lbl') }}
              </span>
              <span class="app__metadata-value app__metadata-value--big">
                <span class="app__price app__price--big">
                  {{
                    formatAmount(
                      product.currentPrice,
                      paymentToken?.decimals.value ?? '0',
                    )
                  }}
                  <span class="app__price-asset">
                    {{ paymentToken?.symbol.value }}
                  </span>
                </span>
              </span>
            </div>
            <app-button
              class="post-checkout__buy-link"
              size="large"
              :text="$t('post-checkout.buy-now-link')"
              :route="{
                name: $routes.productDeploy,
                params: { id: route.params.id },
              }"
            />
            <div class="post-checkout__buy-description">
              {{ $t('post-checkout.buy-description-lbl') }}
            </div>
          </div>
        </div>
      </app-block>
      <app-block class="post-checkout__block-wrp">
        <div class="post-checkout__block post-checkout__block--chart">
          <div class="app__metadata">
            <h2 class="post-checkout__block-title">
              {{ post.chartTitle }}
            </h2>
            <line-chart class="post-checkout__block-chart" :data="chartData" />
            <span class="post-checkout__block-description">
              {{ post.chartDescription }}
            </span>
          </div>
        </div>
      </app-block>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.post-checkout {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.post-checkout__block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: toRem(40) toRem(110);
  gap: toRem(40);
  height: 100%;

  &--chart {
    padding: toRem(70) toRem(165);
  }
}

.post-checkout__block-lbl {
  display: flex;
  align-items: center;
  gap: toRem(12);
  font-size: toRem(20);
}

.post-checkout__block-input-value {
  width: 100%;
  max-width: toRem(430);
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: toRem(10);
}

.post-checkout__block-lbl-icon {
  height: toRem(20);
  width: toRem(20);
}

.post-checkout__block-search-btn {
  padding: toRem(17);
  height: 100%;
  font-size: toRem(15);
}

.post-checkout__buy-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.post-checkout__address {
  display: flex;
  align-items: center;
  gap: toRem(10);
  font-size: toRem(16);
  font-weight: 700;
  color: var(--secondary-main);
  cursor: pointer;
}

.post-checkout__icon {
  max-height: toRem(16);
  max-width: toRem(16);
  min-height: toRem(16);
  min-width: toRem(16);

  .post-checkout__address & {
    color: var(--text-primary-main);
  }

  &--clipboard {
    max-height: toRem(12);
    max-width: toRem(12);
    min-height: toRem(12);
    min-width: toRem(12);
  }
}

.post-checkout__buy-link {
  width: 100%;
  padding-top: toRem(11);
  padding-bottom: toRem(11);
}

.post-checkout__buy-description {
  color: var(--text-secondary-main);
  font-size: toRem(12);
  text-align: center;
  padding: 0 toRem(5);
}

.post-checkout__block-chart {
  max-width: 100%;
}

.post-checkout__block-title {
  font-size: toRem(36);
  font-weight: 900;
}

.post-checkout__block-description {
  font-size: toRem(20);
}

.post-checkout__block-wrp {
  grid-column: 1 / -1;
}

.post-checkout__metadata-tooltip {
  transform: translateX(-#{toRem(6)});
}
</style>
