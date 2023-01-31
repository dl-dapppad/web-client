<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore, useAccountStore } from '@/store'
import { AppButton, Icon, AppBlock, AddressCopy, Tabs } from '@/common'
import { formatAmount, cropAddress } from '@/helpers'
import { ICON_NAMES } from '@/enums'
import { i18n } from '@/localization'
import { useErc20, useFarming, useBreakpoints } from '@/composables'
import { BN } from '@/utils'
import { Post } from '@/types'

import postsData from '@/assets/posts.json'
import Highcharts from 'highcharts'

const posts = postsData as unknown as Post[]
const breakpoints = useBreakpoints()

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { account } = storeToRefs(useAccountStore())
const { t } = i18n.global

const farming = useFarming()
const investmentToken = useErc20()
const rewardToken = useErc20()

const isLoaded = ref(false)

const cardsData = ref<
  {
    tab: number
    id: string
    points: {
      user: string
      total: string
      other?: {
        address: string
        value: string
      }[]
    }
    cashback: string
    chart?: {
      address: string
      value: string
      color: string
    }[]
  }[]
>([])
const chartElems = ref<HTMLElement[]>([])

const init = async () => {
  await farming.loadDetails()

  investmentToken.init(farming.investmentToken.value)
  rewardToken.init(farming.rewardToken.value)
  await Promise.all([
    investmentToken.loadDetails(),
    rewardToken.loadDetails(),
    farming.loadDetails(),
    account.value.updateDappBalance(),
  ])

  cardsData.value = [
    {
      tab: 1,
      id: 'erc20-mint-burn-cap',
      points: {
        user: '37269000000000000000',
        total: '250820000000000000000',
        other: [
          {
            address: '0x7e228741405606640dc2C44aDff3D8E203b96c2e',
            value: '100000000000000000000',
          },
          {
            address: '0x32b7de6bBe841c125f8e17815Ef8f17242EEA540',
            value: '75000000000000000000',
          },
          {
            address: '0x00DdD0140545f5711e99603853cB29972F3Fe2E3',
            value: '38551000000000000000',
          },
        ],
      },
      cashback: '20123400000000000000',
    },
    {
      tab: 1,
      id: 'erc721-burn-enum',
      points: {
        user: '45332000000000000000',
        total: '280820000000000000000',
        other: [
          {
            address: '0x7e228741405606640dc2C44aDff3D8E203b96c2e',
            value: '235488000000000000000',
          },
        ],
      },
      cashback: '8782400000000000000',
    },
  ]

  cardsData.value.forEach(item => {
    item.chart = []

    item.chart.push({
      address: 'Your share',
      value: item.points.user,
      color: '#ffa700',
    })

    if (item.points.other && item.points.other?.length >= 2) {
      const sortedOther = item.points.other?.sort(
        (a, b) => new BN(a.value).compare(b.value) * -1,
      )

      item.chart.push(
        {
          address: sortedOther[0].address,
          value: sortedOther[0].value,
          color: '#656c77',
        },
        {
          address: sortedOther[1].address,
          value: sortedOther[1].value,
          color: '#898f9a',
        },
      )

      if (item.points.other.length > 2) {
        item.chart.push({
          address: 'Others',
          value: new BN(item.points.total)
            .sub(item.points.user)
            .sub(sortedOther[0].value)
            .sub(sortedOther[1].value)
            .toString(),
          color: '#b5bbc7',
        })
      }
    } else if (item.points.other && item.points.other?.length === 1) {
      item.chart.push({
        address: item.points.other[0].address,
        value: item.points.other[0].value,
        color: '#656c77',
      })
    }
  })

  isLoaded.value = true
}

const initCharts = () => {
  cardsData.value.forEach(item => {
    const chart = chartElems.value.find(
      el => el.id === `casback-page__card-content-chart--${item.id}`,
    )
    if (!chart || chart.firstChild) return

    Highcharts.chart(
      chart,
      {
        chart: {
          type: 'pie',
          backgroundColor: 'none',
          plotBackgroundColor: undefined,
          style: {
            fontFamily: 'Montserrat',
          },
          height: '160px',
          width: 160,
        },
        title: {
          text: formatAmount(item.points.total),
          align: 'center',
          verticalAlign: 'middle',
          y: 10,
          style: {
            color: 'var(--text-primary-main)',
            fontWeight: '700',
            fontSize: '1rem',
            'letter-spacing': '0.1em',
          },
        },
        subtitle: {
          text: 'points',
          align: 'center',
          verticalAlign: 'middle',
          y: 30,
          style: {
            color: 'var(--text-primary-main)',
            fontWeight: '400',
            fontSize: '1rem',
            'letter-spacing': '0.1em',
          },
        },
        credits: {
          enabled: false,
        },
        accessibility: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            innerSize: '65%',
            shadow: false,
            center: ['50%', '50%'],
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
            },
          },
          series: {
            animation: {
              duration: 750,
              easing: 'easeOutQuad',
            },
          },
        },
        tooltip: {
          valueSuffix: '%',
          formatter: function () {
            return `Points: ${formatAmount(
              formatAmount(String(this.y), 1),
              -1,
            )}`
          },
        },
        series: [
          {
            animation: {
              duration: 750,
              easing: 'easeOutQuad',
            },
            data: item.chart?.map(dataItem => {
              return {
                name: dataItem.address,
                y: Number(new BN(dataItem.value).fromFraction().toString()),
                color: dataItem.color,
              }
            }),
            size: '140px',
            startAngle: 0,
            type: 'pie',
          },
        ],
      },
      () => ({}),
    )
  })
}

