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
import {
  Product,
  useFormValidation,
  useErc20Mock,
  useFarming,
  useProduct,
} from '@/composables'
import { formatAmount, txWrapper } from '@/helpers'
import { config } from '@/config'
import { BN } from '@/utils'
import { required } from '@/validators'
import { useWeb3ProvidersStore } from '@/store'
import { ETHEREUM_CHAINS } from '@/enums'
import { SCHEMES } from '@/common/Loader.vue'
import { DeploySuccessMessage } from '@/modules/common'
import { Input, ModalText, OverviewRow, UseForm } from '@/modules/types'

const router = useRouter()
const route = useRoute()
const farming = useFarming()
const product = useProduct()

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
    rows: Ref<Array<OverviewRow>>
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
  (e: EVENTS.submit, data: string[]): void
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
  amount: '0',
})
const selectedPaymentToken = ref({
  balance: '',
  symbol: '',
  decimals: 0,
  amount: '0',
})
const selectedProduct = ref<Product>()
const useFormArray = [] as UseForm[]

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

const isBalanceInsuficient = computed(() => {
  if (!selectedProduct.value) return false

  const currentPrice = new BN(selectedProduct.value?.currentPrice)
    .fromFraction(productPaymentToken.value.decimals)
    .toString()
  const paymentBalance = new BN(selectedPaymentToken.value.balance)
    .fromFraction(selectedPaymentToken.value.decimals)
    .toString()

  return new BN(currentPrice).compare(paymentBalance) === 1
})

const submit = () => {
  let result: string[] = []
  JSON.parse(JSON.stringify(form.data)).map((el: string[]) => {
    result = result.concat(el)
  })

  result[0] =
    paymentTokens.value.addresses[
      paymentTokens.value.symbols.findIndex(symbol => symbol === result[0])
    ]

  emits(EVENTS.submit, result)
}

const updateIsShownModal = (val: boolean) => {
  emits(EVENTS.updateisSuccessModalShown, val)
}

const updatePayment = async (selectedSymbol: string | number) => {
  const selectedIndex = paymentTokens.value.symbols.findIndex(
    symbol => symbol === selectedSymbol,
  )
  const selectedAddress = paymentTokens.value.addresses[selectedIndex]

  let symbol, decimals, balance, amount
  if (selectedIndex === 0) {
    ;({ symbol, decimals, balance, amount } =
      await product.getSelectedPaymentTokenInfo(selectedAddress))

    selectedPaymentToken.value = {
      ...selectedPaymentToken.value,
      symbol,
      decimals: Number(decimals),
      balance,
      amount: selectedProduct.value?.currentPrice ?? '0',
    }
  } else {
    ;({ symbol, decimals, balance, amount } =
      await product.getSelectedPaymentTokenInfo(
        selectedAddress,
        true,
        selectedProduct.value?.currentPrice ?? '0',
      ))

    selectedPaymentToken.value = {
      ...selectedPaymentToken.value,
      symbol,
      decimals: Number(decimals),
      balance,
      amount,
    }
  }

  form.data[0][0] = selectedSymbol as string
  form.data[0][1] = selectedPaymentToken.value.amount
}

const mintToken = async () => {
  if (provider.value.chainId != ETHEREUM_CHAINS.goerli) return

  const tokenAddress =
    paymentTokens.value.addresses[
      paymentTokens.value.symbols.findIndex(
        symbol => symbol === form.data[0][0],
      )
    ]

  const erc20Mock = useErc20Mock()
  erc20Mock.init(tokenAddress)
  await erc20Mock.updateDecimals()

  await txWrapper(erc20Mock.mint, {
    to: provider.value.selectedAddress as string,
    amount: new BN('10000').toFraction(erc20Mock.decimals.value).toString(),
  })

  await updatePayment(form.data[0][0])
}

