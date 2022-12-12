<script lang="ts" setup>
import { ref, computed, Ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ValidationRule } from '@vuelidate/core'

import {
  AppBlock,
  AppButton,
  Collapse,
  Icon,
  InfoTooltip,
  Loader,
  Modal,
} from '@/common'
import { SelectField, InputField } from '@/fields'
import { Product, useFormValidation } from '@/composables'
import { formatAmount, getEmptyChain, getChain } from '@/helpers'
import { config } from '@/config'
import { Chain } from '@/types'
import { BN } from '@/utils'
import { required } from '@/validators'
import { useWeb3ProvidersStore } from '@/store'

import { SCHEMES } from '@/common/Loader.vue'
import { DeploySuccessMessage } from '@/modules/common'
import { DeployMetadata } from '@/modules/common'
import { Input, ModalText, UseForm } from '@/modules/types'
import {
  getSelectedTokenInfo,
  getAvailableTokenList,
  getProduct,
} from '@/helpers'

const router = useRouter()
const route = useRoute()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const props = defineProps<{
  isSuccessModalShown?: boolean
  headingData?: {
    title?: string
    subtitle?: string
    description?: string
  }
  button?: {
    label?: string
    isHidden?: Ref<boolean>
  }
  modal: {
    metadata: Ref<DeployMetadata>
    potentialContractAddress: Ref<string>
    txt?: ModalText
  }
  categories: {
    title: string
    inputs: Input[]
  }[]
}>()

enum EVENTS {
  submit = 'submit',
  updateisSuccessModalShown = 'update:isSuccessModalShown',
}

const emits = defineEmits<{
  (e: EVENTS.submit, data: string[][]): void
  (e: EVENTS.updateisSuccessModalShown, val: boolean): void
}>()

const paymentTokens = ref<Record<string, Array<string>>>({
  symbols: [],
  addresses: [],
})
const productPaymentToken = ref({
  balance: '',
  symbol: '',
  decimals: 0,
})
const selectedPaymentToken = ref({
  balance: '',
  symbol: '',
  decimals: 0,
})
const product = ref<Product>()
const useFormArray = [] as UseForm[]
const chain = ref<Chain>(getEmptyChain())
chain.value = getChain(provider.value.chainId)

// data to useForm
const form = reactive({
  data: [['']] as string[][],
})
const validators: {
  [key: string]: ValidationRule
}[][] = [[{ required }]]

// filling useForm data
props.categories.forEach((category, i) => {
  form.data.push([])
  validators.push([])

  category.inputs.forEach((input, k) => {
    form.data[i + 1].push(input.value ?? '')
    validators[i + 1].push({ required })

    if (!input.validators) return
    input.validators.forEach(validator => {
      validators[i + 1][k][validator?.$params?.type] = validator
    })
  })
})

// filling useForm array
form.data.forEach((category, i) => {
  useFormArray.push({} as UseForm)

  const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
    category,
    validators[i],
  )

  useFormArray[i].getFieldErrorMessage = getFieldErrorMessage
  useFormArray[i].touchField = touchField
  useFormArray[i].isFieldsValid = isFieldsValid
})

const isAllFieldsValid = computed(() => {
  let result = true
  useFormArray.forEach(
    UseFormObj => (result &&= UseFormObj.isFieldsValid.value),
  )
  return result
})

const isBalanceInsuficient = computed(() =>
  product.value?.currentPrice
    ? new BN(product.value?.currentPrice).compare(
        selectedPaymentToken.value.balance,
      ) === 1
    : false,
)

const submit = () => {
  const result = JSON.parse(JSON.stringify(form.data))
  result[0][0] =
    paymentTokens.value.addresses[
      paymentTokens.value.symbols.findIndex(
        symbol => symbol === form.data[0][0],
      )
    ]
  emits(EVENTS.submit, result)
}

const updateIsShownModal = (val: boolean) => {
  emits(EVENTS.updateisSuccessModalShown, val)
}

const updatePayment = async (val: string | number) => {
  form.data[0][0] = val as string

  const { symbol, decimals, balance } = await getSelectedTokenInfo(
    paymentTokens.value.addresses[
      paymentTokens.value.symbols.findIndex(symbol => symbol === val)
    ],
  )

  selectedPaymentToken.value = {
    ...selectedPaymentToken.value,
    symbol,
    decimals: Number(decimals),
    balance,
  }
}

const init = async () => {
  const { symbols, addresses } = await getAvailableTokenList()

  paymentTokens.value.symbols = symbols
  paymentTokens.value.addresses = addresses

  const alias = config.PRODUCT_ALIASES[route.params.id as string]
  product.value = await getProduct(alias)

  if (!addresses.length) return

  const { symbol, decimals, balance } = await getSelectedTokenInfo(addresses[0])

  productPaymentToken.value.symbol = symbol
  productPaymentToken.value.decimals = Number(decimals)
  productPaymentToken.value.balance = balance
}

onMounted(() => init())
</script>

