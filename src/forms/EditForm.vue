<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Erc20EditForm, Erc721EditForm } from '@/modules'
import { useRoute, useRouter } from '@/router'
import { Post } from '@/types'
import { PRODUCT_IDS, ROUTE_NAMES } from '@/enums'
import { useProduct } from '@/composables'
import postsData from '@/assets/posts.json'

const route = useRoute()
const router = useRouter()
const composableProduct = useProduct()

const posts = ref<Post[]>([])
const post = computed(() => {
  return posts.value.find(el => el.id === route.params.id)
})

const init = async () => {
  posts.value = postsData as unknown as Post[]

  const prouctType = await composableProduct.getProductTypeByAddress(
    route.params.contractAddress as string,
  )

  if (prouctType !== route.params.id) {
    router.push({ name: ROUTE_NAMES.notFound })
  }
}

init()
</script>

<template>
  <div class="edit-form">
    <template v-if="post?.id === PRODUCT_IDS.ERC20">
      <erc20-edit-form class="edit-form__module" />
    </template>
    <template v-if="post?.id === PRODUCT_IDS.ERC721">
      <erc721-edit-form class="edit-form__module" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.edit-form__module {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: toRem(990);
  padding: toRem(50) 0 toRem(30);
  margin: 0 auto;
  gap: toRem(70);
}
</style>
