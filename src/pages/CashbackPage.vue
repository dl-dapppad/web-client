<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useWeb3ProvidersStore,
  useAccountStore,
  useContractsStore,
} from '@/store'
import {
  AppButton,
  AppPagination,
  Icon,
  AppBlock,
  AddressCopy,
  Tabs,
  Loader,
} from '@/common'
import { formatAmount, cropAddress } from '@/helpers'
import { ICON_NAMES, PRODUCT_IDS } from '@/enums'
import { i18n } from '@/localization'
import { useBreakpoints, useProduct, ProductsCahsback } from '@/composables'
import { BN } from '@/utils'
import { Post, ApolloPoolAccounts } from '@/types'

import postsData from '@/assets/posts.json'
import Highcharts from 'highcharts'

import {
  GetPoolAccount,
  GetPoolAccountQuery,
  GetPoolAccounts,
  GetPoolAccountsQuery,
  GetPoolAccountsWithoutOneUser,
  GetPoolAccountsWithoutOneUserQuery,
  GetUsersInPoolCount,
  GetUsersInPoolCountQuery,
} from '@/types/graphql'
import { coreApolloClient } from '@/api/graphql/core.graphql'

const posts = postsData as unknown as Post[]
const { t } = i18n.global
const { provider } = storeToRefs(useWeb3ProvidersStore())
const { account } = storeToRefs(useAccountStore())
const contracts = useContractsStore()

const TABS_DATA = [
  {
    title: t('cashback-page.tabs-chart'),
    icon: ICON_NAMES.chartPie,
    number: 1,
  },
  {
    title: t('cashback-page.tabs-rating'),
    icon: ICON_NAMES.chartBar,
    number: 2,
  },
]

const breakpoints = useBreakpoints()
const productComposable = useProduct()

const cardsData = ref<
  {
    tab: number
    id: PRODUCT_IDS
    alias: string
    pointsTotal: string
    pointsUser: string
    pointsUsers: {
      address: string
      value: string
      percent: string
    }[]
    cashback: string
    chart: {
      address: string
      percent: string
      value: string
      color: string
    }[]
    pagination: {
      currentPage: number
      showOnPage: number
      totalPages: number
    }
  }[]
>([])

const chartShowUserCount = 6
const chartElems = ref<HTMLElement[]>([])
const chartPallet = ['#656c77', '#898f9a', '#b5bbc7']

const isLoaded = ref(false)

const handlePaginationChange = async (index: number, page: number) => {
  cardsData.value[index].pagination.currentPage = page

  const skip = (page - 1) * cardsData.value[index].pagination.showOnPage
  const pointsUsers = (
    await coreApolloClient.query<GetPoolAccountsQuery>({
      query: GetPoolAccounts,
      fetchPolicy: 'network-only',
      variables: {
        product: cardsData.value[index].alias,
        first: cardsData.value[index].pagination.showOnPage,
        skip,
      },
    })
  ).data.userToProducts

  cardsData.value[index].pointsUsers = []
  pointsUsers.forEach(pointsUser => {
    const percent = new BN(100)
      .mul(pointsUser.points)
      .div(cardsData.value[index].pointsTotal)
      .toString()

    cardsData.value[index].pointsUsers.push({
      address: pointsUser.address,
      value: pointsUser.points,
      percent,
    })
  })
}

/* eslint-disable promise/prefer-await-to-then */
const getApolloData = async () => {
  const promisesArr: Promise<
    ProductsCahsback | ApolloPoolAccounts[] | number
  >[] = []

  for (let i = 0; i < account.value.accountCashbackPools.length; i++) {
    const accountPool = account.value.accountCashbackPools[i]

    promisesArr.push(contracts.cashback.getProductCahsback(accountPool.alias))
    promisesArr.push(
      coreApolloClient
        .query<GetPoolAccountQuery>({
          query: GetPoolAccount,
          fetchPolicy: 'network-only',
          variables: {
            product: accountPool.alias,
            user: provider.value.selectedAddress,
          },
        })
        .then(response => response.data.userToProducts),
    )
    promisesArr.push(
      coreApolloClient
        .query<GetPoolAccountsWithoutOneUserQuery>({
          query: GetPoolAccountsWithoutOneUser,
          fetchPolicy: 'network-only',
          variables: {
            product: accountPool.alias,
            first: chartShowUserCount - 1,
            skip: 0,
            userNot: provider.value.selectedAddress,
          },
        })
        .then(response => response.data.userToProducts),
    )
    promisesArr.push(
      coreApolloClient
        .query<GetPoolAccountsQuery>({
          query: GetPoolAccounts,
          fetchPolicy: 'network-only',
          variables: {
            product: accountPool.alias,
            first: 4,
            skip: 0,
          },
        })
        .then(response => response.data.userToProducts),
    )
    promisesArr.push(
      coreApolloClient
        .query<GetUsersInPoolCountQuery>({
          query: GetUsersInPoolCount,
          fetchPolicy: 'network-only',
          variables: {
            id: accountPool.alias,
          },
        })
        .then(response => response.data.productCounter?.count),
    )
  }

  let resultArr: (ProductsCahsback | ApolloPoolAccounts[] | number)[] = []
  const apolloDataResult: [
    ProductsCahsback,
    ApolloPoolAccounts[],
    ApolloPoolAccounts[],
    ApolloPoolAccounts[],
    number,
  ][] = []

  await Promise.all(promisesArr)
    .then(results => (resultArr = results))
    .catch(err => console.error(err))

  for (let i = 0; i < resultArr.length; i++) {
    if (i % 5 === 0)
      apolloDataResult.push([
        { cumulativeSum: '', totalPoints: '' },
        [],
        [],
        [],
        0,
      ])

    apolloDataResult[Math.floor(i / 5)][i % 5] = resultArr[i]
  }

  return apolloDataResult
}

