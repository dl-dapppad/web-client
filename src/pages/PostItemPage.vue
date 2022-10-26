<script lang="ts" setup>
import { AppBlock, AppButton, PostCheckout } from '@/common'
import { useRoute, useRouter } from '@/router'
import { computed } from 'vue'
import postsData from '@/assets/posts.json'
import { Post } from '@/types'

const route = useRoute()

const posts = postsData as unknown as Post[]

const router = useRouter()

const postId = computed(() => route.params.id)

const post = computed(() => posts.find(el => el.id === postId.value))
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
    <post-checkout />
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
