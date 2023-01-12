<script lang="ts" setup>
import { useRoute } from 'vue-router'
import {
  BaseEditForm,
  TokenByIndexForm,
  TokenOfOwnerByIndexForm,
} from '@/modules/erc721/forms'

import { useProductErc721Enum } from '@/modules/erc721/erc721-enum/composables/use-product-erc721-enum'

const route = useRoute()

const erc721 = useProductErc721Enum()

const readForms: {
  slot: string
  index: number
}[] = [
  {
    slot: 'token-by-index',
    index: 2,
  },
  {
    slot: 'token-of-owner-by-index',
    index: 3,
  },
]

const init = async () => {
  erc721.init(route.params.contractAddress as string)

  await erc721.loadDetails()
}
</script>

<template>
  <base-edit-form :read-forms="readForms" @init="init">
    <template #token-by-index>
      <token-by-index-form :token="erc721" />
    </template>
    <template #token-of-owner-by-index>
      <token-of-owner-by-index-form :token="erc721" />
    </template>
  </base-edit-form>
</template>
