<script lang="ts" setup>
import {
  AppButton,
  Icon,
  AppBlock,
  DonutChart,
  MultipleLineChart,
} from '@/common'
import { cropAddress } from '@/helpers'
import { useRouter } from '@/router'
import { copyToClipboard, formatDMYTime } from '@/helpers'
import { i18n } from '@/localization'
import { ICON_NAMES } from '@/enums'

const { t } = i18n.global

const router = useRouter()
const address = '0xa1234567af'

const donutChartData = {
  data: [
    {
      value: 16,
      label: 'First label',
      color: 'var(--tertiary-main)',
    },
    {
      value: 10,
      label: 'Claiming reward',
      color: 'var(--quaternary-main)',
    },
    {
      value: 74,
      label: 'Total reward',
      color: 'var(--secondary-main)',
    },
  ],
  isLegendShown: true,
  title: '12.34M',
  subtitle: 'USDT',
}

const linesChartData = {
  lines: [
    {
      values: [
        5000, 4750, 4512.5, 4286.88, 4072.53, 3868.9, 3675.46, 3491.69, 3317.1,
        3151.25, 2993.68, 2844, 2701.8, 2566.71, 2438.37, 2316.46, 2200.63,
        2090.6, 1986.07, 1886.77, 1792.43, 1702.81, 1617.67, 1536.78, 1459.95,
        1386.95, 1317.6, 1251.72, 1189.13, 1129.68, 1073.19, 1019.53, 968.56,
        920.13, 874.12, 830.42, 788.9, 749.45, 711.98, 676.38, 642.56, 610.43,
        579.91, 550.92, 523.37, 497.2, 472.34, 448.72, 426.29, 404.97, 384.72,
        365.49, 347.21, 329.85, 313.36, 297.69, 282.81, 268.67, 255.23, 242.47,
        230.35, 218.83, 207.89, 197.5, 187.62, 178.24, 169.33, 160.86, 152.82,
        145.18, 137.92, 131.02, 124.47, 118.25, 112.34, 106.72, 101.38, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
      ],
      label: 'Total stake',
      color: 'var(--quaternary-main)',
    },
    {
      values: [
        5000, 4750, 4512.5, 4286.88, 4072.53, 3868.9, 3675.46, 3491.69, 3317.1,
        3151.25, 2993.68, 2844, 2701.8, 2566.71, 2438.37, 2316.46, 2200.63,
        2090.6, 1986.07, 1886.77, 1792.43, 1702.81, 1617.67, 1536.78, 1459.95,
        1386.95, 1317.6, 1251.72, 1189.13, 1129.68, 1073.19, 1019.53, 968.56,
        920.13, 874.12, 830.42, 788.9, 749.45, 711.98, 676.38, 642.56, 610.43,
        579.91, 550.92, 523.37, 497.2, 472.34, 448.72, 426.29, 404.97, 384.72,
        365.49, 347.21, 329.85, 313.36, 297.69, 282.81, 268.67, 255.23, 242.47,
        230.35, 218.83, 207.89, 197.5, 187.62, 178.24, 169.33, 160.86, 152.82,
        145.18, 137.92, 131.02, 124.47, 118.25, 112.34, 106.72, 101.38, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
      ].reverse(),
      label: 'My stake',
      color: 'var(--tertiary-main)',
    },
    {
      values: [
        1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 2048, 2048, 2048,
        2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048,
        2048, 2048, 1251.72, 1189.13, 1129.68, 1073.19, 1019.53, 968.56, 920.13,
        874.12, 830.42, 749.45, 711.98, 676.38, 642.56, 610.43, 579.91, 550.92,
        523.37, 497.2, 472.34, 448.72, 426.29, 404.97, 384.72, 365.49, 347.21,
        329.85, 313.36, 297.69, 282.81, 268.67, 255.23, 242.47, 230.35, 218.83,
        207.89, 197.5, 187.62, 178.24, 169.33, 160.86, 152.82, 145.18, 137.92,
        131.02, 124.47, 118.25, 1986.07, 1886.77, 1792.43, 1702.81, 1617.67,
        1536.78, 1459.95, 1386.95, 1317.6, 124, 261, 174, 1234, 946, 143, 7426,
        2566.71, 2438.37, 2316.46, 2200.63, 2090.6, 1986.07, 1886.77, 1792.43,
        1702.81, 137.92, 131.02, 124.47, 118.25, 112.34, 106.72, 101.38, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
      ],
      label: 'Additional line',
      color: 'var(--primary-main)',
    },
  ],
  isLegendShown: true,
  title: 'Stakes and rewards',
}

