<script lang="ts" setup>
import { AppBlock, AppButton } from '@/common'
import { cropAddress, copyToClipboard } from '@/helpers'
import { OVERVIEW_ROW } from '@/enums'

export interface OverviewRow {
  name: string
  value: string
  type: OVERVIEW_ROW
}

const props = defineProps<{
  rows?: Array<OverviewRow>
}>()
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
            <span class="app__metadata-value">
              <template v-if="row.type === OVERVIEW_ROW.amount">
                <span class="app__price">
                  {{ row.value.split(' ')[0] }}
                  <span class="app__price-asset">
                    {{ row.value.split(' ')[1] }}
                  </span>
                </span>
              </template>
              <template v-else-if="row.type === OVERVIEW_ROW.address">
                <span class="app__metadata-value">
                  <app-button
                    scheme="default"
                    color="secondary"
                    size="default"
                    :text="cropAddress(row.value)"
                    :icon-right="$icons.duplicate"
                    @click="copyToClipboard(row.value)"
                  />
                </span>
              </template>
              <template v-else>
                {{ row.value }}
              </template>
            </span>
          </div>
        </div>
      </div>
    </app-block>
  </div>
</template>
