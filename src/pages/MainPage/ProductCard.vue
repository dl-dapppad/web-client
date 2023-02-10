<script lang="ts" setup>
import { ref, watch } from 'vue'

import { Icon, ProductChecklist, AppButton, Loader, GasFee } from '@/common'
import { Product } from '@/composables'
import { Post } from '@/types'
import { formatAmount, ErrorHandler } from '@/helpers'
import { useContractsStore } from '@/store'
import { config } from '@/config'

import postsData from '@/assets/posts.json'

const props = defineProps<{
  data: {
    id: string
    imgPosition: string
  }
  isShownProductsInCard?: boolean
}>()

const posts = postsData as unknown as Post[]
const post = posts.find(el => el.id === props.data.id)

const img = `/images/${props.data.id.split('-')[0]}.png`

const contracts = useContractsStore()

const product = ref<Product>(contracts.factory.getEmptyProduct())
const alias = ref('')
const isProductLoaded = ref(false)

const init = async () => {
  if (!contracts.loaded) return

  try {
    alias.value = config.PRODUCT_ALIASES[props.data.id as string]
    if (!alias.value) return

    product.value = await contracts.factory.products(alias.value)
    isProductLoaded.value = true
  } catch (error) {
    ErrorHandler.process(error)
  }
}

watch(() => contracts.loaded, init)

init()
</script>

<template>
  <div class="product-card">
    <!-- eslint-disable max-len -->
    <div
      class="product-card__banner"
      :style="`background-image: url(${img}); background-position: ${data.imgPosition}`"
    >
      <!-- eslint-enable max-len -->
      <h4 class="product-card__title">
        {{ post?.title }}
      </h4>
    </div>
    <product-checklist
      :post-id="data.id"
      :is-shown-other-products="isShownProductsInCard"
    />
    <div class="product-card__bottom-section">
      <div class="product-card__price-wrp">
        <div class="product-card__price-lbl">
          <icon class="product-card__price-icon" :name="$icons.tag" />
          <span class="product-card__price-txt">
            {{ $t('product-card.current-price') }}
          </span>
        </div>
        <div class="product-card__price">
          <div v-if="isProductLoaded" class="product-card__price-value">
            {{ formatAmount(product.currentPrice) }}
            <span class="product-card__price-curr">
              {{ contracts.pointToken.symbol }}
            </span>
          </div>
          <loader v-else class="product-card__price-loader" />
          <div v-if="isProductLoaded" class="product-card__price-gas">
            <gas-fee :id="props.data.id" />
          </div>
          <loader v-else class="product-card__price-loader" />
        </div>
      </div>
      <div class="product-card__buttons">
        <app-button
          :text="$t('product-card.more-info')"
          :size="'large'"
          :color="'tertiary'"
          :route="{
            name: $routes.product,
            params: { id: data.id },
          }"
          class="product-card__btn"
        />
        <app-button
          :text="$t('product-card.deploy')"
          :size="'large'"
          :route="{
            name: $routes.productDeploy,
            params: { id: data.id },
          }"
          class="product-card__btn"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-card {
  height: 100%;
  padding: toRem(20);
  display: flex;
  flex-direction: column;
  gap: toRem(37);
}

.product-card__banner {
  display: flex;
  align-items: center;
  padding: toRem(20);
  min-height: toRem(145);
  max-height: toRem(145);
  border-radius: toRem(6);

  @include respond-to(medium) {
    background-size: cover;
  }
}

.product-card__title {
  color: var(--text-primary-invert-main);
  font-family: var(--app-font-family-secondary);
  font-size: toRem(30);
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.1em;

  @include respond-to(medium) {
    font-size: toRem(24);
  }
}

.product-card__bottom-section {
  display: flex;
  flex-direction: column;
  justify-content: end;
  flex-basis: 100%;
  gap: toRem(37);
}

.product-card__price-wrp {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.product-card__price-lbl {
  display: flex;
  align-items: center;
  gap: toRem(12);
}

.product-card__price-icon {
  max-width: toRem(14);
  max-height: toRem(14);
  min-width: toRem(14);
  min-height: toRem(14);
}

.product-card__price-txt {
  line-height: toRem(24);
  font-size: toRem(20);
  font-weight: 700;
  font-family: var(--app-font-family-secondary);

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.product-card__price {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: toRem(4);
}

.product-card__price-value {
  font-size: toRem(24);
  font-weight: 700;
  font-family: var(--app-font-family-secondary);
  color: var(--secondary-main);

  @include respond-to(medium) {
    font-size: toRem(20);
  }
}

.product-card__price-curr {
  font-size: 0.5em;
  font-family: var(--app-font-family-primary);
}

.product-card__price-gas {
  font-size: toRem(12);
}

.product-card__buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(20);

  @include respond-to(small) {
    grid-template-columns: 1fr;
  }
}

.product-card__btn {
  width: 100%;
  padding: toRem(14);
}

.product-card__price-loader {
  min-width: toRem(120);
  min-height: toRem(18);
}
</style>
