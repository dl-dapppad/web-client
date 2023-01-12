<script lang="ts" setup>
import { useRoute } from 'vue-router'
import {
  BaseEditForm,
  MintForm,
  BurnForm,
  BurnFromForm,
} from '@/modules/erc20/forms'

import { useProductErc20MintBurn } from '@/modules/erc20/erc20-mint-burn/composables/use-product-erc20-mint-burn'

const erc20 = useProductErc20MintBurn()
const route = useRoute()

const forms = [
  {
    slot: 'mint',
    index: 0,
  },
  {
    slot: 'burn',
    index: 1,
  },
  {
    slot: 'burn-from',
    index: 2,
  },
]

const init = async () => {
  erc20.init(route.params.contractAddress as string)

  await erc20.loadDetails()
}
</script>

<template>
  <base-edit-form :write-forms="forms" @init="init">
    <template #burn="{ updateBalance, balance }">
      <burn-form
        :token="erc20"
        :balance="balance"
        @change-balance="updateBalance"
      />
    </template>
    <template #burn-from="{ updateBalance }">
      <burn-from-form :token="erc20" @change-balance="updateBalance" />
    </template>
    <template #mint="{ updateBalance }">
      <mint-form :token="erc20" @change-balance="updateBalance" />
    </template>
  </base-edit-form>
</template>
