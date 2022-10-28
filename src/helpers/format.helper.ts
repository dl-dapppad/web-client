import { BN } from '../utils/math.util'

export const formatAmount = (
  amount: number | string,
  decimals: number | string,
  symbol?: string,
  decimalPlaces = 4,
): string => {
  let str = new BN(amount)
    .div(new BN(10).pow(decimals))
    .decimalPlaces(decimalPlaces)
  str = formatFromBN(new BN(str).format())

  return symbol ? `${str} ${symbol}` : str
}

export const formatPercent = (percent: string, decimalPlaces = 4): string => {
  let str = new BN(percent).div(new BN(10).pow(25)).decimalPlaces(decimalPlaces)
  str = new BN(str).format()

  return `${formatFromBN(str)}%`
}

const formatFromBN = (num: string): string => {
  let reg = /[0]*$/
  num = num.replace(reg, '')

  reg = /[.]*$/
  num = num.replace(reg, '')

  return num
}

export function cropAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`
}
