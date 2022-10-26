<script lang="ts" setup>
import { AppBlock, Icon } from '@/common'
import { copyToClipboard } from '@/helpers'
import { cropAddress } from '@/helpers'

const postCheckoutMetadata = {
  currentNetwork: 'Ethereum',
  salesCount: 20,
  decreasePercent: 12,
  cashbackPercent: 12,
  implementation: '0xa12b9db875AFaf4BD6bAD815CabC7D8C15e1545c',
  factory: '0xa12b9db875AFaf4BD6bAD815CabC7D8C15e1545c',
}
</script>

<template>
  <div class="post-checkout">
    <app-block class="post-checkout__top">
      <div class="post-checkout__top-inner">
        <div class="post-checkout__about">
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              {{ $t('post-checkout.current-network-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ postCheckoutMetadata.currentNetwork }}
            </span>
          </div>
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              {{ $t('post-checkout.sales-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ postCheckoutMetadata.salesCount }}
            </span>
          </div>
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              <icon
                class="post-checkout__icon"
                :name="$icons.informationCircle"
              />
              {{ $t('post-checkout.decrease-percent-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ `${postCheckoutMetadata.decreasePercent}%` }}
            </span>
          </div>
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              <icon
                class="post-checkout__icon"
                :name="$icons.informationCircle"
              />
              {{ $t('post-checkout.cashback-percent-lbl') }}
            </span>
            <span class="post-checkout__value">
              {{ `${postCheckoutMetadata.cashbackPercent}%` }}
            </span>
          </div>
        </div>
        <div class="post-checkout__about">
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              {{ $t('post-checkout.implementation-address-lbl') }}
            </span>
            <span
              :title="postCheckoutMetadata.implementation"
              class="post-checkout__address"
              @click="copyToClipboard(postCheckoutMetadata.implementation)"
            >
              {{ cropAddress(postCheckoutMetadata.implementation) }}
              <icon
                class="post-checkout__icon post-checkout__icon-clipboard"
                :name="$icons.duplicate"
              />
            </span>
          </div>
          <div class="post-checkout__item">
            <span class="post-checkout__key">
              {{ $t('post-checkout.factory-address-lbl') }}
            </span>
            <span
              :title="postCheckoutMetadata.factory"
              class="post-checkout__address"
              @click="copyToClipboard(postCheckoutMetadata.factory)"
            >
              {{ cropAddress(postCheckoutMetadata.factory) }}
              <icon
                class="post-checkout__icon post-checkout__icon-clipboard"
                :name="$icons.duplicate"
              />
            </span>
          </div>
        </div>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
.post-checkout__top {
  width: 50%;
  letter-spacing: 0.1em;
}

.post-checkout__top-inner {
  padding: toRem(40) toRem(110);
  display: flex;
  flex-direction: column;
  gap: toRem(40);
}

.post-checkout__about {
  display: flex;
  flex-direction: column;
  gap: toRem(23);
}

.post-checkout__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-checkout__key {
  display: flex;
  align-items: center;
  gap: toRem(10);
  font-size: toRem(14);
  font-weight: 700;
  color: var(--text-secondary-main);
}

.post-checkout__value {
  display: flex;
  align-items: center;
  gap: toRem(10);
  font-size: toRem(16);
  font-weight: 700;
  color: var(--text-primary-main);
}

.post-checkout__address {
  display: flex;
  align-items: center;
  gap: toRem(10);
  font-size: toRem(16);
  font-weight: 700;
  color: var(--secondary-main);
  cursor: pointer;
}

.post-checkout__icon {
  height: toRem(16);
  width: toRem(16);

  .post-checkout__address & {
    color: var(--text-primary-main);
  }
}
</style>
