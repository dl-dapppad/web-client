<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import { useContractsStore } from '@/store'
import { useApollo, ApolloDeployedProducts } from '@/composables'
import { AppPagination, AddressCopy, Loader, AppButton } from '@/common'
import { config } from '@/config'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { formatAmount, formatDMYTime } from '@/helpers'

enum EMITS {
  updateHistoryState = 'update-history-state',
}

const emits = defineEmits<{
  (e: EMITS.updateHistoryState, value: boolean): void
}>()

type History = {
  data: ApolloDeployedProducts | undefined
  loaded: boolean
  showed: boolean
}

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'product-history.title': 'History of buying',
      'product-history.buyer-address': 'Buyer address',
      'product-history.product-address': 'Product address',
      'product-history.time': 'Time',
      'product-history.distributed': 'Distributed',
      'product-history.price': 'Price',
      'product-history.not-found': 'History of buying is empty. Be the first!',
    },
  },
})

const contracts = useContractsStore()

const { width: windowWidth } = useWindowSize()

const route = useRoute()
const apollo = useApollo()

const width = computed(() => {
  if (windowWidth.value < WINDOW_BREAKPOINTS.small)
    return windowWidth.value - 100
  else if (windowWidth.value < WINDOW_BREAKPOINTS.medium)
    return windowWidth.value - 130
  return windowWidth.value - 412
})
const alias = computed(() => config.PRODUCT_ALIASES[route.params.id as string])
const history = ref<History>({
  data: undefined,
  loaded: false,
  showed: false,
})
const pagination = ref({
  currentPage: 1,
  showOnPage: 5,
  totalPages: 0,
})

const init = () => {
  if (!alias.value || !contracts.loaded) return

  history.value.loaded = false
  emits(EMITS.updateHistoryState, history.value.loaded)

  apollo.getDeployedProducts(
    alias.value,
    pagination.value.showOnPage,
    (pagination.value.currentPage - 1) * pagination.value.showOnPage,
  )
}

const handlePaginationChange = (page: number) => {
  pagination.value.currentPage = page
  init()
}

watch(apollo.deployedProducts, () => {
  if (!apollo.deployedProducts.value.products?.length) {
    history.value.showed = false
  } else {
    history.value.data = apollo.deployedProducts.value
    history.value.showed = true

    pagination.value.totalPages = Math.ceil(
      history.value.data.totalCount / pagination.value.showOnPage,
    )
  }

  history.value.loaded = true
  emits(EMITS.updateHistoryState, history.value.loaded)
})

watch(() => [route.params.id, contracts.loaded], init)

init()
</script>

<template>
  <div class="product-history">
    <h2 class="product-history__title">
      {{ t('product-history.title') }}
    </h2>
    <template v-if="history.loaded">
      <div
        class="product-history__grid"
        :style="{
          width: `${width}px`,
        }"
      >
        <template v-if="history.showed">
          <div
            class="product-history__grid-row product-history__grid-row--titled"
          >
            <span class="product-history__grid-row-value">
              {{ t('product-history.buyer-address') }}
            </span>
            <span class="product-history__grid-row-value">
              {{ t('product-history.product-address') }}
            </span>
            <span class="product-history__grid-row-value">
              {{ t('product-history.price') }}
            </span>
            <!-- <span class="product-history__grid-row-value">
              {{ t('product-history.distributed') }}
            </span> -->
            <span class="product-history__grid-row-value">
              {{ t('product-history.time') }}
            </span>
          </div>
          <div
            v-for="(row, i) of history.data?.products"
            :key="i"
            class="product-history__grid-row"
          >
            <span class="product-history__grid-row-value">
              <address-copy
                :address="row.user?.address ?? ''"
                class="app__link--accented"
              />
            </span>
            <span class="product-history__grid-row-value">
              <address-copy
                :address="row.proxy ?? ''"
                class="app__link--accented"
              />
            </span>
            <span class="product-history__grid-row-value">
              {{
                formatAmount(row.price ?? '0', 18, contracts.pointToken.symbol)
              }}
            </span>
            <span class="product-history__grid-row-value">
              {{ formatDMYTime(Number(row.timestamp)) }}
            </span>
            <app-button
              class="product-history__grid-row-btn"
              color="tertiary"
              :icon-right="$icons.pencil"
              :route="{
                name: $routes.productEdit,
                params: {
                  id: route.params.id,
                  contractAddress: row.proxy ?? '',
                },
              }"
            />
          </div>
        </template>
        <span class="product-history__grid-not-found" v-else>
          {{ t('product-history.not-found') }}
        </span>
      </div>
    </template>
    <loader v-else class="loader__history" />
    <template v-if="history.loaded">
      <div
        v-if="pagination.totalPages > 1"
        class="product-history__pagination"
        :style="{
          width: `${width}px`,
        }"
      >
        <app-pagination
          :pages="pagination.totalPages"
          :current-page="pagination.currentPage"
          @on:page-change="page => handlePaginationChange(page)"
        />
      </div>
    </template>
    <loader v-else class="loader__pagination" />
  </div>
</template>

<style lang="scss" scoped>
.product-history__title {
  font-size: 2.25rem;
  font-weight: 900;
}

.product-history__grid {
  margin-top: toRem(10);
  overflow-x: auto;
  overflow-y: hidden;

  &-not-found {
    display: block;
    margin-top: toRem(20);
  }
}

.product-history__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-history__grid-row {
  display: grid;
  align-items: center;
  grid-template-columns: 1.3fr 1.3fr 1.2fr 1.2fr toRem(72);
  padding: toRem(20) 0;
  font-weight: 700;
  font-size: toRem(16);
  border-bottom: #{toRem(1) solid var(--border-primary-main)};
  width: 100%;
  min-width: toRem(900);

  &--titled {
    font-family: var(--app-font-family-secondary);
    color: var(--text-secondary-main);
    font-size: toRem(14);
    border: 0;
  }

  &:last-child {
    border-bottom: none;
  }
}

.product-history__grid-row-value {
  padding-right: toRem(10);
  overflow: hidden;

  &:nth-child(5) {
    text-align: end;
    padding: 0;
  }
}

.product-history__grid-row-btn {
  justify-self: end;
  padding: toRem(4);
  font-size: toRem(12);
}

.product-history__pagination {
  margin-top: toRem(30);
  display: flex;
  justify-content: center;
}

.loader__history {
  margin-top: toRem(30);
  height: toRem(372);
}

.loader__pagination {
  margin-top: toRem(30);
  height: toRem(22);
}
</style>
