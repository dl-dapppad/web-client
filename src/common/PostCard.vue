<script lang="ts" setup>
import { computed } from 'vue'
import { Post } from '@/types'
import { ROUTE_NAMES } from '@/enums'

const props = defineProps<{
  post: Post
}>()

const subPostsCount = computed(() => props.post.subPosts.length)
const nextRouteName =
  props.post.type === 'category'
    ? subPostsCount.value
      ? ROUTE_NAMES.categories
      : ROUTE_NAMES.category
    : ROUTE_NAMES.product
</script>

<template>
  <div class="post-card">
    <button></button>
    <img class="post-card__img" :src="post.imageUrl" :alt="post.title" />
    <h4 class="post-card__title">
      {{ post.title }}
    </h4>
    <p class="post-card__desc">
      {{ post.description }}
    </p>
    <p v-if="subPostsCount" class="post-card__subcategories">
      {{ `${subPostsCount} SubCategories` }}
    </p>
    <router-link
      class="post-card__link"
      :to="{
        name: nextRouteName,
        params: { id: post.id },
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.post-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: toRem(20);
}

.post-card__img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  max-height: clamp(#{toRem(200)}, 25vw, #{toRem(350)});
}

.post-card__title {
  font-size: toRem(24);
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin: toRem(20) 0 toRem(10);
}

.post-card__desc {
  font-size: toRem(14);
  line-height: 1.3;
  letter-spacing: 0.1em;
}

.post-card__subcategories {
  font-weight: 700;
}

.post-card__link {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
