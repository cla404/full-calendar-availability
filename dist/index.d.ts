import * as React from 'react';

/** `YYYY-MM-DD` → open start times on a 30-minute grid (`HH:00` | `HH:30`). */
type AvailabilityDays = Record<string, string[]>;
type AvailabilityTime = string;
interface TimeRange {
    start: string;
    end: string;
}
type AvailabilityScheduleId = string;
interface AvailabilitySchedule {
    id: AvailabilityScheduleId;
    /** Short badge label, e.g. "N" or "C". */
    shortLabel: string;
    /** Full section title, e.g. "Notarization". */
    label: string;
    /** Accent used for badges / section chrome: "green" | "blue" | "neutral". */
    tone?: "green" | "blue" | "neutral";
    /**
     * Hours shown in the grid and day editor (effective availability).
     * May include weekly/default fallbacks for dates not in `explicitDays`.
     */
    days: AvailabilityDays;
    /**
     * Date keys the host has explicitly saved/overridden.
     * Missing key → blank cell (fallback hours still in `days` for the editor).
     * Present with times → "Open"; present empty → "Off".
     * When omitted, every key in `days` is treated as explicit (legacy).
     */
    explicitDays?: AvailabilityDays;
}
interface AvailabilityMonthCalendarProps {
    /**
     * Multi-purpose schedules shown on one month grid.
     * Prefer this over `value` / `onChange` for dual notarization + consultation.
     */
    schedules?: AvailabilitySchedule[];
    onSchedulesChange?: (next: AvailabilitySchedule[]) => void;
    /** Controlled map of date → open start times (single-schedule mode). */
    value?: AvailabilityDays;
    /** Called with the full next days map after any edit (single-schedule mode). */
    onChange?: (next: AvailabilityDays) => void;
    /** Month to display (any date within the month). Defaults to today. */
    month?: Date;
    /** Called when the user navigates to another month. */
    onMonthChange?: (month: Date) => void;
    /** IANA zone label for display only (editing uses calendar dates). */
    timeZone?: string;
    /** Disable interactions. */
    disabled?: boolean;
    /** Optional class on the root. */
    className?: string;
}

declare function AvailabilityMonthCalendar(props: AvailabilityMonthCalendarProps): React.JSX.Element;

interface DayEditorProps {
    dateKey: string;
    dateLabel: string;
    times: string[];
    onChange: (times: string[]) => void;
    onClose?: () => void;
    disabled?: boolean;
    /** When set, renders as a labeled purpose section (no Done button). */
    sectionTitle?: string;
    tone?: "green" | "blue" | "neutral";
    showClose?: boolean;
    /** True when this date has a saved Open/Off override. */
    isOverride?: boolean;
    /** Clear the override so the day becomes blank again. */
    onClearOverride?: () => void;
}
declare function DayEditor({ dateKey, dateLabel, times, onChange, onClose, disabled, sectionTitle, tone, showClose, isOverride, onClearOverride, }: DayEditorProps): React.JSX.Element;

declare const SLOT_STEP_MINUTES = 30;
declare const BUSINESS_HOUR_START_MINUTES: number;
declare const BUSINESS_HOUR_END_MINUTES: number;
declare function minutesToTimeLabel(totalMinutes: number): string;
declare function timeToMinutes(time: string): number;
declare function formatTimeAmPm(time24h: string): string;
/** Every bookable start in a day: 00:00 … 23:30. */
declare const ALL_DAY_TIMES: readonly string[];
declare function defaultBusinessHourTimes(): string[];
declare function normalizeAvailabilityTimes(times: Iterable<string>): string[];
declare function toDateKey(date: Date): string;
declare function parseDateKey(dateKey: string): Date | null;
declare function startOfMonth(date: Date): Date;
declare function addMonths(date: Date, months: number): Date;
declare function monthLabel(date: Date): string;
/** Monday-first grid cells for a month (includes leading/trailing days). */
declare function getMonthGridDays(month: Date): Date[];
/** Collapse consecutive 30-min starts into inclusive display ranges (end = last start + 30). */
declare function timesToRanges(times: readonly string[]): TimeRange[];
/** Expand ranges into 30-min start times. End is exclusive. */
declare function rangesToTimes(ranges: readonly TimeRange[]): string[];
declare function summarizeDayHours(times: readonly string[]): string;
declare function setDayTimes(days: AvailabilityDays, dateKey: string, times: readonly string[]): AvailabilityDays;
/** Remove a date key so the day is blank (no override). */
declare function clearDayTimes(days: AvailabilityDays, dateKey: string): AvailabilityDays;
declare function getDayTimes(days: AvailabilityDays, dateKey: string): string[];
declare function monthDateKeys(month: Date): {
    fromDate: string;
    toDate: string;
};

export { ALL_DAY_TIMES, type AvailabilityDays, AvailabilityMonthCalendar, type AvailabilityMonthCalendarProps, type AvailabilitySchedule, type AvailabilityScheduleId, type AvailabilityTime, BUSINESS_HOUR_END_MINUTES, BUSINESS_HOUR_START_MINUTES, DayEditor, type DayEditorProps, SLOT_STEP_MINUTES, type TimeRange, addMonths, clearDayTimes, defaultBusinessHourTimes, formatTimeAmPm, getDayTimes, getMonthGridDays, minutesToTimeLabel, monthDateKeys, monthLabel, normalizeAvailabilityTimes, parseDateKey, rangesToTimes, setDayTimes, startOfMonth, summarizeDayHours, timeToMinutes, timesToRanges, toDateKey };