<template>
  <form @submit.prevent="submit">
    <div class="app__module-heading">
      <div class="app__module-title-wrp">
        <app-button
          class="app__module-back-btn"
          :icon-right="$icons.arrowLeft"
          modification="border-circle"
          color="tertiary"
          @click="
            router.push({
              name: $routes.product,
              params: { id: route.params.id },
            })
          "
        />
        <h2 class="app__module-title">
          {{
            headingData?.title
              ? headingData.title
              : $t('deploy-form.default-title')
          }}
        </h2>
      </div>
      <span class="app__module-subtitle">
        {{
          headingData?.subtitle
            ? headingData.subtitle
            : $t('deploy-form.default-subtitle')
        }}
      </span>
      <span class="app__module-description">
        {{
          headingData?.description
            ? headingData.description
            : $t('deploy-form.default-description')
        }}
      </span>
    </div>
    <app-block
      v-if="chain?.id === '5' && isBalanceInsuficient"
      :class="{
        'app__module-content-wrp': chain?.id === '5' && isBalanceInsuficient,
      }"
    >
      <div class="app__module-content">
        <div class="app__module-content-inner">
          <div class="app__metadata-row app__metadata-row--mobile-break-line">
            <span class="app__module-span">
              {{ $t('deploy-form.empty-balance-lbl') }}</span
            >
            <app-button
              class="app__submit-btn"
              :text="$t('deploy-form.mint-tokens-btn')"
            />
          </div>
        </div>
      </div>
    </app-block>
    <app-block
      :class="{
        'app__module-content-wrp': !(chain?.id === '5' && isBalanceInsuficient),
      }"
    >
      <div class="app__module-content">
        <div class="app__module-content-inner">
          <collapse
            class="app__form-control"
            is-opened-by-default
            :is-close-by-click-outside="false"
          >
            <template #head="{ collapse }">
              <app-button
                class="app__module-content-title"
                scheme="default"
                color="default"
                size="default"
                @click="collapse.toggle"
              >
                <icon
                  class="app__title-icon"
                  :name="
                    collapse.isOpen
                      ? $icons.arrowUpTriangle
                      : $icons.arrowDownTriangle
                  "
                />
                {{ $t('deploy-form.payment-group') }}
              </app-button>
            </template>
            <template #default>
              <div class="app__form-control app__collapsed-fields">
                <div class="app__select-wrp">
                  <div class="app__field-row">
                    <select-field
                      class="app__module-field"
                      :model-value="form.data[0][0]"
                      :label="$t('deploy-form.payment-lbl')"
                      :value-options="paymentTokens.symbols"
                      @update:model-value="updatePayment"
                    />
                    <div class="app__field-tooltip">
                      <info-tooltip :text="$t('deploy-form.payment-info')" />
                    </div>
                  </div>
                  <template
                    v-if="selectedPaymentToken.balance && product?.currentPrice"
                  >
                    <div class="app__row">
                      <span class="app__row-title">
                        {{ $t('deploy-form.product-price') }}
                      </span>
                      <div class="app__balance">
                        {{
                          formatAmount(
                            product.currentPrice,
                            productPaymentToken.decimals,
                          )
                        }}
                        <span>{{ productPaymentToken.symbol }}</span>
                      </div>
                    </div>
                    <div v-if="selectedPaymentToken.balance" class="app__row">
                      <span class="app__row-title">
                        {{ $t('deploy-form.payment-balance') }}
                      </span>
                      <div
                        class="app__balance app__balance-small"
                        :class="{
                          'app__balance-insufficient': isBalanceInsuficient,
                        }"
                      >
                        {{
                          formatAmount(
                            selectedPaymentToken.balance,
                            selectedPaymentToken.decimals,
                          )
                        }}
                        <span>{{ selectedPaymentToken.symbol }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </collapse>
          <collapse
            v-for="(category, categoryInd) of categories"
            class="app__form-control"
            is-opened-by-default
            :is-close-by-click-outside="false"
            :key="categoryInd"
          >
            <template #head="{ collapse }">
              <app-button
                class="app__module-content-title"
                scheme="default"
                color="default"
                size="default"
                @click="collapse.toggle"
              >
                <icon
                  class="app__title-icon"
                  :name="
                    collapse.isOpen
                      ? $icons.arrowUpTriangle
                      : $icons.arrowDownTriangle
                  "
                />
                {{ category.title }}
              </app-button>
            </template>
            <template #default>
              <div class="app__form-control app__collapsed-fields">
                <div class="app__form-control">
                  <div
                    v-for="(input, inputInd) of category.inputs"
                    class="app__field-row"
                    :key="inputInd"
                  >
                    <input-field
                      class="app__module-field"
                      scheme="secondary"
                      v-model="form.data[categoryInd + 1][inputInd]"
                      :label="input.label"
                      :error-message="
                        useFormArray[categoryInd + 1].getFieldErrorMessage(
                          `${inputInd}`,
                        )
                      "
                      @blur="
                        useFormArray[categoryInd + 1].touchField(`${inputInd}`)
                      "
                    />
                    <div class="app__field-tooltip">
                      <info-tooltip
                        :text="input.tooltip ? input.tooltip : ''"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </collapse>
          <app-button
            v-if="!button?.isHidden?.value"
            class="app__submit-btn app__submit-btn--cutted"
            type="submit"
            :text="
              button?.label ? button.label : $t('deploy-form.default-btn-lbl')
            "
            size="small"
            :disabled="isBalanceInsuficient || !isAllFieldsValid"
          />
          <div v-else class="app__deploy-loader">
            <loader :scheme="SCHEMES.cubes" />
            <p>{{ $t('product-deploy.tx-processing') }}</p>
            <p>{{ $t('product-deploy.tx-processing-description') }}</p>
          </div>
        </div>
      </div>
    </app-block>
    <modal
      :is-shown="isSuccessModalShown"
      @update:is-shown="updateIsShownModal"
    >
      <template #default>
        <deploy-success-message
          :deploy-metadata="modal.metadata.value"
          :txt="modal.txt"
          @submit="
            () => {
              updateIsShownModal(false)
              router.push({
                name: $routes.productEdit,
                params: {
                  id: route.params.id,
                  contractAddress: modal.potentialContractAddress.value,
                },
              })
            }
          "
          @close="updateIsShownModal(false)"
        />
      </template>
    </modal>
  </form>
</template>

<style lang="scss" scoped></style>
