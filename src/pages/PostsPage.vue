<script lang="ts" setup>
import { AppBlock, AppButton, PostCard } from '@/common'
import { Post } from '@/types'

const bannerInfo = {
  title: 'Tokens',
  description:
    'SHORT DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  imageUrl:
    'https://images.unsplash.com/photo-1666433723497-38d1d053185b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
}

const posts: Post[] = [
  {
    id: '1',
    title: 'ERC20',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
    imgUrl:
      'https://images.unsplash.com/photo-1666433723497-38d1d053185b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: '2',
    title: 'ERC721',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
    imgUrl:
      'https://images.unsplash.com/photo-1666433723497-38d1d053185b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
]
</script>

<template>
  <div class="posts-page">
    <app-block class="posts-page__banner-wrp">
      <div class="posts-page__banner">
        <div class="posts-page__banner-title-wrp">
          <h2 class="posts-page__banner-title">
            {{ bannerInfo.title }}
          </h2>
          <app-button
            class="posts-page__back-btn"
            :icon-right="$icons.arrowLeft"
            modification="border-circle"
            color="tertiary"
          />
        </div>
        <p class="posts-page__banner-desc">
          {{ bannerInfo.description }}
        </p>
        <app-button
          class="posts-page__banner-show-more-btn"
          color="tertiary"
          size="small"
          :text="$t('posts-page.show-more-btn')"
        />
        <img
          class="posts-page__banner-img"
          :src="bannerInfo.imageUrl"
          :alt="bannerInfo.title"
        />
      </div>
    </app-block>
    <app-block v-for="post in posts" :key="post.id" class="posts-page__card">
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
