<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { i18n } from '@/localization'
import { OVERVIEW_ROW } from '@/modules/enums'
import { BaseEditForm, MintForm } from '@/modules/erc20/forms'
import { formatAmount } from '@/helpers'

import { useProductErc20MintCap } from '@/modules/erc20/erc20-mint-cap/composables/use-product-erc20-mint-cap'

const { t } = i18n.global
const route = useRoute()

const overviewRows = ref([
  {
    index: 3,
    row: {
      id: 'cap',
      name: t('product-edit.erc20-common.max-supply'),
      value: '',
      type: OVERVIEW_ROW.amount,
    },
  },
])

const erc20 = useProductErc20MintCap()

const forms = [
  {
    slot: 'mint',
    index: 0,
  },
]

const init = async () => {
  erc20.init(route.params.contractAddress as string)

  await erc20.loadDetails()

  overviewRows.value[0].row.value = formatAmount(
    await erc20.cap(),
    erc20.decimals.value,
    erc20.symbol.value,
  )
}
</script>

<template>
  <base-edit-form
    :write-forms="forms"
    :overview-rows="overviewRows"
    @init="init"
  >
    <template #mint="{ updateBalance }">
      <mint-form :token="erc20" @change-balance="updateBalance" />
    </template>
  </base-edit-form>
</template>
