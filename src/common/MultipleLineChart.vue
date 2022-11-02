<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'

import Highcharts from 'highcharts'

const props = defineProps<{
  chartData: {
    lines: {
      values: number[]
      label: string
      color: string
    }[]
    isLegendShown?: boolean
    title?: string
  }
}>()

const { width, height } = useWindowSize()

const chartInstanceElement = ref<HTMLElement | undefined>()

const data: {
  data: number[]
  type: string
  color: string
  marker: {
    symbol: string
  }
}[] = []
for (const line of props.chartData.lines) {
  data.push({
    data: line.values,
    type: 'spline',
    color: line.color,
    marker: {
      symbol: 'circle',
    },
  })
}

const init = () => {
  if (!chartInstanceElement.value) return

  Highcharts.chart(
    chartInstanceElement.value,
    {
      chart: {
        type: 'spline',
        backgroundColor: 'transparent',
        width: null,
        style: {
          fontFamily: 'Montserrat',
        },
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: '',
        },
        gridLineColor: 'var(--border-primary-light)',
        gridLineWidth: 'toRem(1)',
      },
      xAxis: {
        title: {
          text: '',
        },
        crosshair: {
          width: 2,
          color: 'var(--secondary-main)',
          dashStyle: 'shortdot',
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
        },
      },
      series: data,
    },
    () => ({}),
  )
}
onMounted(() => init())

watch([() => props.chartData, width, height], () => init())
</script>

<template>
  <div class="multiple-line-chart">
    <div
      class="multiple-line-chart__additional"
      v-if="props.chartData.title || props.chartData.isLegendShown"
    >
      <h5 class="multiple-line-chart__title" v-if="props.chartData.title">
        {{ props.chartData.title }}
      </h5>
      <div class="multiple-line-chart__legend">
        <div
          class="multiple-line-chart__legend-item"
          v-for="(item, ind) of props.chartData.lines"
          :key="ind"
        >
          <div
            class="multiple-line-chart__legend-color"
            :style="{ backgroundColor: item.color }"
          ></div>
          <div class="multiple-line-chart__legend-title">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <div id="multiple-line-chart__instance" ref="chartInstanceElement"></div>
  </div>
</template>

<style lang="scss" scoped>
.multiple-line-chart {
  display: flex;
  flex-direction: column;
  gap: toRem(40);
  height: 100%;
  justify-content: center;
}

.multiple-line-chart__title {
  font-size: toRem(20);
  letter-spacing: 0.1em;
  font-family: var(--app-font-family-secondary);
}

.multiple-line-chart__additional {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.multiple-line-chart__legend {
  display: flex;
  gap: toRem(20);
}

.multiple-line-chart__legend-item {
  display: flex;
  gap: toRem(10);
  align-items: center;
  font-weight: 700;
  color: var(--text-secondary-main);
  letter-spacing: 0.1em;
}

.multiple-line-chart__legend-color {
  width: toRem(12);
  height: toRem(12);
  border-radius: 50%;
}
</style>
