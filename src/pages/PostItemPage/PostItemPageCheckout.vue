<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useWeb3ProvidersStore } from '@/store'
import { formatAmount, formatPercent, ErrorHandler } from '@/helpers'
import { Post } from '@/types'
import {
  useErc20,
  useProductFactory,
  useFarming,
  Product,
  useProduct,
  useChart,
} from '@/composables'
import {
  AppButton,
  AppBlock,
  Icon,
  LineChart,
  InfoTooltip,
  AddressCopy,
  Loader,
} from '@/common'
import { CONTRACT_NAMES } from '@/enums'
import { config } from '@/config'
import { InputField } from '@/fields'
import { useI18n } from 'vue-i18n'

defineProps<{
  post: Post
}>()

const web3Store = useWeb3ProvidersStore()
const { provider } = storeToRefs(useWeb3ProvidersStore())

const route = useRoute()
const dapp = useErc20()
const paymentToken = useErc20()
const factory = useProductFactory()
const farming = useFarming()
const composableProduct = useProduct()

const { t } = useI18n()

const addressSearchInput = ref('')
const addressSearchButtonDisabled = ref(false)
const alias = ref('')
const product = ref<Product>(factory.getEmptyProduct())
const cashback = ref('0')

const chart = useChart()

const isProductLoaded = ref(false)

const clickContractSearch = () => {
  addressSearchButtonDisabled.value = true
  composableProduct.handleContractSearch(addressSearchInput.value)
  addressSearchButtonDisabled.value = false
}

const init = async () => {
  if (!provider.value.chainId || !web3Store.isCurrentChainAvailable) return

  try {
    alias.value = config.PRODUCT_ALIASES[route.params.id as string]
    if (!alias.value) return

    dapp.init(config.CONTRACTS[provider.value.chainId][CONTRACT_NAMES.DAPP])

    const [productData, cashbackAmount] = await Promise.all([
      factory.products(alias.value),
      factory.getCashback(alias.value),
      dapp.loadDetails(),
      farming.loadDetails(),
    ])

    product.value = productData
    cashback.value = cashbackAmount

    paymentToken.init(farming.rewardToken.value)
    await paymentToken.loadDetails()

    isProductLoaded.value = true

    chart.updateChartData(
      product.value,
      paymentToken.decimals.value,
      paymentToken.symbol.value,
    )
  } catch (error) {
    ErrorHandler.process(error)
  }
}

init()
</script>

