<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { AppBlock, AppButton, Tabs, EditOverview, LinkCopy } from '@/common'
import { TransferOwnershipForm, UpgradeToForm } from '@/forms'
import { OVERVIEW_ROW } from '@/enums'
import { OverviewRow } from '@/types'
import {
  BalanceForm,
  MintForm,
  ApproveForm,
  ApproveAllForm,
  SafeTransferForm,
  OwnerForm,
  SetBaseUriForm,
  TokenUriForm,
} from '../../forms'
import { useProductErc721 } from '../composables/use-product-erc721'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc721.title': 'Editing',
      'erc721.subtitle':
        'Editing your product smart contract parameters on chain. After each edition transaction is initiated. After transaction is added to the blockchain new parameters take effect.',
      'erc721.tracker': 'Token tracker',
      'erc721.owner': 'Owner address',
      'erc721.balance': 'Your balance',
      'erc721.interaction': 'Interaction',
      'erc721.baseURI': 'Base URI',
      'erc721.baseURI-default-value': 'Not set yet',
    },
  },
})

const FORM_TABS = [
  {
    title: 'Read',
    number: 1,
  },
  {
    title: 'Write',
    number: 2,
  },
]

const currentTabNumber = ref(FORM_TABS[0].number)
const overviewRows = ref<Array<OverviewRow>>()

const router = useRouter()
const route = useRoute()
const erc721 = useProductErc721(route.params.contractAddress as string)

const init = async () => {
  erc721.init(route.params.contractAddress as string)

  let balance = '0'
  if (provider.value.selectedAddress) {
    await Promise.all([
      erc721.loadDetails(),
      erc721.balanceOf(provider.value.selectedAddress),
    ]).then(res => {
      balance = res[1]

      return
    })
  }

  overviewRows.value = [
    {
      name: t('erc721.tracker'),
      value: `${erc721.name.value} (${erc721.symbol.value})`,
      type: OVERVIEW_ROW.default,
    },
    {
      name: t('erc721.owner'),
      value: erc721.owner.value,
      type: OVERVIEW_ROW.address,
    },
    {
      name: t('erc721.baseURI'),
      value:
        erc721.baseURI.value === ''
          ? t('erc721.baseURI-default-value')
          : erc721.baseURI.value,
      type: OVERVIEW_ROW.default,
    },
    {
      name: t('erc721.balance'),
      value: balance,
      type: OVERVIEW_ROW.default,
    },
  ]
}

const updateBalance = async () => {
  if (!overviewRows.value || !provider.value.selectedAddress) return

  overviewRows.value[3].value = await erc721.balanceOf(
    provider.value.selectedAddress,
  )
}

const updateOwner = async () => {
  if (!overviewRows.value) return

  await erc721.updateOwner()
  overviewRows.value[1].value = erc721.owner.value
}

const updateBaseURI = async () => {
  if (!overviewRows.value) return

  await erc721.updateBaseURI()
  overviewRows.value[2].value = erc721.baseURI.value
}

init()
</script>

<template>
  <div class="erc20-edit-form">
    <div class="edit-form__titles-wrp">
      <div class="app__module-title-wrp">
        <app-button
          type="button"
          class="app__module-back-btn"
          :icon-right="$icons.arrowLeft"
          modification="border-circle"
          color="tertiary"
          @click="router.go(-1)"
        />
        <h2 class="app__module-title">
          {{ t('erc721.title') }}
        </h2>
        <link-copy :address="erc721.address.value" class="app__link--big" />
      </div>
      <span class="app__module-subtitle">
        {{ t('erc721.subtitle') }}
      </span>
    </div>
    <edit-overview :rows="overviewRows" />
    <div>
      <h3 class="app__module-block-title">
        {{ t('erc721.interaction') }}
      </h3>
      <tabs v-model="currentTabNumber" :tabs-data="FORM_TABS" />
      <app-block>
        <div
          v-if="currentTabNumber === FORM_TABS[0].number"
          class="app__module-content"
        >
          <balance-form :token="erc721" />
          <owner-form :token="erc721" />
          <token-uri-form :token="erc721" />
        </div>
        <div
          v-if="currentTabNumber === FORM_TABS[1].number"
          class="app__module-content"
        >
          <set-base-uri-form :token="erc721" @change-base-uri="updateBaseURI" />
          <approve-form :token="erc721" />
          <approve-all-form :token="erc721" />
          <mint-form :token="erc721" @change-balance="updateBalance" />
          <safe-transfer-form :token="erc721" />
          <transfer-ownership-form
            :token="erc721"
            @change-owner="updateOwner"
          />
          <upgrade-to-form :token="erc721" />
        </div>
      </app-block>
    </div>
  </div>
</template>
