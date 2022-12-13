import { ethers } from 'ethers'
import { i18n } from '@/localization'
import { EthProviderRpcError } from '@/types'
import { errors } from '@/errors'
import { EIP1193, EIP1474 } from '@/enums'
import { BN } from '@/utils'
import { Bus, ErrorHandler } from '@/helpers'
import { useAccountStore, useWeb3ProvidersStore } from '@/store'

export const connectEthAccounts = async (
  provider: ethers.providers.Web3Provider,
) => {
  await provider.send('eth_requestAccounts', [])
}

export async function requestSwitchEthChain(
  provider: ethers.providers.Web3Provider,
  chainId: number,
) {
  await provider.send('wallet_switchEthereumChain', [
    { chainId: ethers.utils.hexValue(chainId) },
  ])
}

export async function requestAddEthChain(
  provider: ethers.providers.Web3Provider,
  chainId: number,
  chainName: string,
  chainRpcUrl: string,
) {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: ethers.utils.hexValue(chainId),
      chainName,
      rpcUrls: [chainRpcUrl],
    },
  ])
}

export function handleEthError(error: EthProviderRpcError) {
  switch (error.code) {
    case EIP1193.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest(error.message)
    case EIP1193.unauthorized:
      throw new errors.ProviderUnauthorized(error.message)
    case EIP1193.unsupportedMethod:
      throw new errors.ProviderUnsupportedMethod(error.message)
    case EIP1193.disconnected:
      throw new errors.ProviderDisconnected(error.message)
    case EIP1193.chainDisconnected:
      throw new errors.ProviderChainDisconnected(error.message)
    case EIP1474.parseError:
      throw new errors.ProviderParseError(error.message)
    case EIP1474.invalidRequest:
      throw new errors.ProviderInvalidRequest(error.message)
    case EIP1474.methodNotFound:
      throw new errors.ProviderMethodNotFound(error.message)
    case EIP1474.invalidParams:
      throw new errors.ProviderInvalidParams(error.message)
    case EIP1474.internalError:
      throw new errors.ProviderInternalError(error.message)
    case EIP1474.invalidInput:
      throw new errors.ProviderInvalidInput(error.message)
    case EIP1474.resourceNotFound:
      throw new errors.ProviderResourceNotFound(error.message)
    case EIP1474.resourceUnavailable:
      throw new errors.ProviderResourceUnavailable(error.message)
    case EIP1474.transactionRejected:
      throw new errors.ProviderTransactionRejected(error.message)
    case EIP1474.methodNotSupported:
      throw new errors.ProviderMethodNotSupported(error.message)
    case EIP1474.limitExceeded:
      throw new errors.ProviderLimitExceeded(error.message)
    case EIP1474.jsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported(error.message)
    default:
      throw error
  }
}

export function getEthExplorerTxUrl(explorerUrl: string, txHash: string) {
  return `${explorerUrl}/tx/${txHash}`
}

export function getEthExplorerAddressUrl(explorerUrl: string, address: string) {
  return `${explorerUrl}/address/${address}`
}

export const getMaxUint256 = (): string => {
  return new BN(2).pow(256).sub(1).toString()
}

export const txWrapper = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: any,
  args?: Record<string, string>,
): Promise<boolean> => {
  try {
    const { t } = i18n.global

    const accountStore = useAccountStore()
    const providerStore = useWeb3ProvidersStore()

    if (!providerStore.provider.selectedAddress) {
      ErrorHandler.process(new Error(t('errors.provider-unconnected')))
      return false
    }

    let tx
    if (args) tx = await callback(args)
    else tx = await callback()

    const url = providerStore.provider.getTxUrl(tx.hash)
    Bus.processing({
      message:
        'The transaction has been sent to the blockchain, wait for confirmation',
      link: {
        href: url,
        label: 'View transaction',
      },
    })

    await tx.wait()
    await accountStore.updateNativeBalance()

    Bus.success({
      message: 'Your transaction is confirmed!',
      link: {
        href: url,
        label: 'View transaction',
      },
    })

    return true
  } catch (e) {
    handleTxError(e)

    return false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleTxError = (e: any) => {
  const err = e as unknown as Error

  let msg = handleErrorMessage(err.message)
  const txMessage = handleTxErrorMessage(msg)
  if (txMessage) msg = txMessage
  if (!msg) msg = 'Failed to complete the transaction'

  const { t } = i18n.global
  // eslint-disable-next-line vue-i18n/no-dynamic-keys
  Bus.warning(t(msg))
}

export const handleErrorMessage = (msg: string): string => {
  const regex = /("message":|string )"[a-zA-Z\r\n\d :,{}.']*"/
  const arr = regex.exec(msg)

  if (!arr) return ''
  return arr[0].replace('"message":', '').replaceAll('"', '')
}

export const handleTxErrorMessage = (msg: string): string => {
  const regex = /'[a-zA-Z\r\n\d :,{}.']*/
  const arr = regex.exec(msg)

  if (!arr) return ''
  // eslint-disable-next-line quotes
  return arr[0].replaceAll("'", '')
}
