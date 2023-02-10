<script lang="ts" setup>
import { ref, computed, Ref, reactive } from 'vue'
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
import { InputField } from '@/fields'
import { useFormValidation, useErc20Mock } from '@/composables'
import { txWrapper } from '@/helpers'
import { BN } from '@/utils'
import { required } from '@/validators'
import { useWeb3ProvidersStore } from '@/store'
import { ETHEREUM_CHAINS } from '@/enums'
import { SCHEMES } from '@/common/Loader.vue'
import { DeploySuccessMessage } from '@/modules/common'
import { Input, ModalText, OverviewRow, UseForm } from '@/modules/types'

import BaseDeployFormPrice from '@/modules/forms/BaseDeployForm/BaseDeployFormPrice.vue'

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

const useFormArray = [] as UseForm[]
const isBalanceInsuficient = ref(false)

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
  useFormArray.forEach(UseFormObj => {
    return (result &&= UseFormObj.isFieldsValid.value)
  })
  return result
})

const updateIsShownModal = (val: boolean) => {
  emits(EVENTS.updateisSuccessModalShown, val)
}

const mintToken = async () => {
  if (provider.value.chainId != ETHEREUM_CHAINS.mumbai) return

  const erc20Mock = useErc20Mock()
  erc20Mock.init(form.data[0][0])
  await erc20Mock.updateDecimals()

  await txWrapper(erc20Mock.mint, {
    to: provider.value.selectedAddress as string,
    amount: new BN('50').toFraction(erc20Mock.decimals.value).toString(),
  })

  location.reload()
}

const productPriceWithDiscount = ref('0')
const discounts = ref<Map<string, string>>()

const onUpdatePaymentToken = (newPaymentTokenAddress: string) => {
  form.data[0][0] = newPaymentTokenAddress
}

const onUpdateProductPriceWithDiscount = (
  newProductPriceWithDiscount: string,
) => {
  productPriceWithDiscount.value = newProductPriceWithDiscount
}

const onUpdateDiscounts = (newDiscounts: Map<string, string>) => {
  discounts.value = newDiscounts
}

const onUpdateIsBalanceInsuficient = (newIsBalanceInsuficient: boolean) => {
  isBalanceInsuficient.value = newIsBalanceInsuficient
}

const submit = () => {
  let result = new Map<string, string>()
  if (discounts.value) {
    result = new Map<string, string>([...Array.from(discounts.value.entries())])
  }

  result.set('payment-token', form.data[0][0])
  result.set('product-price', productPriceWithDiscount.value)

  form.data.forEach((category, catInd) => {
    if (catInd)
      category.forEach((input, inpInd) =>
        result.set(props.categories[catInd - 1].inputs[inpInd].name, input),
      )
  })

  emits(EVENTS.submit, result)
}
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
      v-if="provider.chainId == ETHEREUM_CHAINS.mumbai && isBalanceInsuficient"
      class="deploy-form__mint-block"
      :class="{
        'app__module-content-wrp':
          provider.chainId == ETHEREUM_CHAINS.mumbai && isBalanceInsuficient,
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
          provider.chainId == ETHEREUM_CHAINS.mumbai && isBalanceInsuficient
        ),
      }"
    >
      <div class="app__module-content">
        <div class="app__module-content-inner">
          <base-deploy-form-price
            @update:payment-token="onUpdatePaymentToken"
            @update:product-price-with-discount="
              onUpdateProductPriceWithDiscount
            "
            @update:discounts="onUpdateDiscounts"
            @update:is-balance-insuficient="onUpdateIsBalanceInsuficient"
          />
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
            :disabled="!isAllFieldsValid || isBalanceInsuficient"
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
</style>
