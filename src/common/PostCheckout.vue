<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useWeb3ProvidersStore } from '@/store'
import {
  formatAmount,
  formatPercent,
  cropAddress,
  getChain,
  getEmptyChain,
  isChainAvailable,
  ErrorHandler,
  copyToClipboard,
} from '@/helpers'
import { Chain, Post } from '@/types'
import { useErc20, useProductFactory, useFarming, Product } from '@/composables'
import { AppButton, AppBlock, Icon, LineChart, InfoTooltip } from '@/common'
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
const { t } = useI18n()

const contactAddress = ref('')
const alias = ref('')
const chain = ref<Chain>(getEmptyChain())
const product = ref<Product>(factory.getEmptyProduct())
const cashback = ref('0')
const chartData = ref<number[]>([])

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
              <input-field
                scheme="secondary"
                v-model="contactAddress"
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
                <icon
                  class="post-checkout__icon"
                  :name="$icons.informationCircle"
                />
                {{ $t('post-checkout.decrease-percent-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{ formatPercent(product.decreasePercent) }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <icon
                  class="post-checkout__icon"
                  :name="$icons.informationCircle"
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
              <span
                :title="product.implementation"
                class="post-checkout__address"
                @click="copyToClipboard(product.implementation)"
              >
                {{ cropAddress(product.implementation) }}
                <icon
                  class="post-checkout__icon post-checkout__icon-clipboard"
                  :name="$icons.duplicate"
                />
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-checkout.factory-address-lbl') }}
              </span>
              <span
                :title="factory.address.value"
                class="post-checkout__address"
                @click="copyToClipboard(factory.address.value)"
              >
                {{ cropAddress(factory.address.value) }}
                <icon
                  class="post-checkout__icon post-checkout__icon-clipboard"
                  :name="$icons.duplicate"
                />
              </span>
            </div>
          </div>
        </div>
      </app-block>
      <app-block>
        <div class="post-checkout__block">
          <div class="app__metadata">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <icon
                  class="post-checkout__icon"
                  :name="$icons.informationCircle"
                />
                {{ $t('post-checkout.minimal-price-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{
                  formatAmount(
                    product.minPrice,
                    paymentToken?.decimals.value ?? '0',
                    paymentToken?.symbol.value,
                  )
                }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <icon
                  class="post-checkout__icon"
                  :name="$icons.informationCircle"
                />
                {{ $t('post-checkout.reward-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{
                  formatAmount(
                    cashback,
                    dapp?.decimals.value ?? '0',
                    dapp?.symbol.value,
                  )
                }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <icon
                  class="post-checkout__icon"
                  :name="$icons.informationCircle"
                />
                {{ $t('post-checkout.distribution-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{
                  formatAmount(
                    cashback,
                    paymentToken?.decimals.value,
                    paymentToken?.symbol.value,
                  )
                }}
              </span>
            </div>
          </div>
          <div class="post-checkout__buy-wrp">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-checkout.current-price-lbl') }}
              </span>
              <span class="app__metadata-value app__metadata-value--big">
                {{
                  formatAmount(
                    product.currentPrice,
                    paymentToken?.decimals.value ?? '0',
                    paymentToken?.symbol.value,
                  )
                }}
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
        <div class="post-checkout__block">
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
  align-items: center;
  gap: toRem(10);
}

.post-checkout__block-lbl-icon {
  height: toRem(20);
  width: toRem(20);
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
  height: toRem(16);
  width: toRem(16);

  .post-checkout__address & {
    color: var(--text-primary-main);
  }
}

.post-checkout__buy-link {
  width: 100%;
}

.post-checkout__buy-description {
  color: var(--text-secondary-main);
  font-size: toRem(14);
  text-align: center;
  padding: 0 toRem(30);
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
</style>
