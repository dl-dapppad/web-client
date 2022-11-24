<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { Icon, AppBlock } from '@/common'
import { cropAddress, copyToClipboard } from '@/helpers'
import { OVERVIEW_ROW } from '@/enums'
import { OverviewRow } from '@/types'

const { provider } = storeToRefs(useWeb3ProvidersStore())

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
                <div class="app__link-wrp" :title="row.value">
                  <a
                    class="app__link app__link--accented"
                    :href="provider.getAddressUrl(row.value)"
                    target="_blank"
                  >
                    {{ cropAddress(row.value) }}
                  </a>
                  <div @click="copyToClipboard(row.value)">
                    <icon
                      class="app__link-icon"
                      :name="$icons.duplicateFilled"
                    />
                  </div>
                </div>
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