const init = async () => {
  cardsData.value = []

  if (
    !account.value.accountCashbackPools.length ||
    !provider.value?.selectedAddress ||
    !contracts.loaded
  ) {
    isLoaded.value = account.value.isLoaded
    return
  }

  isLoaded.value = false
  cardsData.value = []

  const apolloData = await getApolloData()

  for (let i = 0; i < account.value.accountCashbackPools.length; i++) {
    const accountPool = account.value.accountCashbackPools[i]

    // Prevent adding product with zero price
    if (accountPool.totalPoints === '0') continue

    cardsData.value.push({
      tab: 1,
      id: productComposable.getProductIdByAlias(accountPool.alias),
      alias: accountPool.alias,
      pointsTotal: '0',
      pointsUser: accountPool.totalPoints,
      pointsUsers: [],
      cashback: accountPool.cashback,
      chart: [],
      pagination: {
        currentPage: 1,
        showOnPage: 4,
        totalPages: 0,
      },
    })

    const [
      poolInfo,
      pointsAccount,
      pointsUsersWithoutSelectedAddress,
      pointsUsers,
      usersInPoolCount,
    ] = apolloData[i]

    cardsData.value[i].pagination.totalPages = Math.ceil(
      Number(usersInPoolCount) / cardsData.value[i].pagination.showOnPage,
    )
    cardsData.value[i].pointsTotal = poolInfo.totalPoints
    const pointsUsersChart = [
      ...pointsAccount,
      ...pointsUsersWithoutSelectedAddress,
    ]

    // Start fill rating data
    pointsUsers.forEach(pointsUser => {
      const percent = new BN(100)
        .mul(pointsUser.points)
        .div(cardsData.value[i].pointsTotal)
        .toString()

      cardsData.value[i].pointsUsers.push({
        address: pointsUser.address,
        value: pointsUser.points,
        percent,
      })
    })
    // End

    // Start fill chart data
    let otherPercent = new BN(100)
    let otherPoints = new BN(cardsData.value[i].pointsTotal)
    pointsUsersChart.forEach((pointsUser, userIndex) => {
      const percent = new BN(100)
        .mul(pointsUser.points)
        .div(cardsData.value[i].pointsTotal)
        .toString()

      if (userIndex + 1 < chartShowUserCount) {
        const isSelectedAddress =
          pointsUser.address.toLowerCase() ===
          provider.value.selectedAddress?.toLowerCase()

        cardsData.value[i].chart?.push({
          address: isSelectedAddress
            ? 'Your share'
            : cropAddress(pointsUser.address, 3),
          percent,
          value: pointsUser.points,
          color: isSelectedAddress
            ? '#ffa700'
            : chartPallet[userIndex % chartPallet.length],
        })

        otherPercent = otherPercent.sub(percent)
        otherPoints = otherPoints.sub(pointsUser.points)
      } else {
        cardsData.value[i].chart.push({
          address: 'Others',
          percent: otherPercent.toString(),
          value: otherPoints.toString(),
          color: chartPallet[chartShowUserCount % chartPallet.length],
        })
      }
    })
    // End
  }

  initCharts()

  isLoaded.value = true
}

