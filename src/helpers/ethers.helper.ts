import { BN } from '@/utils'
import { Bus } from '@/helpers'
import { useAccountStore } from '@/store'

export const getMaxUint256 = (): string => {
  return new BN(2).pow(256).sub(1).toString()
}

export const txWrapper = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: any,
  args?: Record<string, string>,
) => {
  try {
    const accountStore = useAccountStore()

    let tx
    if (args) tx = await callback(args)
    else tx = await callback()

    await accountStore.updateNativeBalance()

    Bus.success(`Transaction has been confirmed! ${tx.hash}`)
  } catch (e) {
    if (e instanceof Error)
      throw new Error(getTxHashFromErrorMessage(e?.message))
    else throw e
  }
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
