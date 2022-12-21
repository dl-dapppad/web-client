<script lang="ts" setup>
import { reactive, Ref } from 'vue'

import { InfoTooltip, AppButton, AddressCopy } from '@/common'
import { InputField } from '@/fields'
import { useFormValidation } from '@/composables'
import { Input } from '@/modules/types'
import { PRODUCT_INT_FORM_RESULT_TYPES } from '@/modules/enums'

const props = defineProps<{
  formData: {
    title: string
    titleTooltip: string
    inputs: Input[]
    button: string
    buttonDisabled?: Ref<boolean>
  }
  result?: {
    type: PRODUCT_INT_FORM_RESULT_TYPES
    data: Ref<string>
  }
}>()

const emit = defineEmits<{
  (e: 'submit', value: string[]): void
}>()

const submit = () => {
  emit('submit', form.fields)
}

// data to useForm
const validators = []
const form = reactive({
  fields: [] as string[],
})

// filling useForm data
for (const [i, input] of props.formData.inputs.entries()) {
  form.fields.push(input.value ? input.value : '')

  validators.push({})
  if (input.validators) {
    for (const validator of input.validators) {
      validators[i][validator?.$params?.type] = validator
    }
  }
}

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form.fields,
  validators,
)
</script>

<template>
  <div class="app__common-form">
    <div class="app__form-control">
      <span class="app__form-control-title app__common-form__title">
        <info-tooltip :text="formData.titleTooltip" />
        {{ formData.title }}
      </span>
      <div
        v-for="(input, ind) of formData.inputs"
        :key="ind"
        class="app__field-row"
      >
        <input-field
          class="app__module-field"
          v-model="form.fields[ind]"
          :label="input.label ? input.label : undefined"
          :error-message="getFieldErrorMessage(`${ind}`)"
          scheme="secondary"
          @blur="touchField(`${ind}`)"
        />
        <div class="app__field-tooltip">
          <info-tooltip :text="input.tooltip ? input.tooltip : ''" />
        </div>
      </div>
      <div class="app__common-form__button-wrp">
        <!-- eslint-disable -->
        <app-button
          type="button"
          size="small"
          :text="formData.button"
          :disabled="
            !isFieldsValid ||
            (formData.buttonDisabled && formData.buttonDisabled.value)
          "
          @click="submit"
        />
        <!-- eslint-enable -->
        <div v-if="result && result?.data.value !== ''">
          <div v-if="result.type === PRODUCT_INT_FORM_RESULT_TYPES.amount">
            {{ result.data.value }}
          </div>
          <div
            v-else-if="
              result.type === PRODUCT_INT_FORM_RESULT_TYPES.amountWithSymbol
            "
          >
            <span class="app__price">
              {{ result.data.value.split(' ')[0] }}
              <span class="app__price-asset">
                {{ result.data.value.split(' ')[1] }}
              </span>
            </span>
          </div>
          <div
            v-else-if="result.type === PRODUCT_INT_FORM_RESULT_TYPES.address"
          >
            <address-copy
              class="app__link--accented"
              :address="result.data.value"
            />
          </div>
          <div v-else-if="result.type === PRODUCT_INT_FORM_RESULT_TYPES.link">
            <address-copy
              class="app__link--accented"
              :address="result.data.value"
              :href="result.data.value"
              :is-cropped="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
