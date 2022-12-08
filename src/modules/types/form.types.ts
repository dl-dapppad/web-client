import { ComputedRef } from 'vue'
import { ValidationRule } from '@vuelidate/core'

export type Input = {
  value?: string
  label?: string
  tooltip?: string
  validators?: ValidationRule[]
}

export type UseForm = {
  getFieldErrorMessage: (fieldPath: string) => string
  touchField: (fieldPath: string) => void
  isFieldsValid: ComputedRef<boolean>
}

export type ModalText = {
  title?: string
  description?: string
  button?: string
}
