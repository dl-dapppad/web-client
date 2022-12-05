import { ref } from 'vue'
import { Product } from '@/composables'
import { BN } from '@/utils'

export interface Point {
  y: number
  color: string
  marker: { enabled: boolean; radius: number }
}

export interface ChartData {
  values: Array<number | Point>
  currentY: number
  currentX: number
  currencySymbol: string
}

export const useChart = () => {
  const getChartDataEmpty = (): ChartData => {
    return {
      values: [],
      currentY: 0,
      currentX: 0,
      currencySymbol: '',
    }
  }

  const chartData = ref<ChartData>(getChartDataEmpty())

  const updateChartData = (
    product: Product,
    decimals: number,
    currencySymbol: string,
  ): void => {
    const _chartData = getChartDataEmpty()
    _chartData.values = []
    _chartData.currencySymbol = currencySymbol

    const basePrice = Number(
      new BN(product.currentPrice).fromFraction(decimals).toString(),
    )

    if (!basePrice) return

    const minPrice = Number(
      new BN(product.minPrice).fromFraction(decimals).toString(),
    )
    let currentPrice = basePrice
    const decreasePercent = Number(
      new BN(product.decreasePercent).fromFraction(27).toString(),
    )
    const salesCount = Number(product.salesCount)
    for (let i = salesCount; i > 0; i--) {
      const price = currentPrice / (1 - decreasePercent)

      _chartData.values.push(price)
      currentPrice = price
    }

    _chartData.values = _chartData.values.reverse()
    _chartData.values.push({
      y: basePrice,
      color: 'var(--secondary-main)',
      marker: { enabled: true, radius: 5 },
    })
    _chartData.currentY = basePrice
    _chartData.currentX = _chartData.values.length
    currentPrice = basePrice

    while (currentPrice > minPrice) {
      const price = currentPrice * (1 - decreasePercent)
      if (price < minPrice) {
        for (let i = 0; i < 5; i++) {
          _chartData.values.push(minPrice)
        }
      } else {
        _chartData.values.push(price)
      }

      currentPrice = price
    }

    chartData.value = _chartData
  }

  return {
    chartData,
    updateChartData,
  }
}
