<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Highcharts from 'highcharts'

const chartInstanceElement = ref<HTMLElement | undefined>()

const startPrice = 5000
const minPrice = 100
const decreasePercent = 5
const cashbackPercent = 10
const salesCount = 120

const getPriceArr = (
  startPrice: number,
  minPrice: number,
  decreasePercent: number,
  salesCount: number,
) => {
  const result: number[] = []
  let currentPrice = startPrice
  for (let i = 0; i < salesCount; i++) {
    result.push(currentPrice)
    currentPrice *= 1 - decreasePercent / 100
    currentPrice = currentPrice < minPrice ? minPrice : currentPrice
  }
  return result
}

const dataArr = getPriceArr(startPrice, minPrice, decreasePercent, salesCount)
Highcharts.setOptions({
  chart: {
    style: {
      fontFamily: 'Montserrat',
    },
  },
})

onMounted(() => {
  if (chartInstanceElement.value) {
    Highcharts.chart(
      chartInstanceElement.value,
      {
        chart: {
          type: 'spline',
          zoomType: 'x',
          backgroundColor: 'transparent',
          width: null,
        },
        credits: {
          enabled: false,
        },
        title: {
          text: '',
        },
        yAxis: {
          title: {
            text: 'Price',
          },
          crosshair: {
            width: 2,
            color: 'var(--secondary-main)',
            dashStyle: 'shortdot',
          },
          gridLineColor: 'var(--border-primary-light)',
          gridLineWidth: 'toRem(1)',
          max: startPrice,
        },
        xAxis: {
          title: {
            text: 'Sales',
          },
          crosshair: {
            width: 2,
            color: 'var(--secondary-main)',
            dashStyle: 'shortdot',
          },
          gridLineColor: 'var(--border-primary-light)',
          gridLineWidth: 'toRem(1)',
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          formatter() {
            return `Count of sales: ${(this.x as number) + 1}<br />Price: ${
              Math.round((this.y as number) * 100) / 100
            }<br />Cashback: ${
              Math.round((this.y as number) * cashbackPercent) / 100
            }`
          },
        },
        plotOptions: {
          spline: {
            color: 'var(--secondary-main)',
          },
          series: {
            marker: {
              enabled: false,
              fillColor: 'var(--background-secondary)',
              lineColor: '',
              lineWidth: 2,
            },
            states: {
              hover: {
                enabled: true,
                halo: {
                  size: 0,
                },
              },
            },
          },
        },
        series: [
          {
            data: dataArr,
          },
        ],
      },
      () => ({}),
    )
  }
})
</script>

<template>
  <div class="line-chart">
    <div id="line-chart__instance" ref="chartInstanceElement"></div>
  </div>
</template>
