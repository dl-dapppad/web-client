<script lang="ts" setup>
import Animation from '@/common/loader/Animation.vue'

import loader from '@/assets/animations/loader.json'
</script>

<template>
  <div class="loader">
    <animation :animation-data="loader" :loop="true" :speed="0.75" />
  </div>
</template>

<style lang="scss" scoped>
.loader {
  display: grid;
  place-items: center;
}
</style>