const initCharts = () => {
  cardsData.value.forEach(card => {
    const chart = chartElems.value.find(
      el => el.id === `casback-page__card-content-chart--${card.alias}`,
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
          height: '165px',
          width: 165,
        },
        title: {
          text: formatAmount(card.pointsTotal, 18, '', 3),
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
            return `${this.point.name}: ${this.y} points`
          },
        },
        series: [
          {
            animation: {
              duration: 750,
              easing: 'easeOutQuad',
            },
            data: card.chart?.map(cardItem => {
              return {
                name: cardItem.address,
                y: Number(formatAmount(cardItem.value)),
                color: cardItem.color,
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

watch(() => [account.value.isLoaded, provider.value.selectedAddress], init)

watch(
  () => [chartElems.value, isLoaded.value],
  () => {
    if (isLoaded.value && chartElems.value.length) initCharts()
  },
  { deep: true },
)

init()
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
        <div class="app__module-description">
          {{ $t('cashback-page.subtitle') }}
        </div>
      </div>
      <template v-if="isLoaded">
        <div v-if="cardsData.length" class="cashback-page__cards">
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
                    {{ formatAmount(card.pointsUser) }}
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
                    {{
                      formatAmount(
                        card.cashback,
                        18,
                        contracts.pointToken.symbol,
                      )
                    }}
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
                      :id="`casback-page__card-content-chart--${card.alias}`"
                      ref="chartElems"
                    />
                    <div class="cashback-page__card-legend">
                      <div
                        class="cashback-page__card-legend-item"
                        v-for="(chartRow, idx) in card.chart"
                        :key="idx"
                      >
                        <div class="cashback-page__card-legend-key">
                          <div
                            class="cashback-page__card-legend-circle"
                            :style="{ backgroundColor: chartRow.color }"
                          ></div>
                          <div
                            class="cashback-page__card-legend-addr"
                            :class="{
                              'cashback-page__card-legend-addr--accented':
                                idx === 0,
                            }"
                          >
                            {{ chartRow.address }}
                          </div>
                        </div>
                        <div class="cashback-page__card-legend-value">
                          {{ `${chartRow.percent}%` }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="cashback-page__card-content-rating"
                    v-else-if="card.tab === 2"
                  >
                    <div class="cashback-page__card-rating">
                      <!-- eslint-disable -->
                      <div
                        class="cashback-page__card-rating-row cashback-page__card-rating-row--titled"
                        v-if="!breakpoints.isMedium.value"
                      >
                        <!-- eslint-enable -->
                        <span class="cashback-page__card-rating-row-item">
                          {{ $t('cashback-page.rating-address') }}
                        </span>
                        <span class="cashback-page__card-rating-row-item">
                          {{ $t('cashback-page.rating-points') }}
                        </span>
                        <span class="cashback-page__card-rating-row-item">
                          {{ $t('cashback-page.rating-share') }}
                        </span>
                      </div>
                      <div
                        class="cashback-page__card-rating-row"
                        v-for="(row, idx) in card.pointsUsers"
                        :key="idx"
                      >
                        <!-- eslint-disable -->
                        <span
                          class="cashback-page__card-rating-row-item cashback-page__card-rating-row-item--accented"
                          v-if="breakpoints.isMedium.value"
                        >
                          {{ $t('cashback-page.rating-address') }}
                        </span>
                        <span class="cashback-page__card-rating-row-item">
                          <address-copy
                            class="app__link--low app__link--accented cashback-page__rating-address"
                            :address="row.address"
                          />
                        </span>
                        <span
                          class="cashback-page__card-rating-row-item cashback-page__card-rating-row-item--accented"
                          v-if="breakpoints.isMedium.value"
                        >
                          {{ $t('cashback-page.rating-points') }}
                        </span>
                        <span class="cashback-page__card-rating-row-item">
                          {{ formatAmount(row.value) }}
                        </span>
                        <span
                          class="cashback-page__card-rating-row-item cashback-page__card-rating-row-item--accented"
                          v-if="breakpoints.isMedium.value"
                        >
                          <!--eslint-enable -->
                          {{ $t('cashback-page.rating-share') }}
                        </span>
                        <span class="cashback-page__card-rating-row-item">
                          {{ `${row.percent}%` }}
                        </span>
                      </div>
                      <div
                        v-if="card.pagination.totalPages > 1"
                        class="cashback-page__pagination"
                      >
                        <app-pagination
                          :pages="card.pagination.totalPages"
                          :current-page="card.pagination.currentPage"
                          @on:page-change="
                            page => handlePaginationChange(ind, page)
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </app-block>
            </div>
          </div>
        </div>
        <div v-else>
          <p>{{ $t('cashback-page.no-pools') }}</p>
        </div>
      </template>
      <loader v-else class="cashback-page__loader" />
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

.cashback-page__pagination {
  display: flex;
  justify-content: center;
  align-items: end;
  flex: 1 0 auto;
}

.cashback-page__loader {
  height: toRem(358);
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
  grid-gap: toRem(44) toRem(22);

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

.cashback-page__card-content-rating {
  height: 100%;
  padding: toRem(23) toRem(43) toRem(12);

  @include respond-to(medium) {
    padding: toRem(30) toRem(20);
  }
}

.cashback-page__card-rating {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: toRem(15);

  @include respond-to(medium) {
    gap: toRem(21);
  }
}

.cashback-page__card-rating-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;

  &--titled {
    padding-bottom: toRem(6);
    color: var(--text-secondary-main);
  }

  @include respond-to(medium) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-row-gap: toRem(6);
  }
}

.cashback-page__card-rating-row-item {
  font-size: toRem(12);
  font-weight: 400;

  /* stylelint-disable */
  :deep(.address-copy__link) {
    min-width: toRem(90);
  }
  /* stylelint-enable */

  &:nth-child(2n + 2) {
    justify-self: end;
  }

  &:last-child {
    text-align: end;
  }

  &--accented {
    color: var(--text-secondary-main);
  }
}

.cashback-page__rating-address {
  @include respond-to(xsmall) {
    font-size: toRem(10);
  }
}
</style>
