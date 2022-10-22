<script lang="ts" setup>
import { AppBlock, AppButton, PostCard } from '@/common'
import postsData from '@/assets/posts.json'
import { useRouter } from 'vue-router'
import { Post } from '@/types'
import { onMounted, ref } from 'vue'
import { animate } from 'motion'

const bannerDescription = ref<HTMLParagraphElement | null>(null)
const defaultBannerDescriptionHeight = ref(0)

const isBannerDescShown = ref(false)

const posts = postsData as Post[]

const router = useRouter()

onMounted(() => {
  if (!bannerDescription.value) return

  defaultBannerDescriptionHeight.value = bannerDescription.value.clientHeight

  animate(bannerDescription.value, {
    height: '120px',
  })
})

const handleShowMore = () => {
  if (!bannerDescription.value) return

  animate(bannerDescription.value, {
    height: isBannerDescShown.value
      ? '120px'
      : `${defaultBannerDescriptionHeight.value}px`,
  })

  isBannerDescShown.value = !isBannerDescShown.value
}
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
        <p ref="bannerDescription" class="posts-page__banner-desc">
          {{ posts[0].description }}
        </p>
        <app-button
          class="posts-page__banner-show-more-btn"
          color="tertiary"
          size="small"
          :text="
            isBannerDescShown
              ? $t('posts-page.show-less-btn')
              : $t('posts-page.show-more-btn')
          "
          @click="handleShowMore"
        />
        <div class="posts-page__banner-img-wrp">
          <img
            class="posts-page__banner-img"
            :src="posts[0].imageUrl"
            :alt="posts[0].title"
          />
        </div>
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
  width: 100%;
  height: 100%;
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
  overflow: hidden;
  grid-column: 1 / 2;
  margin: toRem(30) 0 toRem(20);
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
  transition: height 0.35s ease-in-out;
}

.posts-page__banner-show-more-btn {
  align-self: center;
  grid-column: 1 / 2;
}

.posts-page__banner-img-wrp {
  position: relative;
  grid-column: 2 / 3;
  grid-row: 1 / -1;
}

.posts-page__banner-img {
  object-fit: cover;
  object-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-height: toRem(450);
  grid-column: 2 / 3;
  grid-row: 1 / -1;
}
</style>
