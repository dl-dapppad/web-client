<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ROUTE_NAMES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { AppBlock, AppButton, Tabs, LinkCopy } from '@/common'
import { TransferOwnershipForm, UpgradeToForm } from '@/forms'
import { formatAmount, txWrapper } from '@/helpers'
import { OVERVIEW_ROW } from '@/modules/enums'
import { OverviewRow } from '@/modules/types'
import {
  BalanceForm,
  // ApproveForm,
  // AllowanceForm,
  TransferForm,
  TransferFromForm,
} from '@/modules/erc20/forms'
import { EditOverview } from '@/modules/common'
import { useProductErc20 } from '../composables/use-product-erc20'
import { required, isAddress, numeric } from '@/validators'
import { BN } from '@/utils'

import { ModuleForm } from '@/modules/common'
import { RESULT_TYPES } from '@/modules/enums'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'erc20.title': 'Editing',
      'erc20.subtitle':
        'Editing your product smart contract parameters on chain. After each edition transaction is initiated. After transaction is added to the blockchain new parameters take effect.',
      'erc20.total': 'Total supply',
      'erc20.tracker': 'Token tracker',
      'erc20.owner': 'Owner address',
      'erc20.decimals': 'Decimals',
      'erc20.balance': 'Your balance',
      'erc20.interaction': 'Interaction',

      'allowance-form.title-lbl': 'Allowance',
      'allowance-form.title-info':
        'Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through transfer. This value changes when `approve` or `transferFrom` are called',
      'allowance-form.owner-lbl': 'Owner',
      'allowance-form.owner-info': 'Enter the token holder address',
      'allowance-form.spender-lbl': 'Spender',
      'allowance-form.spender-info': 'Enter the spender address',
      'allowance-form.btn-lbl': 'Read',
      'approve-form.title-lbl': 'Approve',
      'approve-form.title-info':
        // eslint-disable-next-line prettier/prettier
        'Sets `amount` as the allowance of `spender` over the caller\'s tokens',
      'approve-form.spender-lbl': 'Spender',
      'approve-form.spender-info': 'Enter the spender address',
      'approve-form.amount-lbl': 'Amount',
      'approve-form.amount-info': 'Enter the approved amount',
      'approve-form.btn-lbl': 'Write',
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
const overviewRows = ref<Array<OverviewRow>>([
  {
    name: t('erc20.tracker'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('erc20.total'),
    value: '',
    type: OVERVIEW_ROW.amount,
  },
  {
    name: t('erc20.decimals'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    name: t('erc20.owner'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
  {
    name: t('erc20.balance'),
    value: '',
    type: OVERVIEW_ROW.amount,
  },
])
const balance = ref('0')

const router = useRouter()
const route = useRoute()
const erc20 = useProductErc20(route.params.contractAddress as string)

const isLoaded = ref(false)

const init = async () => {
  erc20.init(route.params.contractAddress as string)

  await erc20.loadDetails()

  if (provider.value.selectedAddress) {
    await Promise.all([
      erc20.loadDetails(),
      erc20.balanceOf(provider.value.selectedAddress),
    ]).then(res => {
      balance.value = res[1]

      return
    })
  }

  overviewRows.value[0].value = `${erc20.name.value} (${erc20.symbol.value})`
  overviewRows.value[1].value = formatAmount(
    erc20.totalSupply.value,
    erc20.decimals.value,
    erc20.symbol.value,
  )
  overviewRows.value[2].value = String(erc20.decimals.value)
  overviewRows.value[3].value = erc20.owner.value
  overviewRows.value[4].value = formatAmount(
    balance.value,
    erc20.decimals.value,
    erc20.symbol.value,
  )

  isLoaded.value = true
}

const updateBalance = async () => {
  if (!overviewRows.value || !provider.value.selectedAddress) return

  overviewRows.value[4].value = formatAmount(
    await erc20.balanceOf(provider.value.selectedAddress),
    erc20.decimals.value,
    erc20.symbol.value,
  )
}

const updateOwner = async () => {
  if (!overviewRows.value) return

  await erc20.updateOwner()
  overviewRows.value[3].value = erc20.owner.value
}

init()

const allowanceFormData = {
  title: t('allowance-form.title-lbl'),
  titleTooltip: t('allowance-form.title-info'),
  inputs: [
    {
      label: t('allowance-form.owner-lbl'),
      tooltip: t('allowance-form.owner-info'),
      validators: [required, isAddress],
    },
    {
      label: t('allowance-form.spender-lbl'),
      tooltip: t('allowance-form.spender-info'),
      validators: [required, isAddress],
    },
  ],
  button: t('allowance-form.btn-lbl'),
}

const allowanceFormResult = {
  type: RESULT_TYPES.balanceWithCurr,
  data: ref(''),
}

const handleAllowanceForm = async ([owner, spender]: string[]) => {
  allowanceFormResult.data.value = formatAmount(
    await erc20.allowance(owner, spender),
    erc20.decimals.value,
    erc20.symbol.value,
  )
}

const approveFormTxProcessing = ref(false)

const approveFormData = {
  title: t('approve-form.title-lbl'),
  titleTooltip: t('approve-form.title-info'),
  inputs: [
    {
      label: t('approve-form.spender-lbl'),
      tooltip: t('approve-form.spender-info'),
      validators: [required, isAddress],
    },
    {
      label: t('approve-form.amount-lbl'),
      tooltip: t('approve-form.amount-info'),
      validators: [required, numeric],
    },
  ],
  button: t('approve-form.btn-lbl'),
  buttonDisabled: approveFormTxProcessing,
}

const handleApproveForm = async ([spender, amount]: string[]) => {
  approveFormTxProcessing.value = true

  await txWrapper(erc20.approve, {
    spender: spender,
    amount: new BN(amount).toFraction(erc20.decimals.value).toString(),
  })

  approveFormTxProcessing.value = false
}
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
          @click="
            router.push({
              name: ROUTE_NAMES.product,
              params: {
                id: route.params.id,
              },
            })
          "
        />
        <h2 class="app__module-title">
          {{ t('erc20.title') }}
        </h2>
        <link-copy
          :address="erc20.address.value"
          class="app__link--big app__link--secondary"
        />
      </div>
      <span class="app__module-subtitle">
        {{ t('erc20.subtitle') }}
      </span>
    </div>
    <edit-overview :is-loaded="isLoaded" :rows="overviewRows"></edit-overview>
    <div>
      <h3 class="app__module-block-title">
        {{ t('erc20.interaction') }}
      </h3>
      <tabs v-model="currentTabNumber" :tabs-data="FORM_TABS" />
      <app-block>
        <div
          v-if="currentTabNumber === FORM_TABS[0].number"
          class="app__module-content"
        >
          <module-form
            :form-data="allowanceFormData"
            :result="allowanceFormResult"
            @submit="handleAllowanceForm"
          />
          <!-- <allowance-form :token="erc20" /> -->
          <balance-form :token="erc20"></balance-form>
        </div>
        <div
          v-if="currentTabNumber === FORM_TABS[1].number"
          class="app__module-content"
        >
          <module-form
            :form-data="approveFormData"
            @submit="handleApproveForm"
          />
          <!-- <approve-form :token="erc20"></approve-form> -->
          <transfer-form
            :token="erc20"
            :balance="Number(formatAmount(balance, erc20.decimals.value))"
            @change-balance="updateBalance"
          />
          <transfer-from-form :token="erc20" @change-balance="updateBalance" />
          <transfer-ownership-form :token="erc20" @change-owner="updateOwner" />
          <upgrade-to-form :token="erc20" />
        </div>
      </app-block>
    </div>
  </div>
</template>
