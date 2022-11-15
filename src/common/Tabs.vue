<script lang="ts" setup>
import { AppBlock, AppButton } from '@/common'

defineProps<{
  modelValue: number
  tabsData: {
    title: string
    number: number
  }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()
</script>

<template>
  <div class="tabs">
    <app-block v-for="(tab, idx) in tabsData" :key="idx">
      <app-button
        type="button"
        size="small"
        scheme="borderless"
        :text="tab.title"
        :color="modelValue === tab.number ? 'secondary' : 'tertiary'"
        modification="border-rounded"
        @click="emit('update:modelValue', tab.number)"
      />
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
}
</style>
