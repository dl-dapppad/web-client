<script lang="ts" setup>
import { ref } from 'vue'
import { InputField } from '@/fields'
import { Icon, AppButton } from '@/common'
import { useFormValidation } from '@/composables'

const emit = defineEmits<{
  (e: 'submit', value: string[]): void
}>()

const submit = () => {
  emit('submit', form.value.inputs)
}

const props = defineProps<{
  formData: {
    title: string
    titleInfo: string
    inputs: {
      label: string
      info: string
      value?: string
      readonly?: boolean
      validators?: []
    }[]
    button: string
  }
}>()

const form = ref({
  inputs: [] as string[],
})

const validators = []

for (const [ind, input] of props.formData.inputs.entries()) {
  form.value.inputs.push(input.value ? input.value : '')
  validators.push({})
  if (input.validators) {
    for (const validator of input.validators) {
      validators[ind][validator.$params.type] = validator
    }
  }
}

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form.value.inputs,
  validators,
)
</script>

<template>
  <div class="common-form">
    <div class="app__form-control">
      <span class="app__form-control-title common-form__title">
        <div class="common-form__icon">
          <icon
            :name="$icons.informationCircle"
            class="common-form__title-icon"
          />
          <div class="common-form__popup">
            {{ formData.titleInfo }}
          </div>
        </div>
        {{ formData.title }}
      </span>
      <div
        class="common-form__input-wrp"
        v-for="(input, ind) of formData.inputs"
        :key="ind"
      >
        <input-field
          v-model="form.inputs[ind]"
          scheme="secondary"
          :label="input.label"
          class="common-form__input"
          :readonly="input.readonly"
          :error-message="getFieldErrorMessage(`${ind}`)"
          @blur="touchField(`${ind}`)"
        />
        <div class="common-form__input-icon">
          <icon :name="$icons.informationCircle" />
          <div class="common-form__popup">
            {{ input.info }}
          </div>
        </div>
      </div>
      <app-button
        type="button"
        size="small"
        :text="formData.button"
        :disabled="!isFieldsValid"
        @click="submit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.common-form__title {
  display: flex;
  align-items: center;
  gap: toRem(16);
}

.common-form__title-icon {
  height: toRem(28);
  width: toRem(28);
  padding: toRem(6);
  position: relative;
}

.common-form__input-wrp {
  padding: 0 toRem(30) 0 0;
  position: relative;
}

.common-form__popup {
  background-color: var(--secondary-main);
  color: var(--text-primary-invert-main);
  font-size: toRem(12);
  font-weight: 400;
  padding: toRem(12) toRem(24);
  position: absolute;
  bottom: 150%;
  left: 50%;
  min-width: toRem(200);
  display: none;
  justify-content: center;
  transform: translateX(-50%);

  &:before {
    content: '';
    position: absolute;
    padding: toRem(7);
    background-color: var(--secondary-main);
    bottom: -#{toRem(7)};
    transform: rotate(45deg);
  }
}

.common-form__input-icon {
  height: toRem(28);
  width: toRem(28);
  padding: toRem(6);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  color: var(--text-secondary-main);

  &:hover {
    background-color: var(--secondary-main);
    color: var(--text-primary-invert-main);

    & > .common-form__popup {
      display: flex;
    }
  }
}

.common-form__icon {
  position: relative;

  &:hover {
    background-color: var(--secondary-main);
    color: var(--text-primary-invert-main);

    & > .common-form__popup {
      display: flex;
    }
  }
}
</style>
