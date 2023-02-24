<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Loader } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { getTxGasPrice } from '@/helpers'

const props = defineProps<{
  id: string
}>()

const fee = ref('0')
const isFeeLoaded = ref(false)

const web3Store = useWeb3ProvidersStore()

const init = async (isHardDetect: boolean) => {
  await web3Store.detectGasPrice(isHardDetect)

  calculateGas()
}

const calculateGas = () => {
  if (web3Store.gasPrice.value === '0') return

  fee.value = getTxGasPrice(props.id, web3Store.gasPrice.value)
    .fromFraction(9)
    .round(4, 2)
    .toString()

  isFeeLoaded.value = true
}

watch(
  () => [web3Store.gasPrice.value, web3Store.provider.chainId],
  () => init(true),
)

init(false)
</script>

<template>
  <div class="gas-fee" v-if="isFeeLoaded">
    {{ `${$t('gas-fee.lbl')} ~${fee} ${web3Store.currentChain.symbol}` }}
  </div>
  <loader class="gas-fee__loader" v-else />
</template>

<style lang="scss" scoped>
.gas-fee__loader {
  min-width: toRem(100);
  max-height: toRem(12);
}
</style>
