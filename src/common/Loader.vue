<template>
  <div class="loader">
    <template v-if="scheme === SCHEMES.skeletor">
      <skeletor />
    </template>
    <template v-if="scheme === SCHEMES.cubes">
      <cubes />
    </template>
    <template v-if="scheme === SCHEMES.spinner">
      <spinner />
    </template>
  </div>
</template>

<script lang="ts">
/* create skeletons */
import { Skeletor } from 'vue-skeletor'
import Spinner from '@/common/loaders/Spinner.vue'
import Cubes from '@/common/loaders/Cubes.vue'
import 'vue-skeletor/dist/vue-skeletor.css'

import { defineComponent } from 'vue'

export const SCHEMES = {
  spinner: 'spinner',
  cubes: 'cubes',
  skeletor: 'skeletor',
}

export default defineComponent({
  name: 'loader',
  components: { Spinner, Cubes, Skeletor },
  props: {
    scheme: {
      type: String,
      default: SCHEMES.skeletor,
    },
  },
  setup() {
    return {
      SCHEMES,
    }
  },
})
</script>

<style lang="scss">
.loader {
  width: 100%;
  display: grid;
  place-items: center;

  .animation {
    width: 100%;
    height: 100%;
  }

  .vue-skeletor {
    border-radius: toRem(12);
  }
}
</style>
