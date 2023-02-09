<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

import { AppBlock, AppButton, ContentRender } from '@/common'
import { useRoute, useRouter } from '@/router'
import { Post } from '@/types'
import { ROUTE_NAMES, WINDOW_BREAKPOINTS } from '@/enums'

import PostItemPageCheckout from '@/pages/PostItemPage/PostItemPageCheckout.vue'
import PostItemPageHistory from '@/pages/PostItemPage/PostItemPageHistory.vue'
import postsData from '@/assets/posts.json'

import { config } from '@/config'

const isHistoryShown = ref(false)

const route = useRoute()
const router = useRouter()

const { width: windowWidth } = useWindowSize()

const posts = postsData as unknown as Post[]
const post = ref(posts.find(el => el.id === (route.params.id || route.name)))
const alias = ref('')

const isSmallFontBanner = computed(() =>
  ['terms-of-use'].includes(post.value?.id as string),
)

const width = computed(() => {
  let result = 0
  if (windowWidth.value < WINDOW_BREAKPOINTS.small)
    result = windowWidth.value - 122
  else if (windowWidth.value < WINDOW_BREAKPOINTS.medium)
    result = windowWidth.value - 177
  else result = windowWidth.value - 522

  return Math.max(result, 206)
})

const init = () => {
  alias.value = config.PRODUCT_ALIASES[route.params.id as string]
}

const handleHistoryState = (val: boolean) => (isHistoryShown.value = val)

const handleBackBtn = () =>
  router.push({
    name: ROUTE_NAMES.main,
  })

watch(
  () => route.params.id,
  () => (post.value = posts.find(el => el.id === route.params.id)),
)

init()
</script>

<template>
  <div class="post-item-page">
    <app-block class="post-item-page__banner-wrp">
      <div
        class="post-item-page__banner"
        :style="{
          backgroundImage: `url(/images/${post.id.split('-')[0]}.png)`,
        }"
      >
        <div class="post-item-page__banner-darker">
          <div class="post-item-page__banner-title-wrp">
            <h1
              class="post-item-page__banner-title"
              :class="{
                'post-item-page__banner-title--small-font': isSmallFontBanner,
              }"
            >
              {{ post?.title }}
            </h1>
            <app-button
              class="post-item-page__back-btn"
              :icon-left="$icons.arrowLeft"
              modification="border-circle"
              color="tertiary"
              @click="handleBackBtn"
            />
          </div>
        </div>
      </div>
    </app-block>
    <post-item-page-checkout v-if="post" :post="post" />
    <app-block class="post-item-page__content-wrp" v-if="alias">
      <div
        class="post-item-page__content"
        :class="{ 'post-item-page__content--paddingless-r': isHistoryShown }"
      >
        <post-item-page-history @update-history-state="handleHistoryState" />
      </div>
    </app-block>
    <app-block class="post-item-page__content-wrp">
      <div class="post-item-page__content" v-if="post.content.length > 0">
        <content-render :content="(post?.content as Post['content'])" />
      </div>
      <div class="post-item-page__content" v-if="post?.categoryContent">
        <!-- eslint-disable -->
        <div
          v-for="(row, ind) in post.categoryContent"
          class="post-item-page__content-item"
          :key="ind"
        >
          <h2
            v-if="row[0] === 'title'"
            class="post-item-page__content-title"
            v-html="row[1]"
          />
          <span
            v-else-if="row[0] === 'subtitle'"
            class="post-item-page__content-subtitle"
          >
            {{ row[1] }}
          </span>
          <img
            v-else-if="row[0] === 'image'"
            class="post-item-page__content-image"
            :src="row[1]"
          />
          <div
            v-else-if="row[0] === 'single-category'"
            class="post-item-page__content-category"
          >
            <div
              v-for="(item, idx) in row[1]"
              class="post-item-page__content-category-item"
              :key="idx"
            >
              <div class="post-item-page__content-category-item-value">
                {{ `${String.fromCharCode(idx + 'A'.charCodeAt(0))}.` }}
              </div>
              <span class="post-item-page__content-text" v-html="item" />
            </div>
          </div>
          <div
            v-else-if="row[0] === 'category'"
            class="post-item-page__content-category"
          >
            <div
              v-for="(item, categoryInd) in row[1]"
              class="post-item-page__content-category-item"
              :key="categoryInd"
            >
              <h3 class="post-item-page__content-category-title">
                {{ `${categoryInd + 1}.` }}
              </h3>
              <h3
                class="post-item-page__content-category-title"
                v-html="item[0]"
              />
              <div
                v-for="(subcat, subcatInd) in item[1]"
                class="post-item-page__content-subcategory post-item-page__content-category-item"
                :key="subcatInd"
              >
                <span class="post-item-page__content-category-item-value">
                  {{ `${categoryInd + 1}.${subcatInd + 1}` }}
                </span>
                <span
                  v-if="typeof subcat === 'object'"
                  class="post-item-page__content-text"
                  v-html="subcat[0]"
                />
                <span
                  v-else
                  class="post-item-page__content-text"
                  v-html="subcat"
                />
                <div
                  v-if="
                    typeof subcat === 'object' &&
                    typeof subcat[1][0] === 'string'
                  "
                  class="post-item-page__content-subcategory-description"
                >
                  <div
                    v-for="(subCatDesc, subCatDescInd) in subcat[1]"
                    class="post-item-page__content-category-item"
                    :key="subCatDescInd"
                  >
                    <span class="post-item-page__content-category-item-value">
                      {{ `(${subCatDescInd + 1})` }}
                    </span>
                    <span
                      v-html="subCatDesc"
                      class="post-item-page__content-text"
                    />
                  </div>
                </div>
                <div
                  v-else-if="
                    typeof subcat === 'object' && typeof subcat[1] === 'object'
                  "
                  :style="{
                    width: `${width}px`,
                  }"
                  class="post-item-page__content-subcategory-table"
                >
                  <div
                    v-for="(tableItem, tableInd) in subcat[1][0]"
                    :key="tableInd"
                    class="post-item-page__content-subcategory-table-item post-item-page__content-text"
                    :class="{
                      'post-item-page__content-subcategory-table-item--bold':
                        tableInd < 3,
                    }"
                  >
                    <!-- eslint-enable -->
                    <span
                      v-if="typeof tableItem === 'string'"
                      class="post-item-page__content-subcategory-table-text"
                    >
                      {{ tableItem }}
                    </span>
                    <div
                      v-else-if="typeof tableItem === 'object'"
                      class="post-item-page__content-subcategory-table-text-wrp"
                    >
                      <span
                        class="post-item-page__content-subcategory-table-text"
                        v-for="(tableListItem, tableListItemInd) in tableItem"
                        :key="tableListItemInd"
                      >
                        {{ `- ${tableListItem}` }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- eslint-enable -->
            </div>
          </div>
        </div>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss">
$page-padding-left: toRem(165);
$page-padding-right: toRem(165);

.post-item-page {
  display: flex;
  flex-direction: column;
}

.post-item-page__banner {
  background-size: cover;
  background-position: center;
  border-radius: toRem(12);
}

.post-item-page__banner-darker {
  padding: toRem(50) $page-padding-right toRem(60) $page-padding-left;
  background: linear-gradient(
    90deg,
    rgba(236, 234, 245, 0.5) 0%,
    rgba(50, 49, 52, 0.5) 10.42%,
    rgba(0, 0, 0, 0.5) 88.02%,
    rgba(236, 234, 245, 0.5) 100%
  );
  border-radius: toRem(12);
  overflow: hidden;

  @include respond-to(medium) {
    padding: toRem(30) toRem(0) toRem(30) toRem(74);
  }
}

.post-item-page__banner-title-wrp {
  position: relative;
}

.post-item-page__banner-title {
  font-size: toRem(70);
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--text-primary-invert-main);

  @include respond-to(medium) {
    font-size: toRem(36);
  }

  &--small-font {
    font-size: toRem(48);

    @include respond-to(medium) {
      font-size: toRem(30);
    }
  }
}

