<script lang="ts" setup>
import { Post } from '@/types'

defineProps<{
  post: Post
}>()
</script>

<template>
  <div class="post-card">
    <img class="post-card__img" :src="post.imgUrl" :alt="post.title" />
    <h4 class="post-card__title">
      {{ post.title }}
    </h4>
    <p class="post-card__desc">
      {{ post.description }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.post-card {
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
</style>
