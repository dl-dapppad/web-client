<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from '@/router'
import { AppBlock, AppButton } from '@/common'
import { Post } from '@/types'
import { ErrorHandler } from '@/helpers'
import PostsPageCard from '@/pages/PostsPage/PostsPageCard.vue'
import Loader from '@/common/Loader.vue'
import ErrorMessage from '@/common/ErrorMessage.vue'
import NoDataMessage from '@/common/NoDataMessage.vue'
import { postsBackMap } from '@/assets/postsStructure'

const route = useRoute()
const router = useRouter()

const isLoaded = ref(false)
const isLoadFailed = ref(false)

const bannerDescription = ref<HTMLParagraphElement | null>(null)

const posts = ref<Post[]>([])

const currentPost = computed(() => {
  return posts.value.find(el => el.id === route.params.id)
})

const subPosts = computed<Post[]>(() => {
  if (!currentPost.value?.subPosts.length) return []

  return (
    posts.value.reduce<Post[]>((acc, curr) => {
      return currentPost.value?.subPosts.includes(curr.id)
        ? [...acc, curr]
        : [...acc]
    }, []) || []
  )
})

const handleBackBtn = () => {
  router.push(postsBackMap[route.params.id])
}

const loadPosts = async () => {
  try {
    const fetchPosts = () => import('@/assets/posts.json')

    posts.value = (await fetchPosts()).default as Post[]
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

loadPosts()
</script>

<template>
  <div class="posts-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('posts-page.loading-error-msg')" />
      </template>
      <template v-else-if="posts.length">
        <app-block class="posts-page__banner-wrp">
          <div class="posts-page__banner">
            <div class="posts-page__banner-text-wrp">
              <div class="posts-page__banner-title-wrp">
                <h2 class="posts-page__banner-title">
                  {{ currentPost.title }}
                </h2>
                <app-button
                  class="posts-page__back-btn"
                  :icon-right="$icons.arrowLeft"
                  modification="border-circle"
                  color="tertiary"
                  @click="handleBackBtn"
                />
              </div>
              <p ref="bannerDescription" class="posts-page__banner-desc">
                {{ currentPost?.description }}
              </p>
              <app-button
                class="posts-page__banner-show-more-btn"
                color="tertiary"
                size="small"
                :text="$t('posts-page.show-more-btn')"
                :route="{
                  name: $routes.category,
                  params: { id: currentPost.id },
                }"
              />
            </div>
            <div class="posts-page__banner-img-wrp">
              <img
                class="posts-page__banner-img"
                :src="currentPost?.imageUrl"
                :alt="currentPost?.title"
              />
            </div>
          </div>
        </app-block>
        <app-block
          v-for="(subPost, idx) in subPosts"
          :key="idx"
          class="posts-page__card"
        >
          <posts-page-card :post="subPost" />
        </app-block>
      </template>
      <template v-else>
        <no-data-message :message="$t('posts-page.no-data-msg')" />
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<style lang="scss" scoped>
$back-btn-z: 1;

.posts-page {
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > div {
    &:first-child {
      grid-column: 1 / -1;
    }
  }

  @include respond-to(medium) {
    grid-template-columns: 1fr;
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

  @include respond-to(medium) {
    display: flex;
    flex-direction: column-reverse;
    padding: toRem(30) toRem(20);
    gap: toRem(20);
  }
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

  @include respond-to(medium) {
    font-size: toRem(36);
  }
}

.posts-page__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  right: calc(100% + #{toRem(56)});
  padding: 0;

  @include respond-to(medium) {
    top: calc(-#{toRem(170)});
    left: -#{toRem(15)};
    z-index: $back-btn-z;
  }
}

.posts-page__banner-desc {
  grid-column: 1 / 2;
  margin: toRem(30) 0 toRem(20);
  font-size: toRem(20);
  line-height: 1.3;
  letter-spacing: 0.1em;
  transition: height 0.35s ease-in-out;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.posts-page__banner-show-more-btn {
  align-self: center;
  grid-column: 1 / 2;

  @include respond-to(medium) {
    width: 100%;
  }
}

.posts-page__banner-img-wrp {
  position: relative;
  grid-column: 2 / 3;
  grid-row: 1 / -1;

  @include respond-to(medium) {
    width: 100%;
    min-height: toRem(160);
  }
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
