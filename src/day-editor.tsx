"use client"

import * as React from "react"

import {
  ALL_DAY_TIMES,
  defaultBusinessHourTimes,
  formatTimeAmPm,
  normalizeAvailabilityTimes,
  summarizeDayHours,
} from "./helpers"

const DAY_PERIODS = [
  { label: "Overnight", range: "12 AM – 6 AM" },
  { label: "Morning", range: "6 AM – 12 PM" },
  { label: "Afternoon", range: "12 PM – 6 PM" },
  { label: "Evening", range: "6 PM – 12 AM" },
].map((period, index) => ({
  ...period,
  times: ALL_DAY_TIMES.slice(index * 12, index * 12 + 12),
}))

export interface DayEditorProps {
  dateKey: string
  dateLabel: string
  times: string[]
  onChange: (times: string[]) => void
  onClose: () => void
  disabled?: boolean
}

export function DayEditor({
  dateKey,
  dateLabel,
  times,
  onChange,
  onClose,
  disabled = false,
}: DayEditorProps) {
  const openTimes = React.useMemo(() => new Set(times), [times])
  const isOpen = openTimes.size > 0
  const isAllDay = openTimes.size === ALL_DAY_TIMES.length
  const [periodIndex, setPeriodIndex] = React.useState(1)
  const period = DAY_PERIODS[periodIndex]!

  function setTimes(next: string[]) {
    onChange(normalizeAvailabilityTimes(next))
  }

  function toggleTime(time: string) {
    if (disabled) return
    if (openTimes.has(time)) {
      setTimes(times.filter(value => value !== time))
    } else {
      setTimes([...times, time])
    }
  }

  function setDayOpen(open: boolean) {
    if (disabled) return
    setTimes(open ? defaultBusinessHourTimes() : [])
  }

  function toggleAllDay() {
    if (disabled) return
    setTimes(isAllDay ? defaultBusinessHourTimes() : [...ALL_DAY_TIMES])
  }

  return (
    <div className="fca-day-editor" role="dialog" aria-labelledby={`fca-day-${dateKey}`}>
      <div className="fca-day-editor__header">
        <div>
          <h3 id={`fca-day-${dateKey}`} className="fca-day-editor__title">
            {dateLabel}
          </h3>
          <p className="fca-day-editor__summary">{summarizeDayHours(times)}</p>
        </div>
        <button type="button" className="fca-btn fca-btn--ghost" onClick={onClose}>
          Done
        </button>
      </div>

      <div className="fca-day-editor__toolbar">
        <label className="fca-switch">
          <input
            type="checkbox"
            checked={isOpen}
            disabled={disabled}
            onChange={event => setDayOpen(event.target.checked)}
          />
          <span>{isOpen ? "Open" : "Closed"}</span>
        </label>
        {isOpen ? (
          <button
            type="button"
            className={`fca-chip${isAllDay ? " fca-chip--active" : ""}`}
            aria-pressed={isAllDay}
            disabled={disabled}
            onClick={toggleAllDay}
          >
            24 hours
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <>
          <div className="fca-period-tabs" role="tablist" aria-label="Part of the day">
            {DAY_PERIODS.map((p, index) => (
              <button
                key={p.label}
                type="button"
                role="tab"
                aria-selected={index === periodIndex}
                className={`fca-period-tabs__item${index === periodIndex ? " is-active" : ""}`}
                onClick={() => setPeriodIndex(index)}
              >
                <span className="fca-period-tabs__label">{p.label}</span>
                <span className="fca-period-tabs__range">{p.range}</span>
              </button>
            ))}
          </div>

          <div className="fca-slot-grid">
            {period.times.map(time => {
              const open = openTimes.has(time)
              return (
                <button
                  key={time}
                  type="button"
                  aria-pressed={open}
                  disabled={disabled}
                  aria-label={`${formatTimeAmPm(time)}, ${open ? "open" : "blocked"}`}
                  className={`fca-slot${open ? " is-open" : " is-blocked"}`}
                  onClick={() => toggleTime(time)}
                >
                  {formatTimeAmPm(time).replace(" ", "")}
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <p className="fca-day-editor__hint">This day is closed. Turn it on to set open hours.</p>
      )}
    </div>
  )
}
