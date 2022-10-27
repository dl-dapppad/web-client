<script lang="ts" setup>
import { AppButton, AppBlock, Icon, LineChart } from '@/common'
import { copyToClipboard } from '@/helpers'
import { cropAddress } from '@/helpers'

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
  }
  formatterChartFunc: {
    (xValue: number, yValue: number): string
  }
}>()

const chartData = {
  data: props.postCheckoutMetadata.chartData,
  yMaxChart: props.postCheckoutMetadata.startPrice,
}
</script>

<template>
  <div class="post-checkout">
    <div class="post-checkout__top">
      <app-block class="post-checkout__top-inner">
        <div class="post-checkout__about">
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              {{ $t('post-checkout.current-network-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ props.postCheckoutMetadata.currentNetwork }}
            </span>
          </div>
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              {{ $t('post-checkout.sales-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ props.postCheckoutMetadata.salesCount }}
            </span>
          </div>
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              <icon
                class="post-checkout__icon"
                :name="$icons.informationCircle"
              />
              {{ $t('post-checkout.decrease-percent-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ `${props.postCheckoutMetadata.decreasePercent}%` }}
            </span>
          </div>
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              <icon
                class="post-checkout__icon"
                :name="$icons.informationCircle"
              />
              {{ $t('post-checkout.cashback-percent-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ `${props.postCheckoutMetadata.cashbackPercent}%` }}
            </span>
          </div>
        </div>
        <div class="post-checkout__about">
          <div class="post-checkout__item">
            <span class="post-checkout__key">
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
          <div class="post-checkout__item">
            <span class="post-checkout__key">
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
      </app-block>
      <app-block class="post-checkout__top-inner">
        <div class="post-checkout__about">
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              <icon
                class="post-checkout__icon"
                :name="$icons.informationCircle"
              />
              {{ $t('post-checkout.minimal-price-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ props.postCheckoutMetadata.minPrice }}
            </span>
          </div>
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              <icon
                class="post-checkout__icon"
                :name="$icons.informationCircle"
              />
              {{ $t('post-checkout.reward-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ props.postCheckoutMetadata.reward }}
            </span>
          </div>
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              <icon
                class="post-checkout__icon"
                :name="$icons.informationCircle"
              />
              {{ $t('post-checkout.distribution-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ props.postCheckoutMetadata.distribution }}
            </span>
          </div>
        </div>
        <div class="post-checkout__buy">
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              {{ $t('post-checkout.current-price-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ props.postCheckoutMetadata.currentPrice }}
            </span>
          </div>
          <app-button class="post-checkout__buy-now-btn">
            {{ $t('post-checkout.buy-now-btn') }}
          </app-button>
          <div class="post-checkout__buy-description">
            {{ $t('post-checkout.buy-description-lbl') }}
          </div>
        </div>
      </app-block>
    </div>
    <app-block class="post-checkout__bottom">
      <div class="post-checkout__bottom-inner">
        <h2 class="post-checkout__bottom-title">
          {{ $t('post-checkout.title-txt') }}
        </h2>
        <line-chart
          class="post-checkout__chart"
          :chart-data="chartData"
          :get-formatter-text="props.formatterChartFunc"
        />
        <span class="post-checkout__bottom-description">
          {{ $t('post-checkout.description-txt') }}
        </span>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
.post-checkout {
  display: flex;
  flex-direction: column;
  letter-spacing: 0.1em;
}

.post-checkout__top {
  width: 100%;
  display: flex;
}

.post-checkout__top-inner {
  display: flex;
  width: 50%;
}

.post-checkout__about {
  padding: toRem(40) toRem(110);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: toRem(23);
}

.post-checkout__buy {
  padding: toRem(40) toRem(110);
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.post-checkout__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-checkout__key {
  display: flex;
  align-items: center;
  gap: toRem(10);
  font-size: toRem(14);
  font-weight: 700;
  color: var(--text-secondary-main);
}

.post-checkout__value {
  display: flex;
  align-items: center;
  gap: toRem(10);
  font-size: toRem(16);
  font-weight: 700;
  color: var(--text-primary-main);
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

.post-checkout__buy-now-btn {
  width: 100%;
  font-size: toRem(20);
}

.post-checkout__buy-description {
  color: var(--text-secondary-main);
  font-size: toRem(14);
  text-align: center;
  padding: 0 toRem(30);
}

.post-checkout__bottom-inner {
  padding: toRem(70) toRem(165);
  display: flex;
  flex-direction: column;
  gap: toRem(30);
}

.post-checkout__chart {
  max-width: 100%;
}

.post-checkout__bottom-title {
  font-size: toRem(36);
  font-weight: 900;
}

.post-checkout__bottom-description {
  font-size: toRem(20);
}
</style>
