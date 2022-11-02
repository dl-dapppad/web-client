import { BN } from '@/utils/math.util'

export function cropAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`
}

export function formatNumber(amount: number | string) {
  return new BN(amount).format({
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    decimals: 6,
  })
}

export function formatNumberWithSpaces(amount: number | string) {
  return new BN(amount).format({
    decimalSeparator: '.',
    groupSeparator: ' ',
    groupSize: 3,
    decimals: 4,
  })
}
