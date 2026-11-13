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
  summarizeDayHours,
  toDateKey,
} from "./helpers"
import type {
  AvailabilityDays,
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

  function updateScheduleDays(scheduleId: string, nextDays: AvailabilityDays) {
    if (multi) {
      const next = schedules.map(schedule =>
        schedule.id === scheduleId ? { ...schedule, days: nextDays } : schedule
      )
      onSchedulesChange?.(next)
      return
    }
    onChange?.(nextDays)
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
            const hasExplicit = Object.prototype.hasOwnProperty.call(schedule.days, dateKey)
            const times = getDayTimes(schedule.days, dateKey)
            const open = times.length > 0
            return {
              id: schedule.id,
              shortLabel: schedule.shortLabel,
              tone: schedule.tone ?? "neutral",
              hasExplicit,
              open,
              summary: hasExplicit
                ? open
                  ? `${schedule.shortLabel} Open`
                  : `${schedule.shortLabel} Off`
                : "not set",
            }
          })
          const anyExplicit = badges.some(badge => badge.hasExplicit)
          const anyOpen = badges.some(badge => badge.hasExplicit && badge.open)
          const anyClosed = badges.some(badge => badge.hasExplicit && !badge.open)

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
                anyClosed && !anyOpen ? "is-closed" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (!inMonth || disabled) return
                setSelectedKey(dateKey)
              }}
            >
              <span className="fca-day__number">{day.getDate()}</span>
              {anyExplicit ? (
                <span className="fca-day__badges">
                  {badges.map(badge =>
                    badge.hasExplicit ? (
                      <span
                        key={badge.id}
                        className={`fca-day__badge fca-day__badge--${badge.tone}`}
                      >
                        {badge.open
                          ? `${badge.shortLabel} Open`
                          : `${badge.shortLabel} Off`}
                      </span>
                    ) : null
                  )}
                </span>
              ) : (
                <span className="fca-day__badge fca-day__badge--muted">—</span>
              )}
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
                  ? "Both services on this day — edit each separately."
                  : "Set open hours for this day."}
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
                updateScheduleDays(
                  schedule.id,
                  setDayTimes(schedule.days, selectedKey, nextTimes)
                )
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
