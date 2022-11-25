<template>
  <div class="animation">
    <lottie-animation
      class="no-data-message__animation"
      :animation-data="cubes"
      v-bind="$attrs"
    />
  </div>
</template>

<script lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import cubes from '@/assets/animations/loader.json'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'cubes',
  components: { LottieAnimation },
  setup() {
    return {
      cubes,
    }
  },
})
</script>

<style lang="scss" scoped></style>
