<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowSize } from '@vueuse/core'
import { ChartData } from '@/composables'
import Highcharts from 'highcharts'

const props = defineProps<{
  chart: ChartData
}>()

const { width, height } = useWindowSize()

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      'сhart.sale-number': 'Sale #',
    },
  },
})

const chartInstanceElement = ref<HTMLElement | undefined>()

const init = () => {
  if (!chartInstanceElement.value) return

  console.log(props.chart)

  Highcharts.chart(
    chartInstanceElement.value,
    {
      chart: {
        type: 'spline',
        zoomType: 'x',
        backgroundColor: 'transparent',
        width: null,
        style: {
          fontFamily: 'Montserrat',
        },
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
        plotLines: [
          {
            width: 2,
            color: 'var(--secondary-main)',
            dashStyle: 'shortdot',
            value: props.chart.currentY,
          },
        ],
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
        plotLines: [
          {
            width: 2,
            color: 'var(--secondary-main)',
            dashStyle: 'shortdot',
            value: props.chart.currentX,
          },
        ],
        min: 1,
        max: props.chart.values.length,
        // tickPositions: [props.chart.currentX],
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        formatter: function () {
          return `<b>${t('сhart.sale-number')}${this.x}</b>: ${
            Math.round(Number(this.y) * 10000) / 10000
          } ${props.chart.currencySymbol}`
        },
      },
      plotOptions: {
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
          pointStart: 1,
        },
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, 'var(--secondary-main)'],
              [1, 'rgba(255,255,255,0)'],
            ],
          },
        },
      },
      series: [
        {
          data: props.chart.values,
          type: 'area',
          color: 'var(--secondary-main)',
        },
      ],
    },
    () => ({}),
  )
}

onMounted(() => init())

watch([() => props.chart.values, width, height], () => init())
</script>

<template>
  <div class="line-chart">
    <div id="line-chart__instance" ref="chartInstanceElement"></div>
  </div>
</template>
