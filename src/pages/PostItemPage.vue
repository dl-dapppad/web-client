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

const chartData = [
  5000, 4750, 4512.5, 4286.88, 4072.53, 3868.9, 3675.46, 3491.69, 3317.1,
  3151.25, 2993.68, 2844, 2701.8, 2566.71, 2438.37, 2316.46, 2200.63, 2090.6,
  1986.07, 1886.77, 1792.43, 1702.81, 1617.67, 1536.78, 1459.95, 1386.95,
  1317.6, 1251.72, 1189.13, 1129.68, 1073.19, 1019.53, 968.56, 920.13, 874.12,
  830.42, 788.9, 749.45, 711.98, 676.38, 642.56, 610.43, 579.91, 550.92, 523.37,
  497.2, 472.34, 448.72, 426.29, 404.97, 384.72, 365.49, 347.21, 329.85, 313.36,
  297.69, 282.81, 268.67, 255.23, 242.47, 230.35, 218.83, 207.89, 197.5, 187.62,
  178.24, 169.33, 160.86, 152.82, 145.18, 137.92, 131.02, 124.47, 118.25,
  112.34, 106.72, 101.38, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100, 100,
]

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
  chartData: chartData,
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
    <post-checkout :post-checkout-metadata="postCheckoutMetadata" />
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
