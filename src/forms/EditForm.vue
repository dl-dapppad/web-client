<script lang="ts" setup>
import { useRoute } from '@/router'
import { defineAsyncComponent, Component } from 'vue-demi'

import { ErrorHandler, makeProductPath } from '@/helpers'

const route = useRoute()

let EditForm: Component

try {
  EditForm = defineAsyncComponent(
    () => import(makeProductPath(route.params.id as string, 'edit')),
  )
} catch (err) {
  ErrorHandler.process(err)
}
</script>

<template>
  <div class="edit-form">
    <edit-form />
  </div>
</template>

<style lang="scss" scoped>
.edit-form {
  padding: toRem(50) toRem(225);

  @include respond-to(medium) {
    padding: toRem(24);
  }
}

.edit-form__module {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: toRem(990);
  margin: 0 auto;
  gap: toRem(70);
}
</style>
