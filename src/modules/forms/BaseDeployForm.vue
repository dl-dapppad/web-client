<script lang="ts" setup>
import { ref, computed, Ref, reactive, onMounted, watch } from 'vue'
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
import { SelectField, InputField, CheckboxField, SwitchField } from '@/fields'
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
  (e: EVENTS.submit, data: Map<string, string>): void
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
const isPaymentLoaded = ref(true)

const discount = ref<{
  isDiscountUsed: boolean
  usedDiscount: string
  products: {
    title?: string
    discount?: string
    value: string
  }[]
}>({
  isDiscountUsed: false,
  usedDiscount: '',
  products: [
    {
      title: 'ERC-20 Mint Burn',
      discount: '10000000000000000000',
      value: '',
    },
    {
      title: 'ERC-20 Mintable',
      discount: '30000000000000000000',
      value: '',
    },
    {
      title: 'ERC-20 Mint Burn Cap',
      discount: '341757683104456907300',
      value: '',
    },
  ],
})

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

const availableDiscount = computed(() => {
  let result = '0'

  discount.value.products.forEach(
    item => (result = new BN(result).add(item.discount as string).toString()),
  )

  return result.toString()
})

const maxUsedDiscount = computed(() => {
  return new BN(
    new BN(availableDiscount.value).compare(
      selectedProduct.value?.currentPrice as string,
    ) === 1
      ? (selectedProduct.value?.currentPrice as string)
      : availableDiscount.value,
  )
    .fromFraction()
    .toString()
})

const productPriceWithDiscount = computed(() =>
  new BN(selectedProduct.value?.currentPrice as string).sub(
    new BN(
      discount.value.usedDiscount === '' ? 0 : discount.value.usedDiscount,
    ).toFraction(),
  ),
)

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
  const result = new Map<string, string>()
  result.set(
    'payment-token-addr',
    paymentTokens.value.addresses[
      paymentTokens.value.symbols.findIndex(
        symbol => symbol === form.data[0][0],
      )
    ],
  )

  result.set('product-price', form.data[0][1])

  form.data.forEach((category, catInd) => {
    if (catInd)
      category.forEach((input, inpInd) =>
        result.set(props.categories[catInd - 1].inputs[inpInd].name, input),
      )
  })

  emits(EVENTS.submit, result)
}

const updateIsShownModal = (val: boolean) => {
  emits(EVENTS.updateisSuccessModalShown, val)
}

const updatePayment = async (selectedSymbol: string | number) => {
  isPaymentLoaded.value = false

  form.data[0][0] = selectedSymbol as string

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

  form.data[0][1] = selectedPaymentToken.value.amount

  isPaymentLoaded.value = true
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

  discount.value.products.forEach(item => {
    watch(
      () => item.value,
      async () => {
        item.value =
          new BN((await item.discount) as string)
            .fromFraction()
            .compare(item.value === '' ? 0 : item.value) === 1
            ? item.value
            : new BN(item.discount as string).fromFraction().toString()

        let sum = new BN(0)

        discount.value.products.forEach(
          item => (sum = sum.add(item.value === '' ? 0 : item.value)),
        )

        discount.value.usedDiscount = sum.toString()
      },
    )
  })
}

