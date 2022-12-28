<script lang="ts" setup>
import { AppBlock, AppButton, ContentRender } from '@/common'
import { useRoute, useRouter } from '@/router'
import { Post } from '@/types'
import { ROUTE_NAMES } from '@/enums'
import { routeBackMap } from '@/router/route-back-map'

import PostItemPageCheckout from '@/pages/PostItemPage/PostItemPageCheckout.vue'
import PostItemPageHistory from '@/pages/PostItemPage/PostItemPageHistory.vue'
import postsData from '@/assets/posts.json'

const route = useRoute()
const router = useRouter()

const posts = postsData as unknown as Post[]
const post = posts.find(el => el.id === route.params.id)

const handleBackBtn = () => {
  if (route.name === ROUTE_NAMES.category)
    router.push({
      name: ROUTE_NAMES.categories,
      params: {
        id: route.params.id,
      },
    })
  else router.push(routeBackMap[route.params.id as string])
}
</script>

<template>
  <div class="post-item-page">
    <app-block class="post-item-page__banner-wrp">
      <div
        class="post-item-page__banner"
        :style="{ backgroundImage: `url(${post?.bannerUrl})` }"
      >
        <div class="post-item-page__banner-darker">
          <div class="post-item-page__banner-title-wrp">
            <h1 class="post-item-page__banner-title">
              {{ post?.title }}
            </h1>
            <app-button
              class="post-item-page__back-btn"
              :icon-left="$icons.arrowLeft"
              modification="border-circle"
              color="tertiary"
              @click="handleBackBtn"
            />
          </div>
        </div>
      </div>
    </app-block>
    <post-item-page-checkout v-if="post" :post="post" />
    <app-block
      class="post-item-page__content-wrp"
      v-if="post?.subPosts.length === 0"
    >
      <div class="post-item-page__content">
        <post-item-page-history />
      </div>
    </app-block>
    <app-block class="post-item-page__content-wrp">
      <div class="post-item-page__content">
        <content-render :content="(post?.content as Post['content'])" />
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
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
  border-radius: toRem(12);
}

.post-item-page__banner-darker {
  padding: toRem(50) $page-padding-right toRem(60) $page-padding-left;
  background: linear-gradient(
    90deg,
    rgba(236, 234, 245, 0.5) 0%,
    rgba(50, 49, 52, 0.5) 10.42%,
    rgba(0, 0, 0, 0.5) 88.02%,
    rgba(236, 234, 245, 0.5) 100%
  );
  border-radius: toRem(12);
  overflow: hidden;

  @include respond-to(medium) {
    padding: toRem(30) toRem(0) toRem(30) toRem(74);
  }
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

  @include respond-to(medium) {
    font-size: toRem(36);
  }
}

.post-item-page__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  right: calc(100% + #{toRem(56)});
  padding: 0;

  @include respond-to(medium) {
    left: -#{toRem(64)};
  }
}

.post-item-page__content-wrp {
  flex: 1;
}

.post-item-page__content {
  padding: toRem(70) $page-padding-right toRem(40) $page-padding-left;

  @include respond-to(medium) {
    padding: toRem(30) toRem(20);
  }
}
</style>