const init = async () => {
  const { symbols, addresses } = await product.getAvailablePaymentTokenList()

  paymentTokens.value.symbols = symbols
  paymentTokens.value.addresses = addresses

  const alias = config.PRODUCT_ALIASES[route.params.id as string]
  selectedProduct.value = await product.getProductInfo(alias)

  if (!addresses.length) return

  const { symbol, decimals, balance } =
    await product.getSelectedPaymentTokenInfo(addresses[0])

  productPaymentToken.value.symbol = symbol
  productPaymentToken.value.decimals = Number(decimals)
  productPaymentToken.value.balance = balance
  productPaymentToken.value.amount = selectedProduct.value.currentPrice

  await farming.loadDetails()
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
        <h2 class="app__module-title" @click="updateIsShownModal(true)">
          {{
            headingData?.title
              ? headingData.title
              : $t('product-deploy.default.title')
          }}
        </h2>
      </div>
      <span class="app__module-subtitle">
        {{
          headingData?.subtitle
            ? headingData.subtitle
            : $t('product-deploy.default.subtitle')
        }}
      </span>
      <span class="app__module-description">
        {{
          headingData?.description
            ? headingData.description
            : $t('product-deploy.default.description')
        }}
      </span>
    </div>
    <app-block
      v-if="provider.chainId == ETHEREUM_CHAINS.goerli && isBalanceInsuficient"
      class="deploy-form__mint-block"
      :class="{
        'app__module-content-wrp':
          provider.chainId == ETHEREUM_CHAINS.goerli && isBalanceInsuficient,
      }"
    >
      <div class="app__module-content">
        <div class="app__module-content-inner">
          <div class="app__metadata-row app__metadata-row--mobile-break-line">
            <span class="app__module-span">
              {{ $t('product-deploy.default.empty-balance-lbl') }}</span
            >
            <app-button
              class="app__submit-btn"
              :text="$t('product-deploy.default.mint-tokens-btn')"
              @click="mintToken"
            />
          </div>
        </div>
      </div>
    </app-block>
    <app-block
      :class="{
        'app__module-content-wrp': !(
          provider.chainId == ETHEREUM_CHAINS.goerli && isBalanceInsuficient
        ),
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
                {{ $t('product-deploy.default.payment-group') }}
              </app-button>
            </template>
            <template #default>
              <div class="app__form-control app__collapsed-fields">
                <div class="app__select-wrp">
                  <div class="app__field-row">
                    <select-field
                      class="app__module-field"
                      :model-value="form.data[0][0]"
                      :label="$t('product-deploy.default.payment-lbl')"
                      :value-options="paymentTokens.symbols"
                      @update:model-value="updatePayment"
                    />
                    <div class="app__field-tooltip">
                      <info-tooltip
                        :text="$t('product-deploy.default.payment-info')"
                      />
                    </div>
                  </div>
                  <!-- eslint-disable -->
                  <template
                    v-if="
                      selectedPaymentToken.balance &&
                      selectedProduct?.currentPrice
                    "
                  >
                    <!-- eslint-enable -->
                    <div class="app__row">
                      <span class="app__row-title">
                        {{ $t('product-deploy.default.product-price') }}
                      </span>
                      <div class="app__balance">
                        {{
                          formatAmount(
                            selectedProduct.currentPrice,
                            productPaymentToken.decimals,
                          )
                        }}
                        <span>{{ productPaymentToken.symbol }}</span>
                      </div>
                    </div>
                    <!-- eslint-disable -->
                    <div
                      v-if="
                        selectedPaymentToken.symbol !==
                        productPaymentToken.symbol
                      "
                      class="app__row"
                    >
                      <!-- eslint-enable -->
                      <span class="app__row-title">
                        {{
                          $t('product-deploy.default.product-swap-price', {
                            fromSymbol: productPaymentToken.symbol,
                            toSymbol: selectedPaymentToken.symbol,
                          })
                        }}
                      </span>
                      <div class="app__balance">
                        {{
                          formatAmount(
                            selectedPaymentToken.amount,
                            selectedPaymentToken.decimals,
                          )
                        }}
                        <span>{{ selectedPaymentToken.symbol }}</span>
                      </div>
                    </div>
                    <div v-if="selectedPaymentToken.balance" class="app__row">
                      <span class="app__row-title">
                        {{ $t('product-deploy.default.payment-balance') }}
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
              button?.label
                ? button.label
                : $t('product-deploy.default.btn-lbl')
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
          :rows="modal.rows"
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

<style lang="scss" scoped>
.deploy-form__mint-block {
  padding-bottom: 0;
}
</style>
