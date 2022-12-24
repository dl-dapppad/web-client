<script setup lang="ts">
import { ref } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

defineEmits(['on:pageChange'])

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
})
const page = ref(1)

const init = () => {
  page.value = props.currentPage
}

init()
</script>

<template>
  <v-pagination
    v-model="page"
    :pages="pages"
    :range-size="1"
    @update:model-value="$emit('on:pageChange', page)"
  />
</template>

<style lang="scss">
.Pagination {
  .Page {
    font-family: var(--app-font-family-secondary);
    font-size: toRem(12);
    font-weight: 700;
    padding: toRem(6) toRem(20);
    background: var(--white);
    color: var(--primary-main);
    border: toRem(2) solid var(--primary-main);
    margin: 0 toRem(5);

    &-active {
      /* stylelint-disable */
      background-color: var(--info-main) !important;
      /* stylelint-enable */
      color: var(--white);
    }
  }

  .DotsHolder svg path {
    fill: var(--primary-main);
  }
}
</style>
