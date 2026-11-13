"use client"

import * as React from "react"

import { DayEditor } from "./day-editor"
import {
  addMonths,
  getDayTimes,
  getMonthGridDays,
  isSameDay,
  isSameMonth,
  monthLabel,
  setDayTimes,
  startOfMonth,
  toDateKey,
} from "./helpers"
import type {
  AvailabilityMonthCalendarProps,
  AvailabilitySchedule,
} from "./types"

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function normalizeSchedules(props: AvailabilityMonthCalendarProps): AvailabilitySchedule[] {
  if (props.schedules && props.schedules.length > 0) return props.schedules
  return [
    {
      id: "default",
      shortLabel: "Open",
      label: "Availability",
      tone: "green",
      days: props.value ?? {},
    },
  ]
}

function isExplicitDay(schedule: AvailabilitySchedule, dateKey: string): boolean {
  if (schedule.explicitDays !== undefined) {
    return Object.prototype.hasOwnProperty.call(schedule.explicitDays, dateKey)
  }
  return Object.prototype.hasOwnProperty.call(schedule.days, dateKey)
}

type DayBadgeState = "open" | "off" | "default"

function badgeLabel(shortLabel: string, state: DayBadgeState): string {
  if (state === "open") return `${shortLabel} Open`
  if (state === "off") return `${shortLabel} Off`
  return `${shortLabel} Default`
}

