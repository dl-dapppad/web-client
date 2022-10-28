import { BN } from '@/utils'

export const getMaxUint256 = (): string => {
  return new BN(2).pow(256).sub(1).toString()
}

// TODO: 
export const getTxHashFromErrorMessage = (
  message: string,
): string | undefined => {
  const regex = /{[a-zA-Z"\r\n\d :,{}]*}/
  const arr = regex.exec(message)

  if (arr === null) return
  else return JSON.parse(arr[0])
}
