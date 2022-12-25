<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useWeb3ProvidersStore } from '@/store'
import {
  useErc20,
  useFarming,
  useApollo,
  ApolloDeployedProducts,
} from '@/composables'
import { AppPagination, AddressCopy, Loader } from '@/common'
import { config } from '@/config'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { formatAmount, formatDMYTime } from '@/helpers'

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
      'product-history.cashback': 'Cashback',
      'product-history.distributed': 'Distributed',
      'product-history.price': 'Price',
      'product-history.not-found': 'History of buying is empty. Be the first!',
    },
  },
})

const { provider } = storeToRefs(useWeb3ProvidersStore())

const { width: windowWidth } = useWindowSize()

const route = useRoute()
const farming = useFarming()
const paymentToken = useErc20()
const apollo = useApollo()

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

const init = async () => {
  initApollo()

  await farming.loadDetails()
  paymentToken.init(farming.rewardToken.value)
  await paymentToken.loadDetails()
}

const initApollo = () => {
  if (!alias.value || !provider.value.chainId) return

  history.value.loaded = false

  apollo.getDeployedProducts(
    alias.value,
    pagination.value.showOnPage,
    (pagination.value.currentPage - 1) * pagination.value.showOnPage,
  )
}

const handlePaginationChange = (page: number) => {
  pagination.value.currentPage = page
  initApollo()
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
})

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
          width: `${
            windowWidth < WINDOW_BREAKPOINTS.medium
              ? windowWidth - 90 + 'px'
              : windowWidth - 410 + 'px'
          }`,
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
            <span class="product-history__grid-row-value">
              {{ t('product-history.distributed') }}
            </span>
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
                :address="row.deployer ?? ''"
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
                formatAmount(
                  row.price ?? '0',
                  paymentToken.decimals.value,
                  paymentToken.symbol.value,
                )
              }}
            </span>
            <span class="product-history__grid-row-value">
              {{
                formatAmount(
                  row.cashback ?? '0',
                  paymentToken.decimals.value,
                  paymentToken.symbol.value,
                )
              }}
            </span>
            <span class="product-history__grid-row-value">
              {{ formatDMYTime(Number(row.timestamp)) }}
            </span>
          </div>
        </template>
        <span v-else>{{ t('product-history.not-found') }}</span>
      </div>
    </template>
    <loader v-else class="loader__history" />
    <template v-if="history.loaded">
      <div v-if="pagination.totalPages > 1" class="product-history__pagination">
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
}

.product-history__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-history__grid-row {
  display: grid;
  grid-template-columns: 1.3fr 1.3fr 1.2fr 1.2fr 1.5fr;
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

  &:last-child {
    text-align: end;
    padding: 0;
  }
}

.product-history__pagination {
  margin-top: toRem(30);
  display: flex;
  justify-content: center;
}

.loader__history {
  margin-top: toRem(30);
  height: toRem(361);
}

.loader__pagination {
  margin-top: toRem(30);
  height: toRem(22);
}
</style>
