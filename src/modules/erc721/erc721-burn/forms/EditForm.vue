<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { BaseEditForm, BurnForm } from '@/modules/erc721/forms'

import { useProductErc721Burn } from '@/modules/erc721/erc721-burn/composables/use-product-erc721-burn'

const route = useRoute()

const erc721 = useProductErc721Burn()

const writeForms: {
  slot: string
  index: number
}[] = [{ slot: 'burn', index: 2 }]

const init = async () => {
  erc721.init(route.params.contractAddress as string)

  await erc721.loadDetails()
}
</script>

<template>
  <base-edit-form :write-forms="writeForms" @init="init">
    <template #burn="{ changeBalance }">
      <burn-form :token="erc721" @change-balance="changeBalance" />
    </template>
  </base-edit-form>
</template>
