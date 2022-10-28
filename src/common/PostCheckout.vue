<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { config } from '@config'
import { useWeb3ProvidersStore } from '@/store'
import {
  formatAmount,
  formatPercent,
  cropAddress,
  getChain,
  getEmptyChain,
} from '@/helpers'
import { Chain, Product } from '@/types'
import { useErc20, useProductFactory, useFarming } from '@/composables'
import { AppButton, AppBlock, Icon, LineChart } from '@/common'
import { copyToClipboard } from '@/helpers'
import { getAlias } from '@/helpers/product-alias.helper'

const route = useRoute()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const dapp = useErc20(
  provider?.value.currentProvider,
  provider?.value.currentSigner,
)

const paymentToken = useErc20(
  provider?.value.currentProvider,
  provider?.value.currentSigner,
)

const factory = useProductFactory(
  provider?.value.currentProvider,
  provider?.value.currentSigner,
)

const farming = useFarming(
  provider?.value.currentProvider,
  provider?.value.currentSigner,
)

const alias = ref('')
const chain = ref<Chain>(getEmptyChain())
const product = ref<Product>(factory.getEmptyProduct())
const cashback = ref('0')

const init = async () => {
  chain.value = getChain(provider.value.chainId ?? '')
  dapp.init(config.CONTRACT_DAPP)

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
}

if (provider.value.chainId) {
  alias.value = getAlias(provider.value.chainId, route.params.id as string)
  if (alias.value) init()
}
</script>

<template>
  <div class="post-checkout">
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
              :title="factory.getAddress()"
              class="post-checkout__address"
              @click="copyToClipboard(factory.getAddress())"
            >
              {{ cropAddress(factory.getAddress()) }}
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
            <span class="post-checkout__value">
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
            <span class="post-checkout__value">
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
            <span class="post-checkout__value">
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
            <span class="post-checkout__value">
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
              name: $routes.postItemDeployment,
              params: { id: postId },
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
            {{ postCheckoutMetadata.chartTitle }}
          </h2>
          <line-chart
            class="post-checkout__block-chart"
            :chart-data="chartData"
          />
          <span class="post-checkout__block-description">
            {{ postCheckoutMetadata.chartDescription }}
          </span>
        </div>
      </div>
    </app-block>
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
