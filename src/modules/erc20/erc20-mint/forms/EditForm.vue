<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { BaseEditForm, MintForm } from '@/modules/erc20/forms'

import { useProductErc20Mint } from '@/modules/erc20/erc20-mint/composables/use-product-erc20-mint'

const erc20 = useProductErc20Mint()
const route = useRoute()

const forms = [
  {
    slot: 'mint',
    index: 0,
  },
]

const init = async () => {
  erc20.init(route.params.contractAddress as string)

  await erc20.loadDetails()
}
</script>

<template>
  <base-edit-form :write-forms="forms" @init="init">
    <template #mint="{ updateBalance }">
      <mint-form :token="erc20" @change-balance="updateBalance" />
    </template>
  </base-edit-form>
</template>
