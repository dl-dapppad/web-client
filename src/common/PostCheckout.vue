<script lang="ts" setup>
import { AppButton, AppBlock, Icon, LineChart } from '@/common'
import { copyToClipboard } from '@/helpers'
import { cropAddress } from '@/helpers'
import { useRoute } from '@/router'
import { computed } from 'vue'

const route = useRoute()

const postId = computed(() => route.params.id)

const props = defineProps<{
  postCheckoutMetadata: {
    currentNetwork: string
    salesCount: number
    decreasePercent: number
    cashbackPercent: number
    implementation: string
    factory: string
    minPrice: string
    reward: string
    distribution: string
    currentPrice: string
    chartData: number[]
    startPrice: number
    chartTitle: string
    chartDescription: string
  }
}>()

const chartData = {
  data: props.postCheckoutMetadata.chartData,
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
              {{ postCheckoutMetadata.currentNetwork }}
            </span>
          </div>
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ $t('post-checkout.sales-lbl') }}
            </span>
            <span class="app__metadata-value">
              {{ postCheckoutMetadata.salesCount }}
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
              {{ `${postCheckoutMetadata.decreasePercent}%` }}
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
              {{ `${postCheckoutMetadata.cashbackPercent}%` }}
            </span>
          </div>
        </div>
        <div class="app__metadata">
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ $t('post-checkout.implementation-address-lbl') }}
            </span>
            <span
              :title="props.postCheckoutMetadata.implementation"
              class="post-checkout__address"
              @click="
                copyToClipboard(props.postCheckoutMetadata.implementation)
              "
            >
              {{ cropAddress(props.postCheckoutMetadata.implementation) }}
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
              :title="props.postCheckoutMetadata.factory"
              class="post-checkout__address"
              @click="copyToClipboard(props.postCheckoutMetadata.factory)"
            >
              {{ cropAddress(props.postCheckoutMetadata.factory) }}
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
              {{ postCheckoutMetadata.minPrice }}
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
              {{ postCheckoutMetadata.reward }}
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
              {{ postCheckoutMetadata.distribution }}
            </span>
          </div>
        </div>
        <div class="post-checkout__buy-wrp">
          <div class="app__metadata-row">
            <span class="app__metadata-lbl">
              {{ $t('post-checkout.current-price-lbl') }}
            </span>
            <span class="app__metadata-value">
              {{ postCheckoutMetadata.currentPrice }}
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

.app__metadata-inner {
  padding: toRem(70) toRem(165);
  display: flex;
  flex-direction: column;
  gap: toRem(30);
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
