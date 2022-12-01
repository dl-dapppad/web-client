<script lang="ts" setup>
import { AppBlock, LinkCopy } from '@/common'
import { OVERVIEW_ROW } from '@/modules/enums'
import { OverviewRow } from '@/modules/types'

const props = withDefaults(
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
  <div>
    <h3 class="app__module-block-title">
      {{ $t('edit.overview') }}
    </h3>
    <app-block>
      <div class="app__module-content">
        <div v-if="props.rows" class="app__metadata erc20-edit-form__metadata">
          <div
            v-for="row in props.rows"
            :key="row.name"
            class="app__metadata-row"
          >
            <span class="app__metadata-lbl">
              {{ row.name }}
            </span>
            <span v-if="props.isLoaded" class="app__metadata-value">
              <template v-if="row.type === OVERVIEW_ROW.amount">
                <span class="app__price">
                  {{ row.value.split(' ')[0] }}
                  <span class="app__price-asset">
                    {{ row.value.split(' ')[1] }}
                  </span>
                </span>
              </template>
              <template v-else-if="row.type === OVERVIEW_ROW.address">
                <link-copy :address="row.value" class="app__link--accented" />
              </template>
              <template v-else-if="row.type === OVERVIEW_ROW.link">
                <link-copy
                  :address="row.value"
                  :href="row.value"
                  :show-first-cropp-symbols="20"
                  class="app__link--accented"
                />
              </template>
              <template v-else>
                {{ row.value }}
              </template>
            </span>
            <skeletor v-else />
          </div>
        </div>
      </div>
    </app-block>
  </div>
</template>
