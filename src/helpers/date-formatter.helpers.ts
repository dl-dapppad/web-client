import { DateUtil } from '@/utils/date.util'

export function formatDMYTime(date: number | string) {
  return DateUtil.format(
    typeof date == 'number' ? DateUtil.fromTimestampSec(date) : date,
    'DD.MM.YYYY, HH:mm',
  )
}
