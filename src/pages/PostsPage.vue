<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { animate } from 'motion'
import { useRoute, useRouter } from '@/router'
import { AppBlock, AppButton, PostCard } from '@/common'
import { Post } from '@/types'
import { ROUTE_NAMES } from '@/enums'
import postsData from '@/assets/posts.json'

const route = useRoute()
const router = useRouter()

const bannerDescription = ref<HTMLParagraphElement | null>(null)
const defaultBannerDescriptionHeight = ref(0)

const postsAll = postsData as Post[]
const post = ref<Post>()
const subPosts = ref<Post[]>([])

const updatePosts = (routeId: string) => {
  subPosts.value = []
  post.value = postsAll.find(post => routeId === post.id)

  if (!post.value) return

  post.value.subPosts.forEach(id => {
    const subPost = postsAll.find(post => id === post.id)
    if (subPost) subPosts.value.push(subPost)
  })
}

onMounted(() => {
  if (!bannerDescription.value) return

  defaultBannerDescriptionHeight.value = bannerDescription.value.clientHeight

  animate(bannerDescription.value, {
    height: '120px',
  })
})

const handleShowMore = () => {
  router.push({ name: ROUTE_NAMES.category, params: { id: post.value?.id } })
}

watch(
  () => route.params.id,
  id => {
    updatePosts(id as string)
  },
)

updatePosts(route.params.id as string)
</script>

<template>
  <div class="posts-page">
    <app-block class="posts-page__banner-wrp">
      <div class="posts-page__banner">
        <div class="posts-page__banner-title-wrp">
          <h2 class="posts-page__banner-title">
            {{ post?.title }}
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
          {{ post?.description }}
        </p>
        <app-button
          class="posts-page__banner-show-more-btn"
          color="tertiary"
          size="small"
          :text="$t('posts-page.show-more-btn')"
          @click="handleShowMore"
        />
        <div class="posts-page__banner-img-wrp">
          <img
            class="posts-page__banner-img"
            :src="post?.imageUrl"
            :alt="post?.title"
          />
        </div>
      </div>
    </app-block>
    <app-block
      v-for="subPost in subPosts"
      :key="subPost.id"
      class="posts-page__card"
    >
      <post-card :post="subPost" />
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
