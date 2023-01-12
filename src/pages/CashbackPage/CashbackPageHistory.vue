<script lang="ts" setup>
import { ref } from 'vue'

import { AppBlock, Tabs } from '@/common'
import { SwitchField } from '@/fields'

const FORM_TABS = [
  {
    title: 'Staking',
    number: 1,
  },
  {
    title: 'Withdrawing',
    number: 2,
  },
  {
    title: 'Claiming',
    number: 3,
  },
]

const currentTabNumber = ref(FORM_TABS[0].number)
const isMyHistory = ref(true)

const historyData = [
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 156.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7ff8296ad0eb11D',
    time: 1668509465,
    count: 156156.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 15556.1234,
  },
  {
    address: '0x8D003b5aFd611A251111111111111111110eb11D',
    time: 1668509465,
    count: 123456.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 7124.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 8123,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 61278.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 156.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 156.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7ff8296ad0eb11D',
    time: 1668509465,
    count: 156156.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 15556.1234,
  },
  {
    address: '0x8D003b5aFd611A251111111111111111110eb11D',
    time: 1668509465,
    count: 123456.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 7124.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 8123,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 61278.1234,
  },
  {
    address: '0x8D003b5aFd611A256e6E70D9f7a48296ad0eb11D',
    time: 1668509465,
    count: 156.1234,
  },
]
</script>

<template>
  <div class="cashback-history">
    <div class="cashback-history__title">
      {{ $t('cashback-history.title') }}
    </div>
    <div class="cashback-history__controls">
      <tabs v-model="currentTabNumber" :tabs-data="FORM_TABS" />
      <switch-field
        v-model="isMyHistory"
        :left-lbl="$t('cashback-history.switch-left-lbl')"
        :right-lbl="$t('cashback-history.switch-right-lbl')"
      />
    </div>
    <app-block>
      <div class="cashback-history__grid">
        <div
          class="cashback-history__grid-row cashback-history__grid-row--titled"
        >
          <span class="cashback-history__grid-row-value">
            {{ $t('cashback-history.grid-address-lbl') }}
          </span>
          <span class="cashback-history__grid-row-value">
            {{ $t('cashback-history.grid-date-lbl') }}
          </span>
          <span class="cashback-history__grid-row-value">
            {{ $t('cashback-history.grid-amount-lbl') }}
          </span>
        </div>
        <div
          v-for="(row, ind) of historyData"
          :key="ind"
          class="cashback-history__grid-row"
        >
          <span class="cashback-history__grid-row-value">
            {{ row.address }}
          </span>
          <span class="cashback-history__grid-row-value">
            {{ row.time }}
          </span>
          <span class="cashback-history__grid-row-value">
            {{ row.count }}
          </span>
        </div>
      </div>
    </app-block>
  </div>
</template>

<style lang="scss" scoped>
.cashback-history__title {
  font-family: var(--app-font-family-secondary);
  padding: 0 0 toRem(20) 0;
  font-size: toRem(30);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.cashback-history__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cashback-history__grid {
  padding: toRem(40);
}

.cashback-history__grid-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: toRem(20) toRem(10);
  font-weight: 700;
  font-size: toRem(16);
  border-bottom: #{toRem(1) solid var(--border-primary-main)};

  &--titled {
    font-family: var(--app-font-family-secondary);
    color: var(--text-secondary-main);
    font-size: toRem(14);
    border: 0;
  }
}

.cashback-history__grid-row-value {
  padding-right: toRem(10);
  overflow: hidden;

  &:last-child {
    text-align: end;
    padding: 0;
  }
}
</style>
