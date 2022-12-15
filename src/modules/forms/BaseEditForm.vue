<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWindowSize } from '@vueuse/core'

import { AppButton, AppBlock, LinkCopy, Tabs } from '@/common'
import { ROUTE_NAMES } from '@/enums'
import { Post } from '@/types'

import { EditOverview } from '@/modules/common'
import { OverviewRow } from '@/modules/types'

import postsData from '@/assets/posts.json'
import { animate } from 'motion'

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

const router = useRouter()
const route = useRoute()

const { width: windowWidth } = useWindowSize()

const posts = postsData as unknown as Post[]
const post = posts.find(el => el.id === route.params.id)

const FORM_TABS = [
  {
    title: 'Read',
    number: 1,
  },
  {
    title: 'Write',
    number: 2,
  },
]

const currentTabNumber = ref(FORM_TABS[0].number)
const infoTextElem = ref<HTMLParagraphElement | null>(null)
const isInfoShownFull = ref(true)
const defaultInfoHeight = ref(0)
const cuttedInfoHeight = ref(0)
const initWidth = ref(0)

const infoText = computed(() =>
  isInfoShownFull.value
    ? (post?.description as string)
    : Number(post?.description.length) > 150
    ? `${post?.description.slice(0, 150).trim()}...`
    : post?.description,
)

const init = () => {
  if (!infoTextElem.value || Number(post?.description.length) < 150) return

  infoTextElem.value.removeAttribute('style')

  infoTextElem.value.innerText = post?.description as string
  defaultInfoHeight.value = infoTextElem.value.clientHeight

  infoTextElem.value.innerText = `${post?.description.slice(0, 150).trim()}...`
  cuttedInfoHeight.value = infoTextElem.value.clientHeight

  initWidth.value = windowWidth.value
}

const handleShowMore = () => {
  if (!infoTextElem.value) return

  if (windowWidth.value !== initWidth.value) {
    init()

    isInfoShownFull.value = !isInfoShownFull.value
    infoTextElem.value.setAttribute(
      'style',
      `height: ${
        isInfoShownFull.value ? cuttedInfoHeight.value : defaultInfoHeight.value
      }px`,
    )

    isInfoShownFull.value = !isInfoShownFull.value
  }

  animate(infoTextElem.value, {
    height: isInfoShownFull.value
      ? `${cuttedInfoHeight.value}px`
      : `${defaultInfoHeight.value}px`,
  })
  isInfoShownFull.value = !isInfoShownFull.value
}
onMounted(() => {
  init()

  animate(infoTextElem.value ?? '', {
    height: isInfoShownFull.value
      ? `${cuttedInfoHeight.value}px`
      : `${defaultInfoHeight.value}px`,
  })
  isInfoShownFull.value = !isInfoShownFull.value
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
          {{ headingData?.title ?? $t('edit-form.default-title') }}
        </h2>
      </div>
      <span class="app__module-subtitle">
        <link-copy
          :address="String(route.params.contractAddress)"
          class="app__module-subtitle"
        />
      </span>
      <span class="app__module-description">
        {{ headingData?.description ?? $t('edit-form.default-description') }}
      </span>
    </div>
    <div class="app__module-padding-bottom">
      <h3 class="app__module-block-title">
        {{ headingData?.infoLbl ?? $t('edit-form.default-info-lbl') }}
      </h3>
      <app-block>
        <div class="app__module-content base-edit-form__content">
          <span class="app__module-info-text" ref="infoTextElem">
            {{ infoText }}
          </span>
          <app-button
            v-if="Number(post?.description.length) > 150"
            color="tertiary"
            size="small"
            :text="$t('edit-form.info-btn')"
            @click="handleShowMore"
          />
        </div>
      </app-block>
    </div>
    <edit-overview :is-loaded="overview.isLoaded" :rows="overview.rows" />
    <div>
      <h3 class="app__module-block-title">
        {{
          headingData?.interactionLbl ?? $t('edit-form.default-interaction-lbl')
        }}
      </h3>
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
</style>
