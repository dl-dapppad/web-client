<template>
  <div class="loader">
    <template v-if="scheme === SCHEMES.spinner">
      <spinner />
    </template>
    <template v-if="scheme === SCHEMES.cubes">
      <cubes />
    </template>
  </div>
</template>

<script lang="ts">
/* create skeletons */
import Spinner from '@/common/loader/Spinner.vue'
import Cubes from '@/common/loader/Cubes.vue'

import { defineComponent } from 'vue'

const SCHEMES = {
  spinner: 'spinner',
  cubes: 'cubes',
}

export default defineComponent({
  name: 'loader',
  components: { Spinner, Cubes },
  props: {
    scheme: {
      type: String,
      default: SCHEMES.cubes,
    },
  },
  setup() {
    return {
      SCHEMES,
    }
  },
})
</script>

<style lang="scss" scoped>
.loader {
  display: grid;
  place-items: center;
}
</style>