watch(
  () => provider.value.selectedAddress,
  () => {
    init()
  },
)

watch(
  () => isLoaded.value,
  () => {
    if (typeof chartElems.value[0] === 'object') initCharts()
  },
)

watch(
  () => chartElems.value,
  () => {
    if (isLoaded.value && typeof chartElems.value[0] === 'object') initCharts()
  },
  { deep: true },
)

init()

const TABS_DATA = [
  {
    title: t('cashback-page.tabs-chart'),
    icon: ICON_NAMES.chartPie,
    number: 1,
  },
  {
    title: t('cashback-page.tabs-history'),
    icon: ICON_NAMES.chartBar,
    number: 2,
  },
]
</script>

<template>
  <div class="cashback-page">
    <div class="cashback-page__content">
      <div class="app__module-heading">
        <div class="app__module-title-wrp">
          <app-button
            class="app__module-back-btn"
            :icon-left="$icons.arrowLeft"
            modification="border-circle"
            color="tertiary"
            :route="{ name: $routes.main }"
          />
          <div class="app__module-title">
            {{ $t('cashback-page.title') }}
          </div>
        </div>
        <address-copy
          class="app__link--secondary app__module-subtitle"
          :address="farming.address.value"
        />
        <div class="app__module-description">
          {{ $t('cashback-page.subtitle') }}
        </div>
      </div>
      <div class="cashback-page__cards">
        <div
          class="cahback-page__card"
          v-for="(card, ind) in cardsData"
          :key="ind"
        >
          <div class="cashback-page__card-title">
            {{ posts.find(el => el.id === card.id)?.title }}
          </div>
          <div class="cashback-page__card-inner">
            <app-block class="cashback-page__card-points">
              <div class="cashback-page__card-first-row-inner">
                <div class="cashback-page__card-first-row-title">
                  <icon
                    :name="$icons.tag"
                    class="cashback-page__card-first-row-icon"
                  />
                  {{ $t('cashback-page.card-points') }}
                </div>
                <span class="cashbcak-page__card-value">
                  {{ formatAmount(card.points.user) }}
                </span>
              </div>
            </app-block>
            <app-block class="cashback-page__card-cashback">
              <div class="cashback-page__card-first-row-inner">
                <div class="cashback-page__card-first-row-title">
                  <icon
                    :name="$icons.gift"
                    class="cashback-page__card-first-row-icon"
                  />
                  {{ $t('cashback-page.card-cashback') }}
                </div>
                <!-- eslint-disable -->
                <span
                  class="cashbcak-page__card-value cashbcak-page__card-value--accented"
                >
                  {{ formatAmount(card.cashback, 0, 'USD', 3) }}
                </span>
                <!-- eslint-enable -->
              </div>
            </app-block>
            <tabs
              :is-vertical="!breakpoints.isMedium.value"
              :is-stretched-horizontal="breakpoints.isMedium.value"
              :tabs-data="TABS_DATA"
              v-model="card.tab"
              active-color="tertiary"
              non-active-color="primary"
              class="cashback-page__card-tabs"
            />
            <app-block class="cashback-page__card-content-wrp">
              <div class="cashback-page__card-content">
                <div
                  class="cashback-page__card-content-chart"
                  v-if="card.tab === 1"
                >
                  <div
                    class="cashback-page__card-chart"
                    :id="`casback-page__card-content-chart--${card.id}`"
                    ref="chartElems"
                  />
                  <div class="cashback-page__card-legend">
                    <div
                      class="cashback-page__card-legend-item"
                      v-for="(row, idx) in card.chart"
                      :key="idx"
                    >
                      <div class="cashback-page__card-legend-key">
                        <div
                          class="cashback-page__card-legend-circle"
                          :style="{ backgroundColor: row.color }"
                        ></div>
                        <div
                          class="cashback-page__card-legend-addr"
                          :class="{
                            'cashback-page__card-legend-addr--accented':
                              idx === 0,
                          }"
                        >
                          {{
                            [0, 3].includes(idx)
                              ? row.address
                              : cropAddress(row.address, 3)
                          }}
                        </div>
                      </div>
                      <div class="cashback-page__card-legend-value">
                        {{
                          `${
                            Math.round(
                              (Number(row.value) / Number(card.points.total)) *
                                100000,
                            ) / 1000
                          }%`
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="cashback-page__card-content-history"
                  v-else-if="card.tab === 2"
                >
                  <div class="cashback-page__card-history">
                    <!-- eslint-disable -->
                    <div
                      class="cashback-page__card-history-row cashback-page__card-history-row--titled"
                    >
                      <!-- eslint-enable -->
                      <span class="cashback-page__card-history-row-item">
                        {{ $t('cashback-page.history-address') }}
                      </span>
                      <span class="cashback-page__card-history-row-item">
                        {{ $t('cashback-page.history-points') }}
                      </span>
                      <span class="cashback-page__card-history-row-item">
                        {{ $t('cashback-page.history-share') }}
                      </span>
                    </div>
                    <div
                      class="cashback-page__card-history-row"
                      v-for="(row, idx) in card.points.other"
                      :key="idx"
                    >
                      <span class="cashback-page__card-history-row-item">
                        <!-- eslint-disable -->
                        <address-copy
                          class="app__link--low app__link--accented"
                          :address="row.address"
                        />
                        <!-- eslint-enable -->
                      </span>
                      <span class="cashback-page__card-history-row-item">
                        {{ formatAmount(row.value) }}
                      </span>
                      <span class="cashback-page__card-history-row-item">
                        {{
                          `${
                            Math.round(
                              (row.value / card.points.total) * 100000,
                            ) / 1000
                          }%`
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </app-block>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cashback-page {
  padding: toRem(50) toRem(145) toRem(50) toRem(225);
  display: flex;
  gap: toRem(54);
  letter-spacing: 0.1em;

  @include respond-to(medium) {
    padding: toRem(24);
  }
}

.cashback-page__content {
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
  gap: toRem(40);
}

.cashback-page__back-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: toRem(54);
  height: toRem(54);
  left: -#{toRem(79)};
  padding: 0;
}

.cashback-page__cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(22);

  @include respond-to(large) {
    grid-template-columns: 1fr;
  }
}

.cahback-page__card {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.cashback-page__card-title {
  font-size: toRem(36);
  font-family: var(--app-font-family-secondary);
  font-weight: 700;

  @include respond-to(medium) {
    font-size: toRem(24);
  }
}

.cashback-page__card-inner {
  display: grid;
  grid-template-columns: toRem(100) 1fr 50%;

  @include respond-to(medium) {
    grid-template-columns: 1fr;
  }
}

.cashback-page__card-points {
  grid-column: 1 / 3;
  padding-bottom: 0;

  @include respond-to(medium) {
    grid-column: auto;
  }
}

.cashback-page__card-cashback {
  padding: toRem(1) toRem(1) 0 0;

  @include respond-to(medium) {
    padding: toRem(1) toRem(1) 0 toRem(1);
  }
}

.cashback-page__card-first-row-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: toRem(8);
  padding: toRem(20) toRem(30);
  height: 100%;
}

.cashback-page__card-first-row-title {
  display: flex;
  gap: toRem(12);
  font-size: toRem(16);
  align-items: center;
}

.cashback-page__card-first-row-icon {
  max-width: toRem(17);
  max-height: toRem(17);
}

.cashbcak-page__card-value {
  font-weight: 700;
  font-size: toRem(20);

  &--accented {
    color: var(--secondary-main);
  }
}

.cashback-page__card-tabs {
  font-weight: 400;

  @include respond-to(medium) {
    min-height: toRem(90);
  }
}

.cashback-page__card-content-wrp {
  grid-column: 2 / 4;
  padding-left: 0;

  @include respond-to(medium) {
    grid-column: auto;
    padding-left: toRem(1);
  }
}

.cashback-page__card-content {
  height: 100%;
}

.cashback-page__card-content-chart {
  height: 100%;
  display: flex;
  align-items: center;
  gap: toRem(36);
  padding: 0 toRem(24);

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(20);
    padding: toRem(30) toRem(20);
  }
}

.cashback-page__card-chart {
  max-height: toRem(214);
}

.cashback-page__card-legend {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
  flex-grow: 1;

  @include respond-to(medium) {
    width: 100%;
  }
}

.cashback-page__card-legend-item {
  display: flex;
  justify-content: space-between;
  font-size: toRem(12);
}

.cashback-page__card-legend-key {
  display: flex;
  align-items: center;
  gap: toRem(10);
}

.cashback-page__card-legend-circle {
  width: toRem(10);
  height: toRem(10);
  border-radius: toRem(10);
}

.cashback-page__card-legend-addr {
  color: var(--text-secondary-main);

  &--accented {
    color: var(--text-primary-main);
  }
}

.cashback-page__card-content-history {
  height: 100%;
  padding: toRem(23) toRem(43);
}

.cashback-page__card-history {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: toRem(15);
}

.cashback-page__card-history-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;

  &--titled {
    padding-bottom: toRem(6);
    color: var(--text-secondary-main);
  }
}

.cashback-page__card-history-row-item {
  font-size: toRem(12);
  font-weight: 400;

  &:last-child {
    text-align: end;
  }
}
</style>
