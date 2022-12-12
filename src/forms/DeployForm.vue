<script lang="ts" setup>
import { useRoute } from '@/router'
import { defineAsyncComponent, Component } from 'vue-demi'

import { ErrorHandler, makeProductPath } from '@/helpers'

const route = useRoute()

let DeployForm: Component

try {
  const path = makeProductPath(route.params.id as string)
  DeployForm = defineAsyncComponent(() =>
    path.length === 1
      ? import(`@/modules/${path[0]}/forms/DeployForm.vue`)
      : import(`@/modules/${path[0]}/${path[1]}/forms/DeployForm.vue`),
  )
} catch (err) {
  ErrorHandler.process(err)
}
</script>

<template>
  <div class="deploy-form">
    <deploy-form />
  </div>
</template>

<style lang="scss" scoped>
.deploy-form {
  padding: toRem(50) toRem(225);

  @include respond-to(medium) {
    padding: toRem(24);
  }
}

.deploy-form__module {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: toRem(990);
  margin: 0 auto;
}
</style>