const historyData = [
  {
    title: t('farming-page.staking-title'),
    currency: t('farming-page.staking-currency'),
    currencyIcon: ICON_NAMES.currencyBangladeshi,
    data: [
      {
        date: 1665652259,
        rows: [
          {
            value: '78.1234',
            icon: ICON_NAMES.cube,
            label: t('farming-page.staking-history-first-lbl'),
          },
          {
            value: '78.0',
            icon: ICON_NAMES.chartBar,
            label: t('farming-page.staking-history-second-lbl'),
            selected: true,
          },
          {
            value: '78.1234',
            icon: ICON_NAMES.cube,
            label: t('farming-page.staking-history-third-lbl'),
          },
        ],
      },
      {
        date: 1665652259,
        rows: [
          {
            value: '78.1234',
            icon: ICON_NAMES.cube,
            label: t('farming-page.staking-history-first-lbl'),
          },
          {
            value: '78.0',
            icon: ICON_NAMES.chartBar,
            label: t('farming-page.staking-history-second-lbl'),
            selected: true,
          },
          {
            value: '78.1234',
            icon: ICON_NAMES.cube,
            label: t('farming-page.staking-history-third-lbl'),
          },
        ],
      },
    ],
  },
  {
    title: t('farming-page.rewards-title'),
    currency: t('farming-page.rewards-currency'),
    currencyIcon: ICON_NAMES.daiCoin,
    data: [
      {
        date: 1665652259,
        rows: [
          {
            value: '78.1234',
            icon: ICON_NAMES.gift,
            label: t('farming-page.rewards-history-first-lbl'),
          },
          {
            value: '78.0',
            icon: ICON_NAMES.chartBar,
            label: t('farming-page.rewards-history-second-lbl'),
            selected: true,
          },
          {
            value: '78.1234',
            icon: ICON_NAMES.gift,
            label: t('farming-page.rewards-history-first-lbl'),
          },
        ],
      },
      {
        date: 1665652259,
        rows: [
          {
            value: '78.0',
            icon: ICON_NAMES.chartBar,
            label: t('farming-page.rewards-history-second-lbl'),
            selected: true,
          },
          {
            value: '78.1234',
            icon: ICON_NAMES.gift,
            label: t('farming-page.rewards-history-first-lbl'),
          },
        ],
      },
    ],
  },
]
</script>

