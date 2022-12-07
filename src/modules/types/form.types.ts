import { ValidationRule } from '@vuelidate/core'

export type Input = {
  value?: string
  label?: string
  tooltip?: string
  validators?: ValidationRule[]
}
