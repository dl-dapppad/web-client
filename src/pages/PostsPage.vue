<script lang="ts" setup>
import { AppBlock, AppButton, PostCard } from '@/common'
import { Post } from '@/types'
import postsData from '@/assets/posts.json'
import { useRouter } from 'vue-router'

const posts = postsData as Post[]

const router = useRouter()
</script>

<template>
  <div class="posts-page">
    <app-block class="posts-page__banner-wrp">
      <div class="posts-page__banner">
        <div class="posts-page__banner-title-wrp">
          <h2 class="posts-page__banner-title">
            {{ posts[0].title }}
          </h2>
          <app-button
            class="posts-page__back-btn"
            :icon-right="$icons.arrowLeft"
            modification="border-circle"
            color="tertiary"
            @click="router.go(-1)"
          />
        </div>
        <p class="posts-page__banner-desc">
          {{ posts[0].description }}
        </p>
        <app-button
          class="posts-page__banner-show-more-btn"
          color="tertiary"
          size="small"
          :text="$t('posts-page.show-more-btn')"
        />
        <img
          class="posts-page__banner-img"
          :src="posts[0].imageUrl"
          :alt="posts[0].title"
        />
      </div>
    </app-block>
    <app-block
      v-for="post in posts.slice(1)"
      :key="post.id"
      class="posts-page__card"
    >
      <post-card :post="post" />
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
.posts-page {
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > div {
    &:first-child {
      grid-column: 1 / -1;
    }
  }
}

.posts-page__banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, max-content);
  grid-column-gap: toRem(56);
  padding: toRem(50) toRem(56) toRem(56) toRem(165);
}

.posts-page__banner-title-wrp {
  position: relative;
}

.posts-page__banner-title {
  grid-column: 1 / 2;
  font-weight: 900;
  font-size: toRem(70);
  line-height: 1.2;
  letter-spacing: 0.1em;
}

.posts-page__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  right: calc(100% + #{toRem(56)});
  padding: 0;
}

.posts-page__banner-desc {
  grid-column: 1 / 2;
  margin: toRem(30) 0 toRem(20);
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
}

.posts-page__banner-show-more-btn {
  align-self: center;
  grid-column: 1 / 2;
}

.posts-page__banner-img {
  object-fit: cover;
  object-position: center;
  grid-column: 2 / 3;
  grid-row: 1 / -1;
  width: 100%;
  height: auto;
  max-height: 100%;
}
</style>
