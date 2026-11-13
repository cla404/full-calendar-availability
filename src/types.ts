/** `YYYY-MM-DD` → open start times on a 30-minute grid (`HH:00` | `HH:30`). */
export type AvailabilityDays = Record<string, string[]>

export type AvailabilityTime = string

export interface TimeRange {
  start: string
  end: string
}

export type AvailabilityScheduleId = string

export interface AvailabilitySchedule {
  id: AvailabilityScheduleId
  /** Short badge label, e.g. "N" or "C". */
  shortLabel: string
  /** Full section title, e.g. "Notarization". */
  label: string
  /** Accent used for badges / section chrome: "green" | "blue" | "neutral". */
  tone?: "green" | "blue" | "neutral"
  /**
   * Hours shown in the grid and day editor (effective availability).
   * May include weekly/default fallbacks for dates not in `explicitDays`.
   */
  days: AvailabilityDays
  /**
   * Date keys the host has explicitly saved/overridden.
   * Missing key → badge shows "Default" (fallback hours from `days`).
   * Present with times → "Open"; present empty → "Off".
   * When omitted, every key in `days` is treated as explicit (legacy).
   */
  explicitDays?: AvailabilityDays
}

export interface AvailabilityMonthCalendarProps {
  /**
   * Multi-purpose schedules shown on one month grid.
   * Prefer this over `value` / `onChange` for dual notarization + consultation.
   */
  schedules?: AvailabilitySchedule[]
  onSchedulesChange?: (next: AvailabilitySchedule[]) => void
  /** Controlled map of date → open start times (single-schedule mode). */
  value?: AvailabilityDays
  /** Called with the full next days map after any edit (single-schedule mode). */
  onChange?: (next: AvailabilityDays) => void
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
