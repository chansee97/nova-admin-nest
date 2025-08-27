import { Transform } from 'class-transformer'

function pad(num: number): string {
  return String(num).padStart(2, '0')
}

function formatDate(value: Date, format: string): string {
  const map: Record<string, string> = {
    YYYY: String(value.getFullYear()),
    MM: pad(value.getMonth() + 1),
    DD: pad(value.getDate()),
    HH: pad(value.getHours()),
    mm: pad(value.getMinutes()),
    ss: pad(value.getSeconds()),
  }
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, token => map[token])
}

export function DateFormat(format = 'YYYY-MM-DD HH:mm:ss') {
  return Transform(({ value }) => {
    if (!(value instanceof Date)) return value
    return formatDate(value, format)
  })
}
