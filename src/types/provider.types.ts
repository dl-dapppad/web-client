import { ComputedRef, Ref } from 'vue'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import { ethers } from 'ethers'

import { PROVIDERS } from '@/enums'
import { EthereumProvider } from '@/types/ethereum.types'

/**
 * Non defined provider from browser
 */
export type ProviderInstance = EthereumProvider | unknown

/**
 * provider, which we've designated, it has a name and instance
 */
export type DesignatedProvider = {
  name: PROVIDERS
  instance: ProviderInstance
}

export type ChainId = string | number

export type Chain = {
  id: ChainId
  name: string
  rpcUrl: string
  explorerUrl: string
  symbol: string
  decimals: number
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | string
  | unknown

export type EthTransactionResponse = ethers.providers.TransactionResponse

export type SolanaTransactionResponse = TransactionSignature

export type TransactionResponse =
  | EthTransactionResponse
  | SolanaTransactionResponse
  | unknown

/**
 * composable object of designated provider,
 * which we can use to solve user needs
 */
export interface ProviderWrapper {
  currentProvider?: ComputedRef<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | undefined
  >
  currentSigner?: ComputedRef<ethers.providers.JsonRpcSigner | undefined>

  chainId: Ref<ChainId | undefined>
  selectedAddress: Ref<string | undefined>
  isConnected: ComputedRef<boolean>

  init: () => Promise<void>
  connect: () => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>
  addChain?: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
  ) => Promise<void>
  disconnect: () => void
}

export type { UseProvider } from '@/composables/useProvider'
