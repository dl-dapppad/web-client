<script lang="ts" setup>
import { AppBlock, AppButton, Icon } from '@/common'

defineProps<{
  modelValue: number
  isVertical?: boolean
  isStretchedHorizontal?: boolean
  activeColor?: string
  nonActiveColor?: string
  tabsData: {
    title?: string
    icon?: string
    number: number
  }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()
</script>

<template>
  <div class="tabs" :class="{ 'tabs--vertical': isVertical }">
    <app-block
      class="tabs__button-wrp"
      :class="{
        'tabs__button-wrp--vertical': isVertical,
        'tabs__button-wrp--stretched': isStretchedHorizontal,
      }"
      v-for="(tab, idx) in tabsData"
      :key="idx"
    >
      <div class="tabs__block-inner">
        <app-button
          class="tabs__button"
          :class="{
            'tabs__button--vertical': isVertical,
            'tabs__button--stretched': isStretchedHorizontal,
          }"
          type="button"
          size="small"
          scheme="borderless"
          :color="
            modelValue === tab.number
              ? activeColor ?? 'secondary'
              : nonActiveColor ?? 'tertiary'
          "
          :icon-left="!isVertical ? tab.icon : ''"
          modification="border-rounded"
          @click="emit('update:modelValue', tab.number)"
        >
          <icon
            v-if="tab.icon && isVertical"
            class="tabs__icon"
            :class="{ 'tabs__icon--vertical': isVertical }"
            :name="tab.icon"
          />
          <span>
            {{ tab.title }}
          </span>
        </app-button>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;

  &--vertical {
    flex-direction: column;
  }
}

.tabs__block-inner {
  height: 100%;
}

.tabs__button {
  height: 100%;
  font-size: inherit;
  font-weight: inherit;

  &--stretched {
    width: 100%;
    flex-grow: 1;
  }

  &--vertical {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
    font-weight: 400;
    font-size: toRem(16);
    padding: toRem(25) toRem(12);
    height: 100%;
  }
}

.tabs__button-wrp {
  &--stretched {
    flex-grow: 1;
  }

  &--vertical {
    display: flex;
    flex: 1;
  }
}

.tabs__icon {
  &--vertical {
    max-width: 2em;
    max-height: 2em;
    min-width: 2em;
    min-height: 2em;
  }
}
</style>
