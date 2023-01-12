<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { i18n } from '@/localization'
import { useWeb3ProvidersStore } from '@/store'
import { TransferOwnershipForm, UpgradeToForm } from '@/modules/forms'
import { OVERVIEW_ROW } from '@/modules/enums'
import { OverviewRowWithId } from '@/modules/types'
import { toCamelCase } from '@/helpers'
import {
  BalanceForm,
  MintForm,
  ApproveForm,
  ApproveAllForm,
  SafeTransferForm,
  OwnerForm,
  SetBaseUriForm,
  TokenUriForm,
} from '@/modules/erc721/forms'
import { BaseEditForm } from '@/modules/forms'
import { Post } from '@/types'
import { READ_FORMS, WRITE_FORMS } from '@/modules/erc721/enums'
import { useProduct } from '@/composables'

import postsData from '@/assets/posts.json'

const props = defineProps<{
  writeForms?: {
    slot: string
    index: number
  }[]
  readForms?: {
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

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = i18n.global
const route = useRoute()
const product = useProduct()

const posts = postsData as unknown as Post[]
const post = posts.find(el => el.id === route.params.id)

const erc721 = product.getUseOfErc721Product(route.params.id as string)
const isLoaded = ref(false)

const write = ref<
  (
    | WRITE_FORMS
    | {
        slot: string
      }
  )[]
>([
  WRITE_FORMS.setBaseUri,
  WRITE_FORMS.mint,
  WRITE_FORMS.approve,
  WRITE_FORMS.approveAll,
  WRITE_FORMS.safeTransfer,
  WRITE_FORMS.transferOwnership,
  WRITE_FORMS.upgradeTo,
])

const read = ref<
  (
    | READ_FORMS
    | {
        slot: string
      }
  )[]
>([READ_FORMS.balance, READ_FORMS.owner, READ_FORMS.tokenUri])

const overviewRows = ref<Array<OverviewRowWithId>>([
  {
    id: 'tracker',
    name: t('product-edit.erc721-common.tracker'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    id: 'owner',
    name: t('product-edit.erc721-common.owner'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
  {
    id: 'base-u-r-i',
    name: t('product-edit.erc721-common.baseURI'),
    value: '',
    type:
      erc721?.baseURI.value === '' ? OVERVIEW_ROW.default : OVERVIEW_ROW.link,
  },
  {
    id: 'balance',
    name: t('product-edit.erc721-common.balance'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
])

const init = async () => {
  emits(EVENTS.init)

  erc721?.init(route.params.contractAddress as string)

  await erc721?.loadDetails()

  overviewRows.value.forEach(async item => {
    if (item.id === 'tracker') {
      item.value = `${erc721?.name.value} (${erc721?.symbol.value})`
    } else if (item.id === 'balance') {
      if (provider.value.selectedAddress) {
        item.value = (await erc721?.balanceOf(
          provider.value.selectedAddress,
        )) as string
      }
    } else {
      item.value =
        erc721[toCamelCase(item.id)].value !== ''
          ? erc721[toCamelCase(item.id)].value
          : t(
              `product-edit.erc721-common.${toCamelCase(
                item.id,
              )}-default-value`,
            )
    }
  })

  props?.writeForms?.forEach(item =>
    write.value.splice(item.index, 0, { slot: item.slot }),
  )

  props?.readForms?.forEach(item =>
    read.value.splice(item.index, 0, { slot: item.slot }),
  )

  overviewRows.value[
    overviewRows.value.map(i => i.id).indexOf('base-u-r-i')
  ].type =
    erc721?.baseURI.value === '' ? OVERVIEW_ROW.default : OVERVIEW_ROW.link

  isLoaded.value = true
}

const updateBalance = async () => {
  if (!overviewRows.value || !provider.value.selectedAddress) return

  overviewRows.value[
    overviewRows.value.map(i => i.id).indexOf('balance')
  ].value = (await erc721?.balanceOf(provider.value.selectedAddress)) as string
}

const updateOwner = async () => {
  if (!overviewRows.value) return

  await erc721?.updateOwner()
  overviewRows.value[overviewRows.value.map(i => i.id).indexOf('owner')].value =
    erc721?.owner.value as string
}

const updateBaseURI = async () => {
  if (!overviewRows.value) return

  await erc721?.updateBaseURI()
  overviewRows.value[
    overviewRows.value.map(i => i.id).indexOf('base-u-r-i')
  ].value =
    erc721?.baseURI.value ??
    t('product-edit.erc721-common.baseURI-default-value')

  overviewRows.value[
    overviewRows.value.map(i => i.id).indexOf('base-u-r-i')
  ].type =
    erc721?.baseURI.value === '' ? OVERVIEW_ROW.default : OVERVIEW_ROW.link
}

const formOverviewData = ref({
  isLoaded,
  rows: overviewRows,
})

const headingData = {
  title: t('product-edit.erc721-common.title'),
  subtitle: `${t('product-prefix.erc721')} ${post?.title}`,
  description: t('product-edit.erc721-common.description'),
  overviewLbl: t('product-edit.erc721-common.overview'),
}

init()
</script>

<template>
  <base-edit-form :heading-data="headingData" :overview="formOverviewData">
    <template #tabFirst>
      <div class="app__common-form" v-for="(form, index) in read" :key="index">
        <balance-form v-if="form === READ_FORMS.balance" :token="erc721" />
        <owner-form v-else-if="form === READ_FORMS.owner" :token="erc721" />
        <token-uri-form
          v-else-if="form === READ_FORMS.tokenUri"
          :token="erc721"
        />
        <slot v-else-if="typeof form === 'object'" :name="form.slot" />
      </div>
    </template>
    <template #tabSecond>
      <div class="app__common-form" v-for="(form, index) in write" :key="index">
        <set-base-uri-form
          v-if="form === WRITE_FORMS.setBaseUri"
          :token="erc721"
          @change-base-uri="updateBaseURI"
        />
        <approve-form
          v-else-if="form === WRITE_FORMS.approve"
          :token="erc721"
        />
        <approve-all-form
          v-else-if="form === WRITE_FORMS.approveAll"
          :token="erc721"
        />
        <mint-form
          v-else-if="form === WRITE_FORMS.mint"
          :token="erc721"
          @change-balance="updateBalance"
        />
        <safe-transfer-form
          v-else-if="form === WRITE_FORMS.safeTransfer"
          :token="erc721"
        />
        <transfer-ownership-form
          v-else-if="form === WRITE_FORMS.transferOwnership"
          :token="erc721"
          @change-owner="updateOwner"
        />
        <upgrade-to-form
          v-else-if="form === WRITE_FORMS.upgradeTo"
          :token="erc721"
        />
        <slot
          v-else-if="typeof form === 'object'"
          :name="form.slot"
          :change-balance="updateBalance"
        />
      </div>
    </template>
  </base-edit-form>
</template>