watch(
  () => discount.value.usedDiscount,
  async () => {
    if (discount.value.usedDiscount === '') {
      discount.value.products.forEach(item => (item.value = ''))
      return
    }

    discount.value.usedDiscount =
      new BN(await discount.value.usedDiscount).compare(
        maxUsedDiscount.value,
      ) === 1
        ? maxUsedDiscount.value
        : discount.value.usedDiscount

    let sum = new BN(0)

    discount.value.products.forEach(
      item => (sum = sum.add(item.value === '' ? 0 : item.value)),
    )

    const sumOfDiscounts = sum.toString()

    const compareSumAndUse = new BN(sumOfDiscounts).compare(
      discount.value.usedDiscount,
    )

    if (compareSumAndUse === 0) return

    let diff: BN

    if (compareSumAndUse === 1) {
      diff = new BN(sumOfDiscounts).sub(discount.value.usedDiscount)

      discount.value.products.forEach(item => {
        if (new BN(item.value === '' ? 0 : item.value).compare(diff) === -1) {
          diff = diff.sub(item.value === '' ? 0 : item.value)
          item.value = ''
        } else {
          item.value = new BN(item.value === '' ? 0 : item.value)
            .sub(diff)
            .toString()
          diff = new BN(0)
        }

        if (item.value === '0') item.value = ''
      })
    } else {
      diff = new BN(discount.value.usedDiscount).sub(sumOfDiscounts)

      discount.value.products.forEach(item => {
        const freeDiscount = new BN(item.discount as string)
          .fromFraction()
          .sub(item.value === '' ? 0 : item.value)

        if (diff.compare(freeDiscount) === 1) {
          diff = diff.sub(freeDiscount)
          item.value = new BN(item.discount as string).fromFraction().toString()
        } else {
          item.value = new BN(item.value === '' ? 0 : item.value)
            .add(diff)
            .toString()
          diff = new BN(0)
        }

        if (item.value === '0') item.value = ''
      })
    }
  },
)

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
                  <template
                    v-if="
                      form.data[0][0] !== '' && selectedProduct?.currentPrice
                    "
                  >
                    <div class="app__row" v-if="isPaymentLoaded">
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
                    <loader v-else class="base-deploy-form__balance-loader" />
                    <div v-if="form.data[0][0] !== productPaymentToken.symbol">
                      <div class="app__row" v-if="isPaymentLoaded">
                        <span class="app__row-title">
                          {{
                            $t('product-deploy.default.product-swap-price', {
                              fromSymbol: selectedPaymentToken.symbol,
                              toSymbol: productPaymentToken.symbol,
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
                      <loader
                        v-else-if="
                          paymentTokens.symbols.findIndex(
                            symbol => symbol === form.data[0][0],
                          ) !== 0
                        "
                        class="base-deploy-form__balance-loader"
                      />
                    </div>
                    <div v-if="selectedPaymentToken.balance">
                      <div
                        class="app__row base-deploy-form__balance"
                        v-if="isPaymentLoaded"
                      >
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
                      <loader v-else class="base-deploy-form__balance-loader" />
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </collapse>
          <collapse
            class="app__form-control base-deploy-form__discount"
            :is-close-by-click-outside="false"
          >
            <template #head="{ collapse }">
              <div class="base-deploy-form__discount-checkbox">
                <checkbox-field
                  class=""
                  v-model="discount.isDiscountUsed"
                  :label="$t('product-deploy.default.discount-checkbox-lbl')"
                  @click="collapse.toggle"
                />
              </div>
            </template>
            <template #default>
              <div class="app__field-row">
                <input-field
                  class="app__module-field"
                  v-model="discount.usedDiscount"
                  scheme="secondary"
                  :label="$t('product-deploy.default.discount-input-lbl')"
                />
                <div class="app__field-tooltip">
                  <info-tooltip
                    :text="$t('product-deploy.default.discount-tooltip-lbl')"
                    :move-side="'left'"
                  />
                </div>
              </div>
              <div class="base-deploy-form__discount-block">
                <div class="app__row">
                  <span class="app__row-title">
                    {{ $t('product-deploy.default.discount-available-lbl') }}
                  </span>
                  <div class="app__balance">
                    {{ formatAmount(availableDiscount) }}
                    <span>{{ productPaymentToken.symbol }}</span>
                  </div>
                </div>
                <div class="app__row">
                  <span class="app__row-title">
                    {{ $t('product-deploy.default.discount-price-lbl') }}
                  </span>
                  <div class="app__balance">
                    {{
                      formatAmount(
                        productPriceWithDiscount.toString(),
                        productPaymentToken.decimals,
                      )
                    }}
                    <span>{{ productPaymentToken.symbol }}</span>
                  </div>
                </div>
                <div class="app__row base-deploy-form__discount-manual-lbl">
                  {{ $t('product-deploy.default.discount-manual-lbl') }}
                </div>
                <collapse :is-close-by-click-outside="false">
                  <template #head="{ collapse }">
                    <div class="base-deploy-form__discount-switch">
                      <switch-field
                        :right-lbl="
                          $t(
                            'product-deploy.default.discount-manual-switch-lbl',
                          )
                        "
                        v-model="collapse.isOpen"
                        @click="collapse.toggle"
                      />
                    </div>
                  </template>
                  <template #default>
                    <div class="base-deploy-form__discount-manual">
                      <div
                        v-for="(item, idx) in discount.products"
                        class="app__row base-deploy-form__discount-manual-row"
                        :key="idx"
                      >
                        <div class="base-deploy-form__discount-manual-key">
                          <span class="base-deploy-form__discount-manual-title">
                            {{ item.title }}
                          </span>
                          <!--eslint-disable -->
                          {{
                            ` (${$t(
                              'product-deploy.default.discount-manual-available-lbl',
                            )} `
                          }}
                          <!--eslint-enable -->
                          <span
                            class="base-deploy-form__discount-manual-available"
                          >
                            {{
                              formatAmount(
                                item.discount,
                                productPaymentToken.decimals,
                                productPaymentToken.symbol,
                              )
                            }} </span
                          >{{ `)` }}
                        </div>
                        <!--eslint-disable -->
                        <input-field
                          class="base-deploy-form__discount-manual-input app__module-field"
                          :label="
                            $t(
                              'product-deploy.default.discount-manual-inp-lbl',
                              {
                                symbol: productPaymentToken.symbol,
                              },
                            )
                          "
                          scheme="secondary"
                          v-model="item.value"
                        />
                        <!--eslint-enable -->
                      </div>
                    </div>
                  </template>
                </collapse>
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
          <!-- eslint-disable -->
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
            :disabled="
              isBalanceInsuficient ||
              !isAllFieldsValid ||
              !provider.selectedAddress
            "
          />
          <!-- eslint-enable -->
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

.base-deploy-form__balance {
  line-height: 1.3;
}

.base-deploy-form__balance-loader {
  padding: toRem(10) toRem(28) 0 0;
  width: 100%;
}

.base-deploy-form__discount {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
}

.base-deploy-form__discount-block {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.base-deploy-form__discount-checkbox {
  font-size: toRem(16);
  display: flex;
}

.base-deploy-form__discount-manual-lbl {
  color: var(--text-secondary-main);
  line-height: 1.3;
  letter-spacing: 0.1em;

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.base-deploy-form__discount-switch {
  display: flex;
  gap: toRem(12);
  font-size: toRem(16);

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.base-deploy-form__discount-manual {
  display: flex;
  flex-direction: column;
  gap: toRem(6);
}

.base-deploy-form__discount-manual-key {
  color: var(--text-secondary-main);

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.base-deploy-form__discount-manual-title {
  font-weight: 700;
  font-size: inherit;

  @include respond-to(medium) {
    display: block;
    padding: 0 0 toRem(5) 0;
  }
}

.base-deploy-form__discount-manual-available {
  color: var(--secondary-main);
}

.base-deploy-form__discount-manual-input {
  max-width: toRem(200);

  @include respond-to(medium) {
    max-width: 100%;
    width: 100%;
    padding-right: toRem(28);
  }
}

.base-deploy-form__discount-manual-row {
  @include respond-to(medium) {
    flex-direction: column;
    align-items: start;
    gap: toRem(12);
    padding: toRem(20) 0 0 0;
  }
}
</style>
