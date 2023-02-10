<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { i18n } from '@/localization'
import { useWeb3ProvidersStore } from '@/store'
import {
  required,
  isAddress,
  numeric,
  maxValue,
  greaterThen,
  maxLength,
} from '@/validators'
import { BN } from '@/utils'
import { OverviewRowWithId, Input } from '@/modules/types'
import { OVERVIEW_ROW } from '@/modules/enums'
import { BaseDeployForm } from '@/modules/forms'
import { useProduct } from '@/composables'
import postsData from '@/assets/posts.json'
import { Post } from '@/types'
import { Bus } from '@/helpers'

const props = defineProps<{
  deployArray?: {
    id: string
    index: number
    isConvertingToFraction?: boolean
  }[]
  additionalModalRows?: {
    row: OverviewRowWithId
    index: number
  }[]
  headingData?: {
    subtitle?: string
    description?: string
  }
  categories?: {
    index: number
    inputs: {
      index: number
      input: Input
    }[]
  }[]
}>()

const { t } = i18n.global
const { provider } = storeToRefs(useWeb3ProvidersStore())
const route = useRoute()

const product = useProduct()

const posts = postsData as unknown as Post[]
const post = posts.find(el => el.id === route.params.id)

const potentialContractAddress = ref('')
const txProcessing = ref(false)
const isSuccessModalShown = ref(false)

const initializeArgs = ref<
  {
    id: string
    isConvertingToFraction?: boolean
  }[]
>([
  { id: 'name' },
  { id: 'symbol' },
  { id: 'mint-amount', isConvertingToFraction: true },
  { id: 'mint-receiver' },
  { id: 'decimals' },
])

const overviewRows = ref<Array<OverviewRowWithId>>([
  {
    id: 'name',
    name: t('product-deploy.modal.name-lbl'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    id: 'symbol',
    name: t('product-deploy.modal.symbol-lbl'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    id: 'decimals',
    name: t('product-deploy.modal.decimals-lbl'),
    value: '',
    type: OVERVIEW_ROW.default,
  },
  {
    id: 'mint-amount',
    name: t('product-deploy.modal.mint-amount-lbl'),
    value: '',
    type: OVERVIEW_ROW.amount,
  },
  {
    id: 'mint-receiver',
    name: t('product-deploy.modal.mint-receiver-lbl'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
  {
    id: 'contract',
    name: t('product-deploy.modal.contract-lbl'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
])

const headingData = {
  subtitle:
    props.headingData?.subtitle ??
    `${t('product-prefix.erc20')} ${post?.title}`,
  description:
    props.headingData?.description ??
    t('product-deploy.erc20-common.description'),
}

const buttonData = {
  label: t('product-deploy.erc20-common.btn-lbl'),
  isHidden: txProcessing,
}

const modalData = {
  potentialContractAddress,
  rows: overviewRows,
  txt: {
    description: t('product-deploy.erc20-common.deploy-success-message'),
  },
}

const categoriesData = [
  {
    title: t('product-deploy.erc20-common.token-group'),
    inputs: [
      {
        name: 'name',
        label: t('product-deploy.erc20-common.name-lbl'),
        tooltip: t('product-deploy.erc20-common.name-info'),
        validators: [required, maxLength(128)],
      },
      {
        name: 'symbol',
        label: t('product-deploy.erc20-common.symbol-lbl'),
        tooltip: t('product-deploy.erc20-common.symbol-info'),
        validators: [required, maxLength(32)],
      },
      {
        name: 'decimals',
        label: t('product-deploy.erc20-common.decimals-lbl'),
        tooltip: t('product-deploy.erc20-common.decimals-info'),
        validators: [required, numeric, maxValue(42)],
      },
    ] as Input[],
  },
  {
    title: t('product-deploy.erc20-common.mint-group'),
    inputs: [
      {
        name: 'mint-receiver',
        value: provider.value.selectedAddress as string,
        label: t('product-deploy.erc20-common.mint-receiver-lbl'),
        tooltip: t('product-deploy.erc20-common.mint-receiver-info'),
        validators: [required, isAddress],
      },
      {
        name: 'mint-amount',
        label: t('product-deploy.erc20-common.mint-amount-lbl'),
        tooltip: t('product-deploy.erc20-common.mint-amount-info'),
        validators: [required, numeric],
      },
    ] as Input[],
  },
]

const init = () => {
  if (!route.params.id.includes('mint'))
    categoriesData[1].inputs[1].validators?.push(greaterThen(0))

  props.additionalModalRows?.forEach(item =>
    overviewRows.value.splice(item.index, 0, item.row),
  )

  props?.categories?.forEach(category => {
    category.inputs.forEach(inputObj =>
      categoriesData[category.index].inputs.splice(
        inputObj.index,
        0,
        inputObj.input,
      ),
    )
  })

  props.deployArray?.forEach(item => {
    initializeArgs.value.splice(item.index, 0, {
      id: item.id,
      isConvertingToFraction: item.isConvertingToFraction ?? false,
    })
  })
}

const submit = async (values: Map<string, string>) => {
  if (!(values instanceof Map)) return

  const paymentTokenAddress = values.get('payment-token') as string
  const productPrice = values.get('product-price') as string
  const decimals = values.get('decimals') as string

  // Mint amount can't be more than (2 ** 256 - 1)*(0.1 ** `decimals`)
  if (
    new BN(values.get('mint-amount') as string).compare(
      new BN(2).pow(256).sub(1).fromFraction(Number(decimals)),
    ) === 1
  ) {
    Bus.warning(t('product-deploy.errors.wrong-mint-amount'))
    return
  }

  if (
    route.params.id.includes('cap') &&
    new BN(values.get('mint-amount') as string).compare(
      values.get('cap') as string,
    ) === 1
  ) {
    Bus.warning(t('product-deploy.errors.mint-amount-more-than-cap'))
    return
  }

  // Start setup deploy args for `init` method in contract
  const args: string[] = []
  initializeArgs.value.forEach(item => {
    const deployArg = ref<string>(values.get(item.id) as string)
    if (item.isConvertingToFraction) {
      deployArg.value = new BN(deployArg.value)
        .toFraction(Number(decimals))
        .toString()
    }
    args.push(deployArg.value)
  })
  // End

  const discountAliases: string[] = []
  const discountValues: string[] = []
  for (const key of values.keys()) {
    if (key.includes('0x')) {
      discountAliases.push(key)
      discountValues.push(values.get(key) as string)
    }
  }

  txProcessing.value = true
  potentialContractAddress.value = await product.deploy(
    route.params.id as string,
    productPrice,
    paymentTokenAddress,
    args,
    discountAliases,
    discountValues,
  )

  if (!potentialContractAddress.value) {
    txProcessing.value = false
    return
  }

  overviewRows.value.forEach(item => {
    if (item.id === 'contract') {
      item.value = potentialContractAddress.value
    } else if (item.type === OVERVIEW_ROW.amount) {
      item.value = `${values.get(item.id)} ${values.get('symbol')}`
    } else {
      item.value = values.get(item.id) as string
    }
  })

  isSuccessModalShown.value = true
  txProcessing.value = false
}

init()
</script>

<template>
  <base-deploy-form
    :heading-data="headingData"
    :button="buttonData"
    :modal="modalData"
    :categories="categoriesData"
    v-model:is-success-modal-shown="isSuccessModalShown"
    @submit="submit"
  />
</template>