.post-item-page__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  right: calc(100% + #{toRem(56)});
  padding: 0;

  @include respond-to(medium) {
    left: -#{toRem(64)};
  }
}

.post-item-page__content-wrp {
  flex: 1;
}

.post-item-page__content {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
  padding: toRem(70) $page-padding-right toRem(40) $page-padding-left;

  &--paddingless-r {
    padding-right: 0;
  }

  @include respond-to(medium) {
    padding: toRem(30) toRem(20);
  }
}

.post-item-page__content-item {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
}

.post-item-page__content-title {
  font-size: toRem(36);
  font-weight: 900;

  & > * {
    font-size: toRem(36);
  }
}

.post-item-page__content-subtitle {
  font-size: toRem(20);
  font-weight: 500;
}

.post-item-page__content-image {
  align-self: center;

  @include respond-to(medium) {
    width: 100%;
  }
}

.post-item-page__content-category {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
}

.post-item-page__content-category-item {
  display: grid;
  grid-template-columns: toRem(55) 1fr;
  grid-row-gap: toRem(30);
  font-size: toRem(20);
  line-height: 1.3;

  @include respond-to(medium) {
    grid-template-columns: toRem(40) 1fr;
  }
}

.post-item-page__content-category-item-value {
  font-size: toRem(20);
  font-weight: 700;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.post-item-page__content-category-title {
  font-size: toRem(30);
  font-weight: 700;

  @include respond-to(medium) {
    font-size: toRem(24);
  }
}

.post-item-page__content-subcategory {
  grid-column: 1 / -1;
}

.post-item-page__content-subcategory-description {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: toRem(30);
}

.post-item-page__content-text {
  font-size: toRem(20);
  line-height: 1.3;

  & a {
    color: var(--secondary-main);
    text-decoration: underline;
    font-weight: 400;
    font-size: inherit;
  }

  &--breakable {
    font-size: inherit;

    @include respond-to(medium) {
      word-break: break-word;
    }
  }

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.post-item-page__content-subcategory-table {
  grid-column: 2 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: auto;

  @include respond-to(small) {
    grid-column: 1 / -1;
  }
}

.post-item-page__content-category-table {
  display: flex;
  flex-direction: column;
  border-bottom: 0;
  overflow-x: auto;
}

.post-item-page__content-subcategory-table-item {
  padding: toRem(8);
  border-right: toRem(2) solid var(--primary-main);
  border-bottom: toRem(2) solid var(--primary-main);

  &:nth-child(3n + 1) {
    border-left: toRem(2) solid var(--primary-main);
    text-align: center;
  }

  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(3) {
    border-top: toRem(2) solid var(--primary-main);
    font-weight: 700;
    text-align: center;
  }
}

.post-item-page__content-subcategory-table-text-wrp {
  display: flex;
  flex-direction: column;
}

.post-item-page__content-subcategory-table-text {
  font-size: inherit;
}
</style>
