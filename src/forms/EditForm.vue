<script lang="ts" setup>
import { computed } from 'vue'
import { defineAsyncComponent } from 'vue-demi'
import { useRoute } from '@/router'
import { useProduct } from '@/composables'

const route = useRoute()
const product = useProduct()

const EditForm = computed(() => {
  const path = product.makeProductPath(route.params.id as string)

  return defineAsyncComponent(
    path.length === 1
      ? () => import(`@/modules/${path[0]}/forms/EditForm.vue`)
      : () => import(`@/modules/${path[0]}/${path[1]}/forms/EditForm.vue`),
  )
})
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
