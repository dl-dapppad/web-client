<script lang="ts" setup>
import { AppBlock, AppButton, PostCheckout } from '@/common'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import postsData from '@/assets/posts.json'
import { Post } from '@/types'

const route = useRoute()

const posts = postsData as unknown as Post[]

const router = useRouter()

const postId = computed(() => route.params.id)

const post = computed(() => posts.find(el => el.id === postId.value))

const startPrice = 5000
const minPrice = 100
const decreasePercent = 5
const salesCount = 120

const getPriceArr = (
  startPrice: number,
  minPrice: number,
  decreasePercent: number,
  salesCount: number,
) => {
  const result: number[] = []
  let currentPrice = startPrice
  for (let i = 0; i < salesCount; i++) {
    result.push(currentPrice)
    currentPrice *= 1 - decreasePercent / 100
    currentPrice = currentPrice < minPrice ? minPrice : currentPrice
  }
  return result
}

const formatterChartFunc = (sales: number, price: number) => {
  return `Count of sales: ${sales + 1}<br />Price: ${
    Math.round(price * 100) / 100
  }<br />Cashback: ${
    Math.round(price * postCheckoutMetadata.cashbackPercent) / 100
  }`
}

const postCheckoutMetadata = {
  currentNetwork: 'Ethereum',
  salesCount: 20,
  decreasePercent: 5,
  cashbackPercent: 10,
  implementation: '0xa12b9db875AFaf4BD6bAD815CabC7D8C15e1545c',
  factory: '0xa12b9db875AFaf4BD6bAD815CabC7D8C15e1545c',
  minPrice: '12 345.1234 ETH',
  reward: '12 345.1234 DAPP',
  distribution: '200.1234 USDT',
  currentPrice: '12 345.1234 USDT',
  chartData: getPriceArr(startPrice, minPrice, decreasePercent, salesCount),
  startPrice: 5000,
}
</script>

<template>
  <div class="post-item-page">
    <app-block class="post-item-page__banner-wrp">
      <div
        class="post-item-page__banner"
        :style="{ backgroundImage: `url(${post.bannerUrl})` }"
      >
        <div class="post-item-page__banner-title-wrp">
          <h1 class="post-item-page__banner-title">
            {{ post.title }}
          </h1>
          <app-button
            class="post-item-page__back-btn"
            :icon-left="$icons.arrowLeft"
            modification="border-circle"
            color="tertiary"
            @click="router.go(-1)"
          />
        </div>
      </div>
    </app-block>
    <post-checkout
      :post-checkout-metadata="postCheckoutMetadata"
      :formatter-chart-func="formatterChartFunc"
    />
    <app-block class="post-item-page__content-wrp">
      <div v-if="post" class="post-item-page__content">
        <template v-for="([key, value], idx) in post.content">
          <template v-if="key === 'title'">
            <h4 class="post-item-page__title" :key="idx">
              {{ value }}
            </h4>
          </template>
          <template v-if="key === 'title-accent'">
            <h4
              class="post-item-page__title post-item-page__title--accent"
              :key="idx"
            >
              {{ value }}
            </h4>
          </template>
          <template v-if="key === 'paragraph'">
            <p :key="idx">
              {{ value }}
            </p>
          </template>
          <template v-if="key === 'image'">
            <img :key="idx" class="post-item-page__img" :src="value" alt="" />
          </template>
        </template>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
$page-padding-left: toRem(165);
$page-padding-right: toRem(165);

.post-item-page {
  display: flex;
  flex-direction: column;
}

.post-item-page__banner {
  background-size: cover;
  background-position: center;
  min-height: toRem(200);
  padding: toRem(50) $page-padding-right toRem(60) $page-padding-left;
}

.post-item-page__banner-title-wrp {
  position: relative;
}

.post-item-page__banner-title {
  font-size: toRem(70);
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--text-primary-invert-main);
}

.post-item-page__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  right: calc(100% + #{toRem(56)});
  padding: 0;
}

.post-item-page__content-wrp {
  flex: 1;
}

.post-item-page__content {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
  padding: toRem(70) $page-padding-right toRem(40) $page-padding-left;

  p {
    font-size: toRem(20);
    line-height: 1.3;
    letter-spacing: 0.1em;
  }
}

.post-item-page__title {
  font-size: toRem(30);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-primary-main);

  &--accent {
    font-size: toRem(36);
    font-weight: 900;
  }
}

.post-item-page__img {
  max-width: 80%;
  height: auto;
  margin: 0 auto;
}
</style>