<template>
  <div class="post-item-page-checkout">
    <template v-if="alias">
      <app-block class="post-item-page-checkout__block-wrp">
        <div class="post-item-page-checkout__block">
          <div class="post-item-page-checkout__block-product">
            <div class="post-item-page-checkout__block-lbl">
              <icon
                class="post-item-page-checkout__block-lbl-icon"
                :name="$icons.checkCircleFilled"
              />
              {{ $t('post-item-page-checkout.have-product-lbl') }}
            </div>
            <div class="post-item-page-checkout__block-address-wrp">
              <div class="post-item-page-checkout__block-input-wrp">
                <input-field
                  class="app__module-field post-item-page-checkout__block-input"
                  scheme="secondary"
                  v-model="addressSearchInput"
                  :label="t('post-item-page-checkout.have-product-input-lbl')"
                />
                <info-tooltip
                  class="post-item-page-checkout__block-tooltip"
                  :text="
                    t('post-item-page-checkout.have-product-input-tooltip-txt')
                  "
                  move-side="right"
                />
              </div>
              <app-button
                class="post-checkout__block-search-btn"
                :icon-right="$icons.searchFilled"
                :disabled="addressSearchButtonDisabled || !addressSearchInput"
                @click="clickContractSearch"
              />
            </div>
          </div>
        </div>
      </app-block>
      <app-block class="post-item-page-checkout__block-second">
        <div class="post-item-page-checkout__block">
          <div class="app__metadata">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-item-page-checkout.current-network-lbl') }}
              </span>
              <span class="app__metadata-value">
                {{ web3Store.currentChain?.name ?? "Network isn't detected" }}
              </span>
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-item-page-checkout.sales-lbl') }}
              </span>
              <span v-if="isProductLoaded" class="app__metadata-value">
                {{ product.salesCount }}
              </span>
              <loader v-else />
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-item-page-checkout__metadata-tooltip"
                  :text="$t('post-item-page-checkout.decrease-percent-tooltip')"
                />
                {{ $t('post-item-page-checkout.decrease-percent-lbl') }}
              </span>
              <span v-if="isProductLoaded" class="app__metadata-value">
                {{ formatPercent(product.decreasePercent) }}
              </span>
              <loader v-else />
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-item-page-checkout__metadata-tooltip"
                  :text="$t('post-item-page-checkout.cashback-percent-tooltip')"
                />
                {{ $t('post-item-page-checkout.cashback-percent-lbl') }}
              </span>
              <span v-if="isProductLoaded" class="app__metadata-value">
                {{ formatPercent(product.cashbackPercent) }}
              </span>
              <loader v-else />
            </div>
          </div>
          <div class="app__metadata">
            <div class="post-item-page-checkout__block-row">
              <span class="app__metadata-lbl">
                {{ $t('post-item-page-checkout.implementation-address-lbl') }}
              </span>
              <address-copy
                v-if="isProductLoaded"
                :address="product.implementation"
                class="app__link--accented"
              />
              <loader v-else />
            </div>
            <div class="post-item-page-checkout__block-row">
              <span class="app__metadata-lbl">
                {{ $t('post-item-page-checkout.factory-address-lbl') }}
              </span>
              <address-copy
                v-if="isProductLoaded"
                :address="factory.address.value"
                class="app__link--accented"
              />
              <loader v-else />
            </div>
          </div>
        </div>
      </app-block>
      <app-block>
        <div class="post-item-page-checkout__block">
          <div class="app__metadata">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-item-page-checkout__metadata-tooltip"
                  :text="$t('post-item-page-checkout.minimal-price-tooltip')"
                  :move-side="'right'"
                />
                {{ $t('post-item-page-checkout.minimal-price-lbl') }}
              </span>
              <span v-if="isProductLoaded" class="app__metadata-value">
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
              <loader v-else />
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-item-page-checkout__metadata-tooltip"
                  :text="$t('post-item-page-checkout.reward-tooltip')"
                  :move-side="'right'"
                />
                {{ $t('post-item-page-checkout.reward-lbl') }}
              </span>
              <span v-if="isProductLoaded" class="app__metadata-value">
                <span class="app__price">
                  {{ formatAmount(cashback, dapp?.decimals.value ?? '0') }}
                  <span class="app__price-asset">
                    {{ dapp?.symbol.value }}
                  </span>
                </span>
              </span>
              <loader v-else />
            </div>
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                <info-tooltip
                  class="post-item-page-checkout__metadata-tooltip"
                  :text="$t('post-item-page-checkout.distribution-tooltip')"
                  :move-side="'right'"
                />
                {{ $t('post-item-page-checkout.distribution-lbl') }}
              </span>
              <span v-if="isProductLoaded" class="app__metadata-value">
                <span class="app__price">
                  {{ formatAmount(cashback, paymentToken?.decimals.value) }}
                  <span class="app__price-asset">
                    {{ paymentToken?.symbol.value }}
                  </span>
                </span>
              </span>
              <loader v-else />
            </div>
          </div>
          <div class="post-item-page-checkout__buy-wrp">
            <div class="app__metadata-row">
              <span class="app__metadata-lbl">
                {{ $t('post-item-page-checkout.current-price-lbl') }}
              </span>
              <span
                v-if="isProductLoaded"
                class="app__metadata-value app__metadata-value--big"
              >
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
              <loader v-else />
            </div>
            <app-button
              class="post-item-page-checkout__buy-link"
              size="large"
              :text="$t('post-item-page-checkout.buy-now-link')"
              :route="{
                name: $routes.productDeploy,
                params: { id: route.params.id },
              }"
            />
            <div class="post-item-page-checkout__buy-description">
              {{ $t('post-item-page-checkout.buy-description-lbl') }}
            </div>
          </div>
        </div>
      </app-block>
      <app-block class="post-item-page-checkout__block-wrp">
        <div class="post-item-page-checkout__block-chart">
          <div class="app__metadata">
            <h2 class="post-item-page-checkout__block-title">
              {{ post.chartTitle }}
            </h2>
            <line-chart
              v-if="chart.chartData.value.values.length"
              :chart="chart.chartData.value"
            />
            <loader v-else />
            <span class="post-item-page-checkout__block-description">
              {{ post.chartDescription }}
            </span>
          </div>
        </div>
      </app-block>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.post-item-page-checkout {
  display: grid;
  grid-template-columns: 1fr 1fr;

  @include respond-to(medium) {
    grid-template-columns: 1fr;
  }
}

