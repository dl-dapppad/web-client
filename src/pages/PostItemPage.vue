<script lang="ts" setup>
import { Icon, AppBlock, AppButton, PostCheckout } from '@/common'
import { useRoute, useRouter } from '@/router'
import { Post } from '@/types'
import postsData from '@/assets/posts.json'

const route = useRoute()
const router = useRouter()

const posts = postsData as unknown as Post[]
const post = posts.find(el => el.id === route.params.id)
</script>

<template>
  <div class="post-item-page">
    <app-block class="post-item-page__banner-wrp">
      <div
        class="post-item-page__banner"
        :style="{ backgroundImage: `url(${post?.bannerUrl})` }"
      >
        <div class="post-item-page__banner-title-wrp">
          <h1 class="post-item-page__banner-title">
            {{ post?.title }}
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
    <post-checkout v-if="post" :post="post" />
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
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p :key="idx" class="post-item-page__paragarph" v-html="value" />
          </template>
          <template v-if="key === 'image'">
            <img :key="idx" class="post-item-page__img" :src="value" alt="" />
          </template>
          <template v-if="key === 'image-links'">
            <div :key="idx" class="post-item-page__img-links">
              <a
                v-for="(link, ind) of value"
                :key="ind"
                class="post-item-page__img-links-item"
                :href="`https://${link}/`"
              >
                {{ link }}
                <icon
                  class="post-item-page__img-links-icon"
                  :name="$icons.externalLink"
                />
              </a>
            </div>
          </template>
          <template v-if="key === 'unordered-list'">
            <ul :key="idx" class="post-item-page__unordered-list">
              <li
                v-for="(item, ind) of value"
                :key="ind"
                class="post-item-page__unordered-list-item"
              >
                <icon
                  class="post-item-page__unordered-list-icon"
                  :name="$icons.circleFilled"
                />
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p class="post-item-page__unordered-list-text" v-html="item" />
              </li>
            </ul>
          </template>
        </template>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss">
/* stylelint-disable declaration-no-important */
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
}

.post-item-page__bold {
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
  font-weight: 700;
}

.post-item-page__consolas {
  font-family: var(--app-font-family-tertiary);
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
  font-weight: 700;
}

.post-item-page__paragarph {
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
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

.post-item-page__img-links {
  display: flex;
  justify-content: center;
  gap: toRem(35);
}

.post-item-page__img-links-item {
  display: flex;
  align-items: center;
  gap: toRem(10);
  color: var(--secondary-main);
  font-size: toRem(16);
}

.post-item-page__img-links-icon {
  color: var(--text-primary-main);
  max-width: toRem(12) !important;
  max-height: toRem(12) !important;
  min-width: toRem(12);
  min-height: toRem(12);
}

.post-item-page__unordered-list {
  padding-left: toRem(30);
}

.post-item-page__unordered-list-item {
  display: flex;
  align-items: center;
  position: relative;
}

.post-item-page__unordered-list-text {
  font-size: toRem(20);
  line-height: toRem(26);
}

.post-item-page__unordered-list-icon {
  max-width: toRem(3) !important;
  max-height: toRem(3) !important;
  min-width: toRem(3);
  min-height: toRem(3);
  position: absolute;
  top: toRem(11);
  left: -#{toRem(16)};
}
</style>
