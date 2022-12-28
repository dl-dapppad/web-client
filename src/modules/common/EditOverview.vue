<script lang="ts" setup>
import { AppBlock } from '@/common'
import { OverviewRender } from '@/modules/common'
import { OverviewRow } from '@/modules/types'

withDefaults(
  defineProps<{
    isLoaded?: boolean
    rows?: Array<OverviewRow>
  }>(),
  {
    isLoaded: false,
    rows: undefined,
  },
)
</script>

<template>
  <div class="app__module-padding-bottom">
    <h3 class="app__module-block-title">
      {{ $t('product-edit.default.overview') }}
    </h3>
    <app-block>
      <div class="app__module-content">
        <overview-render :is-loaded="isLoaded" :rows="rows" />
      </div>
    </app-block>
  </div>
</template>
