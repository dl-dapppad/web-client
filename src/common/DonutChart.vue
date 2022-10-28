<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import Highcharts, { SeriesOptionsType } from 'highcharts'

const props = defineProps<{
  chartData: {
    data: {
      value: number
      label: string
      color: string
    }[]
    isLegendShown?: boolean
    title?: string
    subtitle?: string
  }
}>()

const chartInstanceElement = ref<HTMLElement | undefined>()

onMounted(() => {
  if (chartInstanceElement.value) {
    Highcharts.chart(
      chartInstanceElement.value,
      {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          plotBackgroundColor: 'transparent',
          width: null,
          style: {
            fontFamily: 'Montserrat',
          },
        },
        title: {
          text: props.chartData.title ? props.chartData.title : '',
          align: 'center',
          verticalAlign: 'middle',
          style: {
            color: 'var(--text-primary-main)',
            fontWeight: '800',
            fontSize: '2rem',
            'letter-spacing': '0.1em',
          },
        },
        subtitle: {
          text: props.chartData.subtitle ? props.chartData.subtitle : '',
          align: 'center',
          verticalAlign: 'middle',
          y: 40,
          style: {
            color: 'var(--text-primary-main)',
            fontWeight: '700',
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
        },
        series: [
          {
            animation: {
              duration: 750,
              easing: 'easeOutQuad',
            },
            data: props.chartData.data.map(el => ({
              name: el.label,
              y: +el.value,
              color: el.color,
            })),
            size: '100%',
            startAngle: 0,
          } as SeriesOptionsType,
        ],
      },
      () => ({}),
    )
  }
})
</script>

<template>
  <div class="donut-chart">
    <div id="donut-chart__instance" ref="chartInstanceElement"></div>
    <div class="donut-chart__legend" v-if="props.chartData.isLegendShown">
      <div
        class="donut-chart__legend-item"
        v-for="(item, ind) of props.chartData.data"
        :key="ind"
      >
        <div class="donut-chart__legend-key">
          <div
            class="donut-chart__legend-color"
            :style="{ backgroundColor: item.color }"
          />
          <span>{{ item.label }}</span>
        </div>
        <div class="donut-chart__legend-value">
          {{ `${item.value}%` }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.donut-chart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: toRem(40);
}

.donut-chart__instance {
  max-width: 100%;
  max-height: 100%;
}

.donut-chart__legend {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.donut-chart__legend-item {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: var(--text-secondary-main);
  letter-spacing: 0.1em;
}

.donut-chart__legend-key {
  display: flex;
  gap: toRem(10);
  align-items: center;
  width: 100%;
}

.donut-chart__legend-color {
  width: 100%;
  max-width: toRem(12);
  height: 100%;
  max-height: toRem(12);
  border-radius: 50%;
}
</style>
