import { getTimezoneOffset } from 'date-fns-tz'

export function calculateTimezoneOffset (timeZone: string): number {
  return -getTimezoneOffset(timeZone, new Date()) / 60000
}
