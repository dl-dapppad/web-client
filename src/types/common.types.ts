import { ICON_NAMES, OVERVIEW_ROW } from '@/enums'

export type NotificationObjectPayload = {
  title?: string
  message: string
  iconName?: typeof ICON_NAMES | unknown
  link?: {
    label: string
    href: string
  }
}

export interface OverviewRow {
  name: string
  value: string
  type: OVERVIEW_ROW
}
