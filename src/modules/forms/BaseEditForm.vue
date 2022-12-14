<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { AppButton, AppBlock, LinkCopy, Tabs } from '@/common'
import { ROUTE_NAMES } from '@/enums'
// import { Post } from '@/types'

import { EditOverview } from '@/modules/common'
import { OverviewRow } from '@/modules/types'

// import postsData from '@/assets/posts.json'

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

// const posts = postsData as unknown as Post[]
// const post = posts.find(el => el.id === route.params.id)
// console.log(post)

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

// const infoText = computed(() => props.headingData?.infoText as string)
const infoText = computed(() => '123')
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
          <span class="app__module-info-text">
            {{ infoText }}
          </span>
          <app-button color="tertiary" size="small" :text="'Show more'" />
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