<template>
  <div class="farming-page">
    <app-button
      class="farming-page__back-btn"
      :icon-left="$icons.arrowLeft"
      modification="border-circle"
      color="tertiary"
      @click="router.go(-1)"
    />
    <div class="farming-page__content">
      <div class="farming-page__title-wrp">
        <div class="farming-page__title">
          <div class="farming-page__heading">
            {{ $t('farming-page.title') }}
          </div>
          <div
            class="farming-page__title-address"
            :title="address"
            @click="copyToClipboard(address)"
          >
            {{ cropAddress(address) }}
            <icon class="farming-page__title-icon" :name="$icons.duplicate" />
          </div>
        </div>
        <div class="farming-page__subtitle">
          {{ $t('farming-page.subtitle') }}
        </div>
      </div>
      <div class="farming-page__table">
        <app-block>
          <div class="farming-page__table-item">
            <div class="farming-page__table-title">
              <icon class="farming-page__table-icon" :name="$icons.database" />
              {{ $t('farming-page.total-stake-lbl') }}
            </div>
            <div class="farming-page__table-body">
              <span class="farming-page__table-count">
                {{ $t('farming-page.total-stake-count') }}
              </span>
              <span class="farming-page__table-currency">
                {{ $t('farming-page.total-stake-curr') }}
              </span>
            </div>
          </div>
        </app-block>
        <app-block>
          <div class="farming-page__table-item">
            <div class="farming-page__table-title">
              <icon class="farming-page__table-icon" :name="$icons.cube" />
              {{ $t('farming-page.my-stake-lbl') }}
            </div>
            <div class="farming-page__table-body">
              <span class="farming-page__table-count">
                {{ $t('farming-page.my-stake-count') }}
              </span>
              <span class="farming-page__table-currency">
                {{ $t('farming-page.my-stake-curr') }}
              </span>
            </div>
          </div>
        </app-block>
        <app-block>
          <div class="farming-page__table-buttons">
            <app-button
              class="farming-page__table-btn"
              size="large"
              color="tertiary"
            >
              {{ $t('farming-page.withdraw-btn') }}
            </app-button>
            <app-button class="farming-page__table-btn" size="large">
              {{ $t('farming-page.stake-btn') }}
            </app-button>
          </div>
        </app-block>
        <div class="farming-page__table-desc">
          <span class="farming-page__table-desc-text">
            {{ $t('farming-page.stake-address-dapp-lbl') }}
          </span>
          <span
            class="farming-page__table-desc-address"
            :title="address"
            @click="copyToClipboard(address)"
          >
            {{ cropAddress(address) }}
            <icon class="farming-page__table-icon" :name="$icons.duplicate" />
          </span>
        </div>
      </div>
      <div class="farming-page__table">
        <app-block>
          <div class="farming-page__table-item">
            <div class="farming-page__table-title">
              <icon class="farming-page__table-icon" :name="$icons.gift" />
              {{ $t('farming-page.total-reward-lbl') }}
            </div>
            <div class="farming-page__table-body">
              <span class="farming-page__table-count">
                {{ $t('farming-page.total-reward-count') }}
              </span>
              <span class="farming-page__table-currency">
                {{ $t('farming-page.total-reward-curr') }}
              </span>
            </div>
          </div>
        </app-block>
        <app-block>
          <div
            class="farming-page__table-item farming-page__table-item--secondary"
          >
            <div class="farming-page__table-title">
              <icon
                class="farming-page__table-icon"
                :name="$icons.checkCircle"
              />
              {{ $t('farming-page.current-rewards-lbl') }}
            </div>
            <div class="farming-page__table-body">
              <span class="farming-page__table-count">
                {{ $t('farming-page.current-rewards-count') }}
              </span>
              <span class="farming-page__table-currency">
                {{ $t('farming-page.current-rewards-curr') }}
              </span>
            </div>
          </div>
        </app-block>
        <app-block>
          <app-button class="farming-page__table-btn" size="large">
            {{ $t('farming-page.claim-btn') }}
          </app-button>
        </app-block>
        <div class="farming-page__table-desc">
          <span class="farming-page__table-desc-text">
            {{ $t('farming-page.stake-address-dai-lbl') }}
          </span>
          <span
            class="farming-page__table-desc-address"
            :title="address"
            @click="copyToClipboard(address)"
          >
            {{ cropAddress(address) }}
            <icon class="farming-page__table-icon" :name="$icons.duplicate" />
          </span>
        </div>
      </div>
      <div class="farming-page__charts-history-wrp">
        <div class="farming-page__charts">
          <app-block>
            <donut-chart
              :chart-data="donutChartData"
              class="farming-page__chart"
            />
          </app-block>
          <app-block>
            <multiple-line-chart
              :chart-data="linesChartData"
              class="farming-page__chart"
            />
          </app-block>
        </div>
        <div class="farming-page__history">
          <app-block v-for="(block, ind) of historyData" :key="ind">
            <div class="farming-page__history-item">
              <div class="farming-page__history-title">
                <div class="farming-page__history-heading">
                  {{ block.title }}
                </div>
                <div class="farming-page__history-currency">
                  {{ block.currency }}
                  <icon
                    class="farming-page__history-currency-icon"
                    :name="block.currencyIcon"
                  />
                </div>
              </div>
              <div
                class="farming-page__history-table"
                v-for="(item, index) of block.data"
                :key="index"
              >
                <div class="farming-page__history-time">
                  {{ formatDMYTime(item.date) }}
                </div>
                <div
                  class="farming-page__row"
                  :class="{ 'farming-page__row--selected': row.selected }"
                  v-for="(row, i) of item.rows"
                  :key="i"
                >
                  <div class="farming-page__row-key">
                    <icon :name="row.icon" class="farming-page__history-icon" />
                    {{ row.label }}
                  </div>
                  <div class="farming-page__row-value">
                    {{ row.value }}
                  </div>
                </div>
              </div>
            </div>
          </app-block>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.farming-page {
  padding: toRem(70) toRem(115) toRem(70) toRem(70);
  display: flex;
  gap: toRem(54);
  letter-spacing: 0.1em;
}

