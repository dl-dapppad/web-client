<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${name}-icon`" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ICON_NAMES } from '@/enums'

export default defineComponent({
  name: 'icon',
  props: {
    name: {
      type: String as PropType<ICON_NAMES>,
      required: true,
    },
  },
})
</script>

<style lang="scss">
.icon {
  display: grid;
  place-items: center;
  pointer-events: none;
}
</style>
