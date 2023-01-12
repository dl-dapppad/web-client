<script lang="ts" setup>
import { useRoute } from 'vue-router'
import {
  BaseEditForm,
  TokenByIndexForm,
  TokenOfOwnerByIndexForm,
  BurnForm,
} from '@/modules/erc721/forms'

import { useProductErc721BurnEnum } from '@/modules/erc721/erc721-burn-enum/composables/use-product-erc721-burn-enum'

const route = useRoute()

const erc721 = useProductErc721BurnEnum()

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
  <base-edit-form
    :write-forms="writeForms"
    :read-forms="readForms"
    @init="init"
  >
    <template #token-by-index>
      <token-by-index-form :token="erc721" />
    </template>
    <template #token-of-owner-by-index>
      <token-of-owner-by-index-form :token="erc721" />
    </template>
    <template #burn="{ changeBalance }">
      <burn-form :token="erc721" @change-balance="changeBalance" />
    </template>
  </base-edit-form>
</template>
