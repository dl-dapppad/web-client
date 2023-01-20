<script lang="ts" setup>
import { AddressCopy, Loader } from '@/common'
import { OVERVIEW_ROW } from '@/modules/enums'
import { OverviewRow } from '@/modules/types'

withDefaults(
  defineProps<{
    isLoaded?: boolean
    rows?: Array<OverviewRow>
  }>(),
  {
    isLoaded: true,
    rows: undefined,
  },
)
</script>

<template>
  <div v-if="rows" class="overview-render app__metadata">
    <div
      v-for="row in rows"
      :key="row.name"
      class="app__metadata-row app__metadata-row--mobile-break-line"
    >
      <span class="app__metadata-lbl overview-render__key">
        {{ row.name }}
      </span>
      <span v-if="isLoaded" class="app__metadata-value">
        <template v-if="row.type === OVERVIEW_ROW.amount">
          <span class="app__price overview-render__value">
            {{ row.value.split(' ')[0] }}
            <span class="app__price-asset overview-render__value">
              {{ row.value.split(' ')[1] }}
            </span>
          </span>
        </template>
        <template v-else-if="row.type === OVERVIEW_ROW.address">
          <address-copy :address="row.value" class="app__link--accented" />
        </template>
        <template v-else-if="row.type === OVERVIEW_ROW.link">
          <address-copy
            :address="row.value"
            :href="row.value"
            :show-first-cropp-symbols="20"
            class="app__link--accented"
          />
        </template>
        <template v-else>
          <span class="overview-render__value">
            {{ row.value }}
          </span>
        </template>
      </span>
      <loader v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overview-render__key {
  padding-right: toRem(50);
}

.overview-render__value {
  word-break: break-word;
}
</style>
