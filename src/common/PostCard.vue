<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { Icon } from '@/common'
import { Post } from '@/types'
import { ROUTE_NAMES } from '@/enums'
import { config } from '@/config'
import { ErrorHandler, isChainAvailable, formatAmount } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { useErc20, useFarming, useProductFactory, Product } from '@/composables'

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
const nextRouteName =
  props.post.type === 'category'
    ? subPostsCount.value
      ? ROUTE_NAMES.categories
      : ROUTE_NAMES.category
    : ROUTE_NAMES.product

const init = async () => {
  if (!provider.value.chainId || !isChainAvailable(provider.value.chainId))
    return

  try {
    alias.value = config.PRODUCT_ALIASES[props.post.id as string]
    if (!alias.value) return

    await Promise.all([
      farming.loadDetails(),
      factory.products(alias.value),
    ]).then(res => {
      product.value = res[1]
      return
    })

    paymentToken.init(farming.rewardToken.value)
    await paymentToken.loadDetails()
  } catch (error) {
    ErrorHandler.process(error)
  }
}

init()
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
      <icon class="post-card__subcategories-icon" :name="$icons.folder" />
      {{ `${subPostsCount} ${$t('post-card.subcategories-lbl')}` }}
    </p>
    <div v-else class="post-card__price">
      <div class="post-card__price-icon-wrp">
        <icon class="post-card__price-icon" :name="$icons.tag" />
        {{ $t('post-card.price-lbl') }}
      </div>
      <div class="post-card__price-lbl-wrp">
        <span class="app__price app__price--big">
          {{
            formatAmount(
              product.currentPrice,
              paymentToken?.decimals.value ?? '0',
            )
          }}
          <span class="app__price-asset">
            {{ paymentToken?.symbol.value }}
          </span>
        </span>
      </div>
    </div>
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
  justify-content: space-between;
  padding: toRem(20);
  height: 100%;
}

.post-card__img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  max-height: clamp(#{toRem(200)}, 25vw, #{toRem(350)});
  min-height: clamp(#{toRem(200)}, 25vw, #{toRem(350)});
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
  display: flex;
  align-items: center;
  gap: toRem(14);
  padding-top: toRem(25);
  font-weight: 700;
}

.post-card__price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: toRem(25);
  font-weight: 700;
}

.post-card__price-icon-wrp {
  display: flex;
  align-items: center;
  gap: toRem(14);
}

.post-card__subcategories-icon,
.post-card__price-icon {
  max-width: toRem(14);
  max-height: toRem(14);
}

.post-card__price-lbl-wrp {
  display: flex;
  align-items: end;
  gap: toRem(6);
}

.post-card__price-lbl {
  &--small {
    font-size: toRem(12);
  }
}

.post-card__link {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