.post-item-page-checkout__block-second {
  padding-right: 0;

  @include respond-to(medium) {
    padding: toRem(1) toRem(1) 0;
  }
}

.post-item-page-checkout__block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: toRem(40) toRem(110);
  gap: toRem(40);
  height: 100%;

  &--chart {
    padding: toRem(70) toRem(165);
  }

  @include respond-to(medium) {
    padding: toRem(30) toRem(20);
  }
}

.post-item-page-checkout__block-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @include respond-to(medium) {
    flex-direction: column;
    align-items: start;
    gap: toRem(12);
  }
}

.post-item-page-checkout__block-chart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: toRem(70) toRem(165) toRem(40);
  gap: toRem(40);
  height: 100%;
  max-width: 100%;

  @include respond-to(medium) {
    padding: toRem(30) toRem(20);
  }
}

.post-item-page-checkout__block-product {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(25);

    & > *:not([disabled]) {
      max-width: 100%;
    }
  }
}

.post-item-page-checkout__block-lbl {
  display: flex;
  align-items: center;
  gap: toRem(12);
  font-size: toRem(20);

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.post-item-page-checkout__block-address-wrp {
  width: 100%;
  max-width: toRem(430);
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: toRem(10);

  @include respond-to(small) {
    flex-direction: column;
  }
}

.post-item-page-checkout__block-input-wrp {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: toRem(10);

  @include respond-to(medium) {
    width: calc(100% - #{toRem(66)});
  }

  @include respond-to(small) {
    width: 100%;
  }
}

.post-item-page-checkout__block-tooltip {
  @include respond-to(small) {
    justify-self: start;
  }
}

.post-checkout__block-search-btn {
  padding: toRem(17);
  font-size: toRem(15);
  order: -1;

  @include respond-to(small) {
    order: 0;
    width: 100%;
  }
}

.post-item-page-checkout__block-lbl-icon {
  min-height: toRem(20);
  min-width: toRem(20);
  max-height: toRem(20);
  max-width: toRem(20);
}

.post-item-page-checkout__buy-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(10);

  .loader {
    height: toRem(28);
  }
}

.post-item-page-checkout__address {
  display: flex;
  align-items: center;
  gap: toRem(10);
  font-size: toRem(16);
  font-weight: 700;
  color: var(--secondary-main);
  cursor: pointer;
}

.post-item-page-checkout__icon {
  max-height: toRem(16);
  max-width: toRem(16);
  min-height: toRem(16);
  min-width: toRem(16);

  .post-item-page-checkout__address & {
    color: var(--text-primary-main);
  }

  &--clipboard {
    max-height: toRem(12);
    max-width: toRem(12);
    min-height: toRem(12);
    min-width: toRem(12);
  }
}

.post-item-page-checkout__buy-link {
  width: 100%;
  padding-top: toRem(11);
  padding-bottom: toRem(11);
}

.post-item-page-checkout__buy-description {
  color: var(--text-secondary-main);
  font-size: toRem(12);
  text-align: center;
  padding: 0 toRem(5);
}

.post-item-page-checkout__block-title {
  font-size: toRem(36);
  font-weight: 900;
}

.post-item-page-checkout__block-description {
  font-size: toRem(20);
  line-height: 1.3;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.post-item-page-checkout__block-wrp {
  grid-column: 1 / -1;
  padding: 0 toRem(1);
}

.post-item-page-checkout__metadata-tooltip {
  transform: translateX(-#{toRem(6)});
}
</style>
