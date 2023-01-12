<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { i18n } from '@/localization'
import { required } from '@/validators'
import { BaseDeployForm } from '@/modules/forms'
import { OverviewRowWithId, Input } from '@/modules/types'
import { OVERVIEW_ROW } from '@/modules/enums'
import { useProduct } from '@/composables'
import postsData from '@/assets/posts.json'
import { Post } from '@/types'

const props = defineProps<{
  deployArray?: {
    id: string
    index: number
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

const route = useRoute()

const posts = postsData as unknown as Post[]
const post = posts.find(el => el.id === route.params.id)

const { t } = i18n.global

const product = useProduct()

const isSuccessModalShown = ref(false)

const potentialContractAddress = ref('')
const txProcessing = ref(false)

const deployArray = ref<string[]>(['name', 'symbol'])

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
    id: 'contract',
    name: t('product-deploy.modal.contract-lbl'),
    value: '',
    type: OVERVIEW_ROW.address,
  },
])

const init = () => {
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
    deployArray.value.splice(item.index, 0, item.id)
  })
}

const headingData = {
  subtitle:
    props.headingData?.subtitle ??
    `${t('product-prefix.erc721')} ${post?.title}`,
  description:
    props.headingData?.description ??
    t('product-deploy.erc721-common.description'),
}

const buttonData = {
  label: t('product-deploy.erc721-common.btn-lbl'),
  isHidden: txProcessing,
}

const modalData = {
  potentialContractAddress,
  rows: overviewRows,
  txt: {
    description: t('product-deploy.erc721-common.deploy-success-message'),
  },
}

const categoriesData = [
  {
    title: t('product-deploy.erc721-common.token-group'),
    inputs: [
      {
        name: 'name',
        label: t('product-deploy.erc721-common.name-lbl'),
        tooltip: t('product-deploy.erc721-common.name-info'),
        validators: [required],
      },
      {
        name: 'symbol',
        label: t('product-deploy.erc721-common.symbol-lbl'),
        tooltip: t('product-deploy.erc721-common.symbol-info'),
        validators: [required],
      },
    ] as Input[],
  },
]

const submit = async (values: Map<string, string>) => {
  if (!(values instanceof Map)) return
  const paymentTokenAddress = values.get('payment-token-addr') as string
  const productPrice = values.get('product-price') as string
  txProcessing.value = true

  const args = ref<unknown[]>([])
  deployArray.value.forEach(item => args.value.push(values.get(item)))

  potentialContractAddress.value = await product.deploy(
    route.params.id as string,
    productPrice,
    paymentTokenAddress,
    args.value,
  )

  if (!potentialContractAddress.value) {
    txProcessing.value = false
    return
  }

  overviewRows.value.forEach(item => {
    if (item.id === 'contract') {
      item.value = potentialContractAddress.value
    } else if (item.type === OVERVIEW_ROW.amount)
      item.value = `${values.get(item.name)} ${values.get('symbol')}`
    else {
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
