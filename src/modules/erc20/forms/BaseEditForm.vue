<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { i18n } from '@/localization'
import { useWeb3ProvidersStore } from '@/store'
import { TransferOwnershipForm, UpgradeToForm } from '@/modules/forms'
import { formatAmount, toCamelCase } from '@/helpers'
import { OVERVIEW_ROW } from '@/modules/enums'
import { OverviewRowWithId } from '@/modules/types'
import { useProduct } from '@/composables'
import { WRITE_FORMS } from '../enums'
import {
  BalanceForm,
  ApproveForm,
  AllowanceForm,
  TransferForm,
  TransferFromForm,
} from '@/modules/erc20/forms'
import { BaseEditForm } from '@/modules/forms'
import { BN } from '@/utils'
import postsData from '@/assets/posts.json'
import { Post } from '@/types'

const props = defineProps<{
  overviewRows?: {
    index: number
    row: OverviewRowWithId
  }[]
  writeForms?: {
    slot: string
    index: number
  }[]
}>()

enum EVENTS {
  init = 'init',
}

const emits = defineEmits<{
  (e: EVENTS.init): void
}>()

const { t } = i18n.global
const { provider } = storeToRefs(useWeb3ProvidersStore())
const route = useRoute()
const product = useProduct()

const erc20 = product.getUseOfErc20Product(route.params.id as string)

const posts = postsData as unknown as Post[]
const post = posts.find(el => el.id === route.params.id)

const balance = ref('0')

const write = ref<
  (
    | WRITE_FORMS
    | {
        slot: string
      }
  )[]
>([
  WRITE_FORMS.approve,
  WRITE_FORMS.transfer,
  WRITE_FORMS.transferFrom,
  WRITE_FORMS.transferOwnership,
  WRITE_FORMS.upgradeTo,
])

const overviewRows = ref<Array<OverviewRowWithId>>([
  {
    id: 'tracker',
    name: t('product-edit.erc20-common.tracker'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    id: 'total-supply',
    name: t('product-edit.erc20-common.total'),
    value: '',
    type: OVERVIEW_ROW.amount,
  },
  {
    id: 'decimals',
    name: t('product-edit.erc20-common.decimals'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    id: 'owner',
    name: t('product-edit.erc20-common.owner'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
  {
    id: 'balance',
    name: t('product-edit.erc20-common.balance'),
    value: '',
    type: OVERVIEW_ROW.amount,
  },
])

const defaultRows = ['tracker', 'total-supply', 'decimals', 'owner', 'balance']

const formBalance = computed(() => {
  return new BN(balance.value).fromFraction(erc20?.decimals.value).toString()
})

const isLoaded = ref(false)

const formOverviewData = ref({
  isLoaded,
  rows: overviewRows,
})

const headingData = {
  title: t('product-edit.erc20-common.title'),
  subtitle: `${t('product-prefix.erc20')} ${post?.title}`,
  description: t('product-edit.erc20-common.description'),
  overviewLbl: t('product-edit.erc20-common.overview'),
}

const init = async () => {
  emits(EVENTS.init)

  erc20?.init(route.params.contractAddress as string)

  props.overviewRows?.forEach(item =>
    overviewRows.value.splice(item.index, 0, item.row),
  )

  if (provider.value.selectedAddress) {
    ;[balance.value] = (await Promise.all([
      erc20.balanceOf(provider.value.selectedAddress),
      erc20.loadDetails(),
    ])) as string[]
  }

  overviewRows.value.forEach(item => {
    if (!defaultRows.includes(item.id)) return

    if (item.id === 'tracker') {
      item.value = `${erc20?.name.value} (${erc20?.symbol.value})`
    } else if (item.type === OVERVIEW_ROW.amount) {
      item.value = formatAmount(
        item.id === 'balance'
          ? balance.value
          : (erc20[toCamelCase(item.id)].value as string),
        erc20?.decimals.value,
        erc20?.symbol.value,
      )
    } else {
      item.value = erc20[toCamelCase(item.id)].value as string
    }
  })

  props?.writeForms?.forEach(item =>
    write.value.splice(item.index, 0, { slot: item.slot }),
  )

  isLoaded.value = true
}

const updateBalance = async () => {
  if (!overviewRows.value || !provider.value.selectedAddress) return

  overviewRows.value[
    overviewRows.value.map(i => i.id).indexOf('balance')
  ].value = formatAmount(
    (await erc20?.balanceOf(provider.value.selectedAddress)) as string,
    erc20?.decimals.value,
    erc20?.symbol.value,
  )
}

const updateOwner = async () => {
  if (!overviewRows.value) return

  await erc20?.updateOwner()
  overviewRows.value[overviewRows.value.map(i => i.id).indexOf('owner')].value =
    erc20?.owner.value as string
}

watch(
  () => provider.value.selectedAddress,
  () => {
    init()
  },
)

init()
</script>

<template>
  <base-edit-form :heading-data="headingData" :overview="formOverviewData">
    <template #tabFirst>
      <allowance-form :token="erc20" />
      <balance-form :token="erc20" />
    </template>
    <template #tabSecond>
      <div class="app__common-form" v-for="(form, index) in write" :key="index">
        <approve-form v-if="form === WRITE_FORMS.approve" :token="erc20" />
        <transfer-form
          v-else-if="form === WRITE_FORMS.transfer"
          :token="erc20"
          :balance="formBalance"
          @change-balance="updateBalance"
        />
        <transfer-from-form
          v-else-if="form === WRITE_FORMS.transferFrom"
          :token="erc20"
          @change-balance="updateBalance"
        />
        <transfer-ownership-form
          v-else-if="form === WRITE_FORMS.transferOwnership"
          :token="erc20"
          @change-owner="updateOwner"
        />
        <upgrade-to-form
          v-else-if="form === WRITE_FORMS.upgradeTo"
          :token="erc20"
        />
        <slot
          v-else-if="typeof form === 'object'"
          :name="form.slot"
          :update-balance="updateBalance"
          :balance="formBalance"
        />
      </div>
    </template>
  </base-edit-form>
</template>
