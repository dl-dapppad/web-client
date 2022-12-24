<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { animate } from 'motion'

import { AppButton, AppBlock, AddressCopy, Tabs, ContentRender } from '@/common'
import { ROUTE_NAMES } from '@/enums'
import { Post } from '@/types'

import { EditOverview } from '@/modules/common'
import { OverviewRow } from '@/modules/types'

import postsData from '@/assets/posts.json'

defineProps<{
  headingData?: {
    title?: string
    description?: string
    interactionLbl?: string
    infoLbl?: string
  }
  overview: {
    isLoaded: boolean
    rows: Array<OverviewRow>
  }
}>()

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const route = useRoute()

const { width: windowWidth } = useWindowSize()

const posts = postsData as unknown as Post[]
const post = posts.find(el => el.id === route.params.id)

const FORM_TABS = [
  {
    title: t('product-edit.default.tab-read'),
    number: 1,
  },
  {
    title: t('product-edit.default.tab-write'),
    number: 2,
  },
]

const currentTabNumber = ref(FORM_TABS[0].number)
const infoTextElem = ref<HTMLParagraphElement | null>(null)

const infoBlock = ref({
  html: '',
  isShownFull: true,
  heightDefault: 0,
  heightCutted: 0,
  initWidth: 0,
})

const initInfoAnimation = () => {
  if (
    !infoTextElem.value ||
    !isShowMoreShown.value ||
    !post?.infoDescriptionContent
  )
    return

  infoTextElem.value.removeAttribute('style')

  infoBlock.value.heightDefault = infoTextElem.value.clientHeight

  infoTextElem.value.innerText = `${post.infoDescriptionContent[0][1]
    ?.slice(0, 150)
    .trim()}...`
  infoBlock.value.heightCutted =
    infoTextElem.value.clientHeight < 200
      ? infoTextElem.value.clientHeight
      : 200

  infoBlock.value.initWidth = windowWidth.value
}

const handleShowMore = () => {
  if (!infoTextElem.value || !post?.infoDescriptionContent) return

  if (windowWidth.value !== infoBlock.value.initWidth) {
    initInfoAnimation()

    infoBlock.value.isShownFull = !infoBlock.value.isShownFull
    infoTextElem.value.setAttribute(
      'style',
      `height: ${
        infoBlock.value.isShownFull
          ? infoBlock.value.heightCutted
          : infoBlock.value.heightDefault
      }px`,
    )

    infoBlock.value.isShownFull = !infoBlock.value.isShownFull
  }

  !infoBlock.value.isShownFull
    ? (infoTextElem.value.innerHTML = infoBlock.value.html)
    : (infoTextElem.value.innerHTML = `${post.infoDescriptionContent[0][1]
        .slice(0, 150)
        .trim()}...`)

  animate(infoTextElem.value, {
    height: infoBlock.value.isShownFull
      ? `${infoBlock.value.heightCutted}px`
      : `${infoBlock.value.heightDefault}px`,
  })
  infoBlock.value.isShownFull = !infoBlock.value.isShownFull
}

onMounted(() => {
  infoBlock.value.html = infoTextElem?.value?.innerHTML as string
  initInfoAnimation()

  if (infoTextElem.value) {
    animate(infoTextElem.value, {
      height: infoBlock.value.isShownFull
        ? `${infoBlock.value.heightCutted}px`
        : `${infoBlock.value.heightDefault}px`,
    })
  }

  infoBlock.value.isShownFull = !infoBlock.value.isShownFull
})

const isInfoShown = computed(() => post?.infoDescriptionContent?.length)

const isShowMoreShown = computed(() => {
  if (!post?.infoDescriptionContent?.length) return false

  return (
    post.infoDescriptionContent.length > 1 ||
    post.infoDescriptionContent[0][1].length > 150
  )
})

watch(
  () => windowWidth.value,
  () => infoTextElem.value?.removeAttribute('style'),
)
</script>

<template>
  <div class="base-edit-form">
    <div class="app__module-heading">
      <div class="app__module-title-wrp">
        <app-button
          type="button"
          class="app__module-back-btn"
          :icon-right="$icons.arrowLeft"
          modification="border-circle"
          color="tertiary"
          @click="
            router.push({
              name: ROUTE_NAMES.product,
              params: {
                id: route.params.id,
              },
            })
          "
        />
        <h2 class="app__module-title">
          {{ headingData?.title ?? $t('product-edit.default.title') }}
        </h2>
      </div>
      <span class="app__module-subtitle">
        <address-copy
          :address="String(route.params.contractAddress)"
          class="app__module-subtitle"
        />
      </span>
      <span class="app__module-description">
        {{ headingData?.description ?? $t('product-edit.default.description') }}
      </span>
    </div>
    <div class="app__module-padding-bottom" v-if="isInfoShown">
      <h3 class="app__module-block-title">
        {{ headingData?.infoLbl ?? $t('product-edit.default.info-lbl') }}
      </h3>
      <app-block>
        <div class="app__module-content base-edit-form__content">
          <span class="app__module-info-text" ref="infoTextElem">
            <content-render :content="post?.infoDescriptionContent ?? []" />
          </span>
          <app-button
            v-if="isShowMoreShown"
            class="base-edit-form__info-btn"
            color="tertiary"
            size="small"
            :text="
              infoBlock.isShownFull
                ? $t('product-edit.default.info-btn-less')
                : $t('product-edit.default.info-btn-more')
            "
            @click="handleShowMore"
          />
        </div>
      </app-block>
    </div>
    <edit-overview :is-loaded="overview.isLoaded" :rows="overview.rows" />
    <div>
      <!-- eslint-disable -->
      <h3 class="app__module-block-title">
        {{
          headingData?.interactionLbl ??
            $t('product-edit.default.interaction-lbl')
        }}
      </h3>
      <!-- eslint-enable -->
      <tabs v-model="currentTabNumber" :tabs-data="FORM_TABS" />
      <app-block>
        <div
          v-if="currentTabNumber === FORM_TABS[0].number"
          class="app__module-content"
        >
          <slot name="tabFirst" />
        </div>
        <div
          v-if="currentTabNumber === FORM_TABS[1].number"
          class="app__module-content"
        >
          <slot name="tabSecond" />
        </div>
      </app-block>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-edit-form__content {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
}

.base-edit-form__info-btn {
  min-width: toRem(150);

  @include respond-to(medium) {
    width: 100%;
  }
}
</style>
