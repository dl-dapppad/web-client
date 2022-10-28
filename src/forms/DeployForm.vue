<script lang="ts" setup>
import { Erc20DeployForm } from '@/modules'

import postsData from '@/assets/posts.json'

import { computed } from 'vue'
import { useRoute } from '@/router'
import { Post } from '@/types'

const route = useRoute()

const posts = postsData as unknown as Post[]

const postId = computed(() => route.params.id)

const post = computed(() => posts.find(el => el.id === postId.value))
</script>

<template>
  <div class="deploy-form">
    <template v-if="post?.module === 'ERC20'">
      <erc20-deploy-form class="deploy-form__module" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.deploy-form__module {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: toRem(990);
  padding: toRem(50) 0 toRem(30);
  margin: 0 auto;
}
</style>
