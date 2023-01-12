<script lang="ts" setup>
import { ref } from 'vue'
import { Loader } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { getTxGasPrice } from '@/helpers'

const props = defineProps<{
  id: string
}>()

const fee = ref('0')
const isFeeLoaded = ref(false)

const web3Store = useWeb3ProvidersStore()

const init = async () => {
  fee.value = (await getTxGasPrice(props.id)).round(3, 2).toString()

  isFeeLoaded.value = true
}

init()
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
