<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from '@/router'
import postsData from '@/assets/posts.json'
import { Post } from '@/types'
import { Erc20DeployForm } from '@/modules'

const route = useRoute()

const posts = postsData as unknown as Post[]

const router = useRouter()

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
  width: 100%;
  height: 100%;
}
</style>
