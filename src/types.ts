/** `YYYY-MM-DD` → open start times on a 30-minute grid (`HH:00` | `HH:30`). */
export type AvailabilityDays = Record<string, string[]>

export type AvailabilityTime = string

export interface TimeRange {
  start: string
  end: string
}

export interface AvailabilityMonthCalendarProps {
  /** Controlled map of date → open start times. */
  value: AvailabilityDays
  /** Called with the full next days map after any edit. */
  onChange: (next: AvailabilityDays) => void
  /** Month to display (any date within the month). Defaults to today. */
  month?: Date
  /** Called when the user navigates to another month. */
  onMonthChange?: (month: Date) => void
  /** IANA zone label for display only (editing uses calendar dates). */
  timeZone?: string
  /** Disable interactions. */
  disabled?: boolean
  /** Optional class on the root. */
  className?: string
}
