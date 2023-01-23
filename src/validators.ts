import {
  required as _required,
  email as _email,
  integer as _integer,
  numeric as _numeric,
  minLength as _minLength,
  maxLength as _maxLength,
  minValue as _minValue,
  maxValue as _maxValue,
  sameAs as _sameAs,
  url as _url,
} from '@vuelidate/validators'
import { ValidationRule, ValidationRuleWithParams } from '@vuelidate/core'
import { Ref } from 'vue'
import { createI18nMessage, MessageProps } from '@vuelidate/validators'
import { get } from 'lodash-es'
import { i18n } from '@/localization'
import { ethers } from 'ethers'
import { BN } from '@/utils'

const { t } = i18n.global || i18n

const messagePath = ({ $validator }: MessageProps) =>
  `validations.field-error_${$validator}`

const withI18nMessage = createI18nMessage({ t, messagePath })

export const required = <ValidationRule>withI18nMessage(_required)

export const email = <ValidationRule>withI18nMessage(_email)

export const integer = <ValidationRule>withI18nMessage(_integer)

export const isAddress = <ValidationRule>withI18nMessage({
  $validator: (address: string) => ethers.utils.isAddress(address),
  $params: {
    type: 'isAddress',
  },
})

export const numeric = <ValidationRule>withI18nMessage(_numeric)

export const minLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_minLength(length))

export const maxLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_maxLength(length))

export const minValue = (num: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_minValue(num))

export const maxValue = (num: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_maxValue(num))

export const maxBNValue = (maxAmount: BN | number | string) =>
  <ValidationRule>withI18nMessage({
    $validator: (num: BN | number | string) =>
      new BN(num).compare(maxAmount) !== 1,
    $params: {
      type: 'maxBNValue',
    },
  })

export const greaterThen = (minAmount: BN | number | string) =>
  <ValidationRuleWithParams<{ min: string }>>withI18nMessage({
    $validator: (num: BN | number | string) =>
      new BN(num).compare(minAmount) === 1,
    $message: ({ $params: { min } }) => min,
    $params: {
      type: 'greaterThen',
      min:
        typeof minAmount === 'object'
          ? minAmount.toString()
          : String(minAmount),
    },
  })

export const sameAs = (field: Ref): ValidationRule => {
  return <ValidationRule>withI18nMessage(_sameAs(field, get(field, '_key')))
}

export const url = <ValidationRule>withI18nMessage(_url)

export const ipfsAndUrl = <ValidationRule>withI18nMessage({
  $validator: (link: string) => {
    return (
      _url.$validator(link, link, link) || /^ipfs:\/\/[a-zA-Z0-9]+/.test(link)
    )
  },
  $params: {
    type: 'ipfsAndUrl',
  },
})
