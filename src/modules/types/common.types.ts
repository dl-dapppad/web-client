import { OVERVIEW_ROW } from '@/modules/enums'

export interface OverviewRow {
  name: string
  value: string
  type: OVERVIEW_ROW
}

export interface OverviewRowWithId extends OverviewRow {
  id: string
}
