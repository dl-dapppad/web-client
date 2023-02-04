<script lang="ts" setup>
import { ref, watch } from 'vue'
import { i18n } from '@/localization'
import { InfoTooltip, Icon, AppButton } from '@/common'
import { Post } from '@/types'

import postsData from '@/assets/posts.json'

const props = defineProps<{
  postId: string
  isShownOtherProducts?: boolean
}>()

const { t } = i18n.global

const posts = postsData as unknown as Post[]
const currentPost = ref<Post | undefined>()

const product = ref<string>('')
const productPosts = ref<Post[]>([])

const init = () => {
  currentPost.value = posts.find(el => el.id === (props.postId as string))

  product.value = currentPost.value?.id.split('-')[0] as string
  productPosts.value = posts.filter(post => post.id.includes(product.value))
}

init()

const erc20Checklist = [
  'owner',
  'approve',
  'transfer',
  'initial-mint',
  'mint',
  'burn',
  'cap',
]

const erc721Checklist = [
  'owner',
  'approve',
  'transfer',
  'set-base-u-r-i',
  'mint',
  'burn',
  'enum',
]

const checklist = ref<
  {
    id: string
    tooltip: string
    label: string
  }[]
>(
  (product.value === 'erc20' ? erc20Checklist : erc721Checklist).map(id => {
    return {
      id,
      tooltip: t(`product-card.${product.value}-${id}-tooltip`),
      label: t(`product-card.${product.value}-${id}-lbl`),
    }
  }),
)

const isShownOther = (id: string) => {
  return (
    props.isShownOtherProducts &&
    !currentPost.value?.checklist?.find(item => item[0] === id)?.[1] &&
    productPosts.value.filter(
      post => post?.checklist?.find(item => item[0] === id)?.[1],
    ).length !== 0
  )
}

watch(
  () => props.postId,
  () => init(),
)
</script>

<template>
  <div class="product-checklist app__metadata">
    <div
      class="product-checklist__row-wrp"
      v-for="(row, ind) in checklist"
      :key="ind"
    >
      <div class="app__metadata-row">
        <div class="app__metadata-lbl">
          <info-tooltip :text="row.tooltip" />
          {{ row.label }}
        </div>
        <div class="app__metadata-value">
          <icon
            class="product-checklist__icon"
            :class="
              currentPost?.checklist?.find(item => item[0] === row.id)?.[1]
                ? 'product-checklist__icon--true'
                : 'product-checklist__icon--false'
            "
            :name="
              currentPost?.checklist?.find(item => item[0] === row.id)?.[1]
                ? $icons.checkCircleFilled
                : $icons.xCircleFilled
            "
          />
        </div>
      </div>
      <div class="product-checklist__error" v-if="isShownOther(row.id)">
        {{ t(`product-card.${product}-not-found`) }}
        <div
          class="product-checklist__link-wrp"
          v-for="(post, idx) in productPosts.filter(
            post => post?.checklist.find(item => item[0] === row.id)[1],
          )"
          :key="post.id"
        >
          <app-button
            class="product-checklist__link"
            scheme="default"
            :text="post.title.split(' ').slice(1).join(' ')"
            :route="{
              name: $routes.product,
              params: { id: post.id },
            }"
          />
          <!-- eslint-disable -->
          <span
            v-if="
              idx !==
              productPosts.filter(
                post => post?.checklist.find(item => item[0] === row.id)[1],
              ).length -
                1
            "
          >
            <!-- eslint-enable -->
            {{ `,&nbsp;` }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-checklist {
  width: 100%;
}

.product-checklist__icon {
  max-width: toRem(20);
  max-height: toRem(20);
  min-width: toRem(20);
  min-height: toRem(20);

  &--true {
    color: var(--success-secondary-main);
  }

  &--false {
    color: var(--warning-main);
  }
}

.product-checklist__row-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(7);
}

.product-checklist__link-wrp {
  display: inline-block;
}

.product-checklist__link {
  display: inline-flex;
  padding: 0;
  font-weight: 400;
  color: var(--secondary-main);
  font-family: var(--app-font-family-primary);
  font-size: inherit;
}

.product-checklist__error {
  color: var(--text-secondary-main);
  font-size: toRem(12);
  padding-left: toRem(34);

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}
</style>
