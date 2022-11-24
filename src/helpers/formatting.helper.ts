import { BN } from '../utils'

export const formatAmount = (
  amount: number | string,
  decimals = 0,
  symbol?: string,
  decimalPlaces = 4,
): string => {
  let str = new BN(amount).fromFraction(decimals).format({
    decimals: decimalPlaces,
  })

  str = formatFromBN(str)

  return symbol ? `${str} ${symbol}` : str
}

export const formatPercent = (percent: string, decimalPlaces = 4): string => {
  const str = new BN(percent).fromFraction(25).format({
    decimals: decimalPlaces,
  })

  return `${formatFromBN(str)}%`
}

const formatFromBN = (str: string): string => {
  let reg = /[0]*$/
  str = str.replace(reg, '')

  reg = /[.]*$/
  str = str.replace(reg, '')

  return str
}

export function cropAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`
}