.farming-page__back-btn {
  width: toRem(54);
  height: toRem(54);
  padding: 0;
  transform: translateY(toRem(12.5));
}

.farming-page__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: toRem(40);
}

.farming-page__title-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.farming-page__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.farming-page__heading {
  font-family: var(--app-font-family-secondary);
  font-weight: 900;
  font-size: toRem(70);
  letter-spacing: 0.1em;
}

.farming-page__title-address {
  font-family: var(--app-font-family-secondary);
  font-weight: 700;
  font-size: toRem(30);
  display: flex;
  align-items: center;
  gap: toRem(20);
  cursor: pointer;
}

.farming-page__title-icon {
  width: toRem(16);
  height: toRem(16);
}

.farming-page__subtitle {
  font-size: toRem(16);
}

.farming-page__table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.farming-page__table-title {
  display: flex;
  gap: toRem(14);
  font-size: toRem(16);
  font-family: var(--app-font-family-secondary);
  font-weight: 600;
  color: var(--text-secondary-main);
}

.farming-page__table-icon {
  width: toRem(16);
  height: toRem(16);
  color: var(--text-primary-main);
}

.farming-page__table-item {
  padding: toRem(30) toRem(20);
  display: flex;
  flex-direction: column;
  gap: toRem(10);
  border-radius: toRem(12);

  &--secondary {
    background-color: var(--secondary-main);
    color: var(--text-primary-invert-main);

    & .farming-page__table-title {
      color: var(--text-primary-invert-main);

      & .farming-page__table-icon {
        color: var(--text-primary-invert-main);
      }
    }
  }
}

.farming-page__table-body {
  display: flex;
  align-items: flex-end;
  gap: toRem(6);
}

.farming-page__table-count {
  font-weight: 800;
  font-size: toRem(20);
}

.farming-page__table-currency {
  font-weight: 700;
  font-size: toRem(12);
}

.farming-page__table-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 100%;
}

.farming-page__table-btn {
  width: 100%;
  height: 100%;
}

.farming-page__table-desc {
  padding: toRem(14) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.farming-page__table-desc-text {
  font-size: toRem(12);
  color: var(--text-secondary-main);
  font-weight: 700;
}

.farming-page__table-desc-address {
  display: flex;
  gap: toRem(10);
  color: var(--secondary-main);
  font-weight: 700;
  cursor: pointer;
}

.farming-page__charts-history-wrp {
  display: flex;
  flex-direction: column;
}

.farming-page__charts {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.farming-page__chart {
  padding: toRem(40);
}

.farming-page__history {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
}

.farming-page__history-item {
  padding: toRem(40);
}

.farming-page__history-title {
  display: flex;
  justify-content: space-between;
}

.farming-page__history-heading {
  font-family: var(--app-font-family-secondary);
  font-weight: 700;
  letter-spacing: 0.1em;
  font-size: toRem(20);
}

.farming-page__history-currency {
  font-weight: 700;
  font-size: toRem(14);
  display: flex;
  gap: toRem(10);
  align-items: center;
}

.farming-page__history-currency-icon {
  height: toRem(24);
  width: toRem(24);
}

.farming-page__history-table {
  display: flex;
  flex-direction: column;
}

.farming-page__history-time {
  padding: toRem(20) 0 toRem(10);
  font-weight: 700;
  font-family: var(--app-font-family-secondary);
  color: var(--text-secondary-main);
}

.farming-page__history-icon {
  width: toRem(16);
  height: toRem(16);
}

.farming-page__row {
  padding: toRem(20) toRem(10);
  display: flex;
  justify-content: space-between;
  border-bottom: toRem(1) solid var(--border-primary-main);
  font-weight: 700;

  &--selected {
    color: var(--secondary-main);
  }
}

.farming-page__row-key {
  display: flex;
  gap: toRem(5);
  align-items: center;
}
</style>
