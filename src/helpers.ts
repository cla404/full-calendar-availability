import type { AvailabilityDays, TimeRange } from "./types"

export const SLOT_STEP_MINUTES = 30
export const BUSINESS_HOUR_START_MINUTES = 9 * 60
export const BUSINESS_HOUR_END_MINUTES = 17 * 60

const TIME_RE = /^([01]\d|2[0-3]):(00|30)$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

export function minutesToTimeLabel(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${pad2(hours)}:${pad2(minutes)}`
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return (hours ?? 0) * 60 + (minutes ?? 0)
}

export function formatTimeAmPm(time24h: string): string {
  const [hourPart, minutePart] = time24h.split(":")
  const hour24 = Number(hourPart)
  const minute = Number(minutePart)
  if (!Number.isFinite(hour24) || !Number.isFinite(minute)) return time24h
  const period = hour24 >= 12 ? "PM" : "AM"
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  return `${hour12}:${pad2(minute)} ${period}`
}

/** Every bookable start in a day: 00:00 … 23:30. */
export const ALL_DAY_TIMES: readonly string[] = Array.from(
  { length: (24 * 60) / SLOT_STEP_MINUTES },
  (_, index) => minutesToTimeLabel(index * SLOT_STEP_MINUTES)
)

export function defaultBusinessHourTimes(): string[] {
  const times: string[] = []
  for (let m = BUSINESS_HOUR_START_MINUTES; m < BUSINESS_HOUR_END_MINUTES; m += SLOT_STEP_MINUTES) {
    times.push(minutesToTimeLabel(m))
  }
  return times
}

export function normalizeAvailabilityTimes(times: Iterable<string>): string[] {
  const unique = new Set<string>()
  for (const value of times) {
    const trimmed = value.trim()
    if (!TIME_RE.test(trimmed)) continue
    unique.add(trimmed)
  }
  return [...unique].sort()
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function parseDateKey(dateKey: string): Date | null {
  if (!DATE_RE.test(dateKey)) return null
  const [y, m, d] = dateKey.split("-").map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

export function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

/** Monday-first grid cells for a month (includes leading/trailing days). */
export function getMonthGridDays(month: Date): Date[] {
  const first = startOfMonth(month)
  const startOffset = (first.getDay() + 6) % 7 // Monday = 0
  const gridStart = new Date(first.getFullYear(), first.getMonth(), first.getDate() - startOffset)
  return Array.from({ length: 42 }, (_, i) => {
    return new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
  })
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Collapse consecutive 30-min starts into inclusive display ranges (end = last start + 30). */
export function timesToRanges(times: readonly string[]): TimeRange[] {
  const sorted = normalizeAvailabilityTimes(times)
  if (sorted.length === 0) return []
  const ranges: TimeRange[] = []
  let rangeStart = sorted[0]!
  let prev = timeToMinutes(sorted[0]!)
  for (let i = 1; i < sorted.length; i++) {
    const current = timeToMinutes(sorted[i]!)
    if (current !== prev + SLOT_STEP_MINUTES) {
      ranges.push({
        start: rangeStart,
        end: minutesToTimeLabel(prev + SLOT_STEP_MINUTES),
      })
      rangeStart = sorted[i]!
    }
    prev = current
  }
  ranges.push({
    start: rangeStart,
    end: minutesToTimeLabel(prev + SLOT_STEP_MINUTES),
  })
  return ranges
}

/** Expand ranges into 30-min start times. End is exclusive. */
export function rangesToTimes(ranges: readonly TimeRange[]): string[] {
  const times: string[] = []
  for (const range of ranges) {
    if (!TIME_RE.test(range.start)) continue
    let endMinutes = TIME_RE.test(range.end) ? timeToMinutes(range.end) : timeToMinutes(range.start) + SLOT_STEP_MINUTES
    if (endMinutes <= timeToMinutes(range.start)) {
      endMinutes = timeToMinutes(range.start) + SLOT_STEP_MINUTES
    }
    for (let m = timeToMinutes(range.start); m < endMinutes; m += SLOT_STEP_MINUTES) {
      if (m >= 24 * 60) break
      times.push(minutesToTimeLabel(m))
    }
  }
  return normalizeAvailabilityTimes(times)
}

export function summarizeDayHours(times: readonly string[]): string {
  if (times.length === 0) return "Closed"
  if (times.length === ALL_DAY_TIMES.length) return "Open 24 hours"
  const labels = timesToRanges(times).map(
    range => `${formatTimeAmPm(range.start)} – ${formatTimeAmPm(range.end)}`
  )
  return labels.length > 2
    ? `${labels.slice(0, 2).join(", ")} +${labels.length - 2} more`
    : labels.join(", ")
}

export function setDayTimes(
  days: AvailabilityDays,
  dateKey: string,
  times: readonly string[]
): AvailabilityDays {
  return {
    ...days,
    [dateKey]: normalizeAvailabilityTimes(times),
  }
}

/** Remove a date key so the day is blank (no override). */
export function clearDayTimes(days: AvailabilityDays, dateKey: string): AvailabilityDays {
  if (!Object.prototype.hasOwnProperty.call(days, dateKey)) return days
  const next = { ...days }
  delete next[dateKey]
  return next
}

export function getDayTimes(days: AvailabilityDays, dateKey: string): string[] {
  if (!Object.prototype.hasOwnProperty.call(days, dateKey)) return []
  return normalizeAvailabilityTimes(days[dateKey] ?? [])
}

export function monthDateKeys(month: Date): { fromDate: string; toDate: string } {
  const start = startOfMonth(month)
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  return { fromDate: toDateKey(start), toDate: toDateKey(end) }
}