export function AvailabilityMonthCalendar(props: AvailabilityMonthCalendarProps) {
  const {
    schedules: schedulesProp,
    onSchedulesChange,
    value,
    onChange,
    month: controlledMonth,
    onMonthChange,
    timeZone,
    disabled = false,
    className,
  } = props

  const schedules = normalizeSchedules(props)
  const multi = Boolean(schedulesProp && schedulesProp.length > 0)

  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(controlledMonth ?? new Date())
  )
  const month = controlledMonth ? startOfMonth(controlledMonth) : internalMonth
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null)
  const today = React.useMemo(() => new Date(), [])
  const gridDays = React.useMemo(() => getMonthGridDays(month), [month])

  function setMonth(next: Date) {
    const normalized = startOfMonth(next)
    if (!controlledMonth) setInternalMonth(normalized)
    onMonthChange?.(normalized)
  }

  function updateScheduleDay(scheduleId: string, dateKey: string, nextTimes: string[]) {
    if (multi) {
      const next = schedules.map(schedule => {
        if (schedule.id !== scheduleId) return schedule
        const nextDays = setDayTimes(schedule.days, dateKey, nextTimes)
        const nextExplicit = setDayTimes(schedule.explicitDays ?? {}, dateKey, nextTimes)
        return {
          ...schedule,
          days: nextDays,
          explicitDays: nextExplicit,
        }
      })
      onSchedulesChange?.(next)
      return
    }
    onChange?.(setDayTimes(value ?? {}, dateKey, nextTimes))
  }

  const selectedDate = selectedKey
    ? gridDays.find(day => toDateKey(day) === selectedKey) ?? null
    : null

  return (
    <div className={["fca-root", className].filter(Boolean).join(" ")}>
      <div className="fca-header">
        <div className="fca-header__nav">
          <button
            type="button"
            className="fca-btn fca-btn--ghost"
            aria-label="Previous month"
            disabled={disabled}
            onClick={() => setMonth(addMonths(month, -1))}
          >
            ‹
          </button>
          <h2 className="fca-header__title">{monthLabel(month)}</h2>
          <button
            type="button"
            className="fca-btn fca-btn--ghost"
            aria-label="Next month"
            disabled={disabled}
            onClick={() => setMonth(addMonths(month, 1))}
          >
            ›
          </button>
        </div>
        {timeZone ? (
          <p className="fca-header__tz">{timeZone.replace(/_/g, " ")} · 30-minute slots</p>
        ) : (
          <p className="fca-header__tz">30-minute slots · click a day to set hours</p>
        )}
        {multi ? (
          <p className="fca-header__legend">
            {schedules.map(schedule => (
              <span
                key={schedule.id}
                className={`fca-legend-item fca-legend-item--${schedule.tone ?? "neutral"}`}
              >
                {schedule.shortLabel} = {schedule.label}
              </span>
            ))}
          </p>
        ) : null}
      </div>

      <div className="fca-weekdays" aria-hidden>
        {WEEKDAY_LABELS.map(label => (
          <div key={label} className="fca-weekdays__item">
            {label}
          </div>
        ))}
      </div>

      <div className="fca-month-grid" role="grid" aria-label={monthLabel(month)}>
        {gridDays.map(day => {
          const dateKey = toDateKey(day)
          const inMonth = isSameMonth(day, month)
          const isToday = isSameDay(day, today)
          const isSelected = selectedKey === dateKey
          const badges = schedules.map(schedule => {
            const hasExplicit = isExplicitDay(schedule, dateKey)
            const times = getDayTimes(schedule.days, dateKey)
            const open = times.length > 0
            const state: DayBadgeState = hasExplicit
              ? open
                ? "open"
                : "off"
              : "default"
            return {
              id: schedule.id,
              shortLabel: schedule.shortLabel,
              tone: schedule.tone ?? "neutral",
              hasExplicit,
              open,
              state,
              summary: badgeLabel(schedule.shortLabel, state),
            }
          })
          const anyOpen = badges.some(badge => badge.open)
          const anyExplicitClosed = badges.some(
            badge => badge.hasExplicit && !badge.open
          )

          return (
            <button
              key={dateKey}
              type="button"
              role="gridcell"
              disabled={disabled || !inMonth}
              aria-label={`${dateKey}, ${badges.map(b => `${b.shortLabel}: ${b.summary}`).join("; ")}`}
              aria-pressed={isSelected}
              className={[
                "fca-day",
                inMonth ? "" : "is-outside",
                isToday ? "is-today" : "",
                isSelected ? "is-selected" : "",
                anyOpen ? "is-open" : "",
                anyExplicitClosed && !anyOpen ? "is-closed" : "",
                !anyOpen && !anyExplicitClosed && badges.every(b => b.state === "default")
                  ? "is-default"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (!inMonth || disabled) return
                setSelectedKey(dateKey)
              }}
            >
              <span className="fca-day__number">{day.getDate()}</span>
              <span className="fca-day__badges">
                {badges.map(badge => (
                  <span
                    key={badge.id}
                    className={[
                      "fca-day__badge",
                      badge.state === "default"
                        ? "fca-day__badge--default"
                        : `fca-day__badge--${badge.tone}`,
                      badge.state === "off" ? "fca-day__badge--off" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {badge.summary}
                  </span>
                ))}
              </span>
            </button>
          )
        })}
      </div>

      {selectedKey && selectedDate ? (
        <div className="fca-day-panel">
          <div className="fca-day-panel__header">
            <div>
              <h3 className="fca-day-panel__title">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <p className="fca-day-panel__hint">
                {multi
                  ? "Both services on this day — edit each separately. Saving marks the day as an override."
                  : "Set open hours for this day. Saving marks the day as an override."}
              </p>
            </div>
            <button
              type="button"
              className="fca-btn fca-btn--ghost"
              onClick={() => setSelectedKey(null)}
            >
              Done
            </button>
          </div>
          {schedules.map(schedule => (
            <DayEditor
              key={schedule.id}
              dateKey={selectedKey}
              dateLabel={schedule.label}
              sectionTitle={schedule.label}
              tone={schedule.tone ?? "green"}
              showClose={false}
              times={getDayTimes(schedule.days, selectedKey)}
              disabled={disabled}
              onChange={nextTimes => {
                updateScheduleDay(schedule.id, selectedKey, nextTimes)
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
