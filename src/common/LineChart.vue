<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Highcharts from 'highcharts'

const chartInstanceElement = ref<HTMLElement | undefined>()

const props = defineProps<{
  chartData: {
    data: number[]
  }
}>()

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
            data: props.chartData.data,
            type: 'area',
            color: 'var(--secondary-main)',
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
