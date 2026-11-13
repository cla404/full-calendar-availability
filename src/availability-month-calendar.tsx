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
import type { AvailabilityMonthCalendarProps } from "./types"

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function AvailabilityMonthCalendar({
  value,
  onChange,
  month: controlledMonth,
  onMonthChange,
  timeZone,
  disabled = false,
  className,
}: AvailabilityMonthCalendarProps) {
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

  const selectedDate = selectedKey
    ? gridDays.find(day => toDateKey(day) === selectedKey) ?? null
    : null

  const selectedTimes = selectedKey ? getDayTimes(value, selectedKey) : []

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
          const times = getDayTimes(value, dateKey)
          const hasExplicit = Object.prototype.hasOwnProperty.call(value, dateKey)
          const open = times.length > 0
          const isToday = isSameDay(day, today)
          const isSelected = selectedKey === dateKey

          return (
            <button
              key={dateKey}
              type="button"
              role="gridcell"
              disabled={disabled || !inMonth}
              aria-label={`${dateKey}, ${hasExplicit ? summarizeDayHours(times) : "not set"}`}
              aria-pressed={isSelected}
              className={[
                "fca-day",
                inMonth ? "" : "is-outside",
                isToday ? "is-today" : "",
                isSelected ? "is-selected" : "",
                hasExplicit && open ? "is-open" : "",
                hasExplicit && !open ? "is-closed" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (!inMonth || disabled) return
                setSelectedKey(dateKey)
              }}
            >
              <span className="fca-day__number">{day.getDate()}</span>
              {hasExplicit ? (
                <span className="fca-day__badge">{open ? `${times.length}` : "Off"}</span>
              ) : (
                <span className="fca-day__badge fca-day__badge--muted">—</span>
              )}
            </button>
          )
        })}
      </div>

      {selectedKey && selectedDate ? (
        <DayEditor
          dateKey={selectedKey}
          dateLabel={selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          times={selectedTimes}
          disabled={disabled}
          onClose={() => setSelectedKey(null)}
          onChange={nextTimes => {
            onChange(setDayTimes(value, selectedKey, nextTimes))
          }}
        />
      ) : null}
    </div>
  )
}
