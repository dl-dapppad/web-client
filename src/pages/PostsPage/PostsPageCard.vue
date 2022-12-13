<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { Icon, Loader } from '@/common'
import { Post } from '@/types'
import { ROUTE_NAMES } from '@/enums'
import { config } from '@/config'
import { ErrorHandler, formatAmount } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { useErc20, useFarming, useProductFactory, Product } from '@/composables'

const web3Store = useWeb3ProvidersStore()
const { provider } = storeToRefs(useWeb3ProvidersStore())

const paymentToken = useErc20()
const factory = useProductFactory()
const farming = useFarming()

const alias = ref('')
const product = ref<Product>(factory.getEmptyProduct())

const props = defineProps<{
  post: Post
}>()

const subPostsCount = computed(() => props.post.subPosts.length)

const postCardRoute = computed(() => {
  const routeName = {
    category: subPostsCount.value
      ? ROUTE_NAMES.categories
      : ROUTE_NAMES.category,
    product: ROUTE_NAMES.product,
  }[props.post.type]

  return {
    name: routeName,
    params: {
      id: props.post.id,
    },
  }
})

const init = async () => {
  if (!provider.value.chainId || !web3Store.isCurrentChainAvailable) return

  try {
    alias.value = config.PRODUCT_ALIASES[props.post.id as string]
    if (!alias.value) return

    const [, productDetails] = await Promise.all([
      farming.loadDetails(),
      factory.products(alias.value),
    ])

    product.value = productDetails

    paymentToken.init(farming.rewardToken.value)
    await paymentToken.loadDetails()
  } catch (error) {
    ErrorHandler.process(error)
  }
}

init()
</script>

<template>
  <div class="posts-page-card">
    <img class="posts-page-card__img" :src="post.imageUrl" :alt="post.title" />
    <h4 class="posts-page-card__title">
      {{ post.title }}
    </h4>
    <p class="posts-page-card__desc">
      {{ post.description }}
    </p>
    <p v-if="subPostsCount" class="posts-page-card__subcategories">
      <icon class="posts-page-card__subcategories-icon" :name="$icons.folder" />
      {{
        $t('posts-page-card.subcategories-lbl', {
          amount: subPostsCount,
        })
      }}
    </p>
    <div v-else class="posts-page-card__price">
      <div class="posts-page-card__price-icon-wrp">
        <icon class="posts-page-card__price-icon" :name="$icons.tag" />
        {{ $t('posts-page-card.price-lbl') }}
      </div>
      <div class="posts-page-card__price-lbl-wrp">
        <span
          v-if="paymentToken?.decimals.value"
          class="app__price app__price--big"
        >
          {{ formatAmount(product.currentPrice, paymentToken?.decimals.value) }}
          <span class="app__price-asset">
            {{ paymentToken?.symbol.value }}
          </span>
        </span>
        <loader v-else />
      </div>
    </div>
    <router-link class="posts-page-card__link" :to="postCardRoute" />
  </div>
</template>

<style lang="scss" scoped>
.posts-page-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: toRem(20);
  height: 100%;
}

.posts-page-card__img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  max-height: clamp(#{toRem(200)}, 25vw, #{toRem(350)});
  min-height: clamp(#{toRem(200)}, 25vw, #{toRem(350)});
}

.posts-page-card__title {
  font-size: toRem(24);
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin: toRem(20) 0 toRem(10);
}

.posts-page-card__desc {
  font-size: toRem(14);
  line-height: 1.3;
  letter-spacing: 0.1em;
}

.posts-page-card__subcategories {
  display: flex;
  align-items: center;
  gap: toRem(14);
  padding-top: toRem(25);
  font-weight: 700;
}

.posts-page-card__price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: toRem(25);
  font-weight: 700;
}

.posts-page-card__price-icon-wrp {
  display: flex;
  align-items: center;
  gap: toRem(14);
}

.posts-page-card__subcategories-icon,
.posts-page-card__price-icon {
  max-width: toRem(14);
  max-height: toRem(14);
}

.posts-page-card__price-lbl-wrp {
  display: flex;
  justify-content: end;
  gap: toRem(6);
  min-width: toRem(150);
}

.posts-page-card__price-lbl {
  &--small {
    font-size: toRem(12);
  }
}

.posts-page-card__link {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
