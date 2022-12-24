import { DateUtil } from '@/utils/date.util'

export function formatDMYTime(date: number | string) {
  return DateUtil.format(
    typeof date == 'number' ? DateUtil.fromTimestampSec(date) : date,
    'MMM DD, YYYY, HH:mm',
  )
}
