"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ALL_DAY_TIMES: () => ALL_DAY_TIMES,
  AvailabilityMonthCalendar: () => AvailabilityMonthCalendar,
  BUSINESS_HOUR_END_MINUTES: () => BUSINESS_HOUR_END_MINUTES,
  BUSINESS_HOUR_START_MINUTES: () => BUSINESS_HOUR_START_MINUTES,
  DayEditor: () => DayEditor,
  SLOT_STEP_MINUTES: () => SLOT_STEP_MINUTES,
  addMonths: () => addMonths,
  clearDayTimes: () => clearDayTimes,
  defaultBusinessHourTimes: () => defaultBusinessHourTimes,
  formatTimeAmPm: () => formatTimeAmPm,
  getDayTimes: () => getDayTimes,
  getMonthGridDays: () => getMonthGridDays,
  minutesToTimeLabel: () => minutesToTimeLabel,
  monthDateKeys: () => monthDateKeys,
  monthLabel: () => monthLabel,
  normalizeAvailabilityTimes: () => normalizeAvailabilityTimes,
  parseDateKey: () => parseDateKey,
  rangesToTimes: () => rangesToTimes,
  setDayTimes: () => setDayTimes,
  startOfMonth: () => startOfMonth,
  summarizeDayHours: () => summarizeDayHours,
  timeToMinutes: () => timeToMinutes,
  timesToRanges: () => timesToRanges,
  toDateKey: () => toDateKey
});
module.exports = __toCommonJS(index_exports);

// src/availability-month-calendar.tsx
var React2 = __toESM(require("react"), 1);

// src/day-editor.tsx
var React = __toESM(require("react"), 1);

// src/helpers.ts
var SLOT_STEP_MINUTES = 30;
var BUSINESS_HOUR_START_MINUTES = 9 * 60;
var BUSINESS_HOUR_END_MINUTES = 17 * 60;
var TIME_RE = /^([01]\d|2[0-3]):(00|30)$/;
var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function pad2(n) {
  return String(n).padStart(2, "0");
}
function minutesToTimeLabel(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${pad2(hours)}:${pad2(minutes)}`;
}
function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}
function formatTimeAmPm(time24h) {
  const [hourPart, minutePart] = time24h.split(":");
  const hour24 = Number(hourPart);
  const minute = Number(minutePart);
  if (!Number.isFinite(hour24) || !Number.isFinite(minute)) return time24h;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${pad2(minute)} ${period}`;
}
var ALL_DAY_TIMES = Array.from(
  { length: 24 * 60 / SLOT_STEP_MINUTES },
  (_, index) => minutesToTimeLabel(index * SLOT_STEP_MINUTES)
);
function defaultBusinessHourTimes() {
  const times = [];
  for (let m = BUSINESS_HOUR_START_MINUTES; m < BUSINESS_HOUR_END_MINUTES; m += SLOT_STEP_MINUTES) {
    times.push(minutesToTimeLabel(m));
  }
  return times;
}
function normalizeAvailabilityTimes(times) {
  const unique = /* @__PURE__ */ new Set();
  for (const value of times) {
    const trimmed = value.trim();
    if (!TIME_RE.test(trimmed)) continue;
    unique.add(trimmed);
  }
  return [...unique].sort();
}
function toDateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}
function parseDateKey(dateKey) {
  if (!DATE_RE.test(dateKey)) return null;
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}
function monthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
function getMonthGridDays(month) {
  const first = startOfMonth(month);
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = new Date(first.getFullYear(), first.getMonth(), first.getDate() - startOffset);
  return Array.from({ length: 42 }, (_, i) => {
    return new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
  });
}
function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function timesToRanges(times) {
  const sorted = normalizeAvailabilityTimes(times);
  if (sorted.length === 0) return [];
  const ranges = [];
  let rangeStart = sorted[0];
  let prev = timeToMinutes(sorted[0]);
  for (let i = 1; i < sorted.length; i++) {
    const current = timeToMinutes(sorted[i]);
    if (current !== prev + SLOT_STEP_MINUTES) {
      ranges.push({
        start: rangeStart,
        end: minutesToTimeLabel(prev + SLOT_STEP_MINUTES)
      });
      rangeStart = sorted[i];
    }
    prev = current;
  }
  ranges.push({
    start: rangeStart,
    end: minutesToTimeLabel(prev + SLOT_STEP_MINUTES)
  });
  return ranges;
}
function rangesToTimes(ranges) {
  const times = [];
  for (const range of ranges) {
    if (!TIME_RE.test(range.start)) continue;
    let endMinutes = TIME_RE.test(range.end) ? timeToMinutes(range.end) : timeToMinutes(range.start) + SLOT_STEP_MINUTES;
    if (endMinutes <= timeToMinutes(range.start)) {
      endMinutes = timeToMinutes(range.start) + SLOT_STEP_MINUTES;
    }
    for (let m = timeToMinutes(range.start); m < endMinutes; m += SLOT_STEP_MINUTES) {
      if (m >= 24 * 60) break;
      times.push(minutesToTimeLabel(m));
    }
  }
  return normalizeAvailabilityTimes(times);
}
function summarizeDayHours(times) {
  if (times.length === 0) return "Closed";
  if (times.length === ALL_DAY_TIMES.length) return "Open 24 hours";
  const labels = timesToRanges(times).map(
    (range) => `${formatTimeAmPm(range.start)} \u2013 ${formatTimeAmPm(range.end)}`
  );
  return labels.length > 2 ? `${labels.slice(0, 2).join(", ")} +${labels.length - 2} more` : labels.join(", ");
}
function setDayTimes(days, dateKey, times) {
  return {
    ...days,
    [dateKey]: normalizeAvailabilityTimes(times)
  };
}
function clearDayTimes(days, dateKey) {
  if (!Object.prototype.hasOwnProperty.call(days, dateKey)) return days;
  const next = { ...days };
  delete next[dateKey];
  return next;
}
function getDayTimes(days, dateKey) {
  if (!Object.prototype.hasOwnProperty.call(days, dateKey)) return [];
  return normalizeAvailabilityTimes(days[dateKey] ?? []);
}
function monthDateKeys(month) {
  const start = startOfMonth(month);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  return { fromDate: toDateKey(start), toDate: toDateKey(end) };
}

// src/day-editor.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var DAY_PERIODS = [
  { label: "Overnight", range: "12 AM \u2013 6 AM" },
  { label: "Morning", range: "6 AM \u2013 12 PM" },
  { label: "Afternoon", range: "12 PM \u2013 6 PM" },
  { label: "Evening", range: "6 PM \u2013 12 AM" }
].map((period, index) => ({
  ...period,
  times: ALL_DAY_TIMES.slice(index * 12, index * 12 + 12)
}));
function DayEditor({
  dateKey,
  dateLabel,
  times,
  onChange,
  onClose,
  disabled = false,
  sectionTitle,
  tone = "green",
  showClose = true,
  isOverride = false,
  onClearOverride
}) {
  const openTimes = React.useMemo(() => new Set(times), [times]);
  const isOpen = openTimes.size > 0;
  const isAllDay = openTimes.size === ALL_DAY_TIMES.length;
  const [periodIndex, setPeriodIndex] = React.useState(1);
  const period = DAY_PERIODS[periodIndex];
  const titleId = sectionTitle ? `fca-day-${dateKey}-${sectionTitle.replace(/\s+/g, "-").toLowerCase()}` : `fca-day-${dateKey}`;
  function setTimes(next) {
    onChange(normalizeAvailabilityTimes(next));
  }
  function toggleTime(time) {
    if (disabled) return;
    if (openTimes.has(time)) {
      setTimes(times.filter((value) => value !== time));
    } else {
      setTimes([...times, time]);
    }
  }
  function setDayOpen(open) {
    if (disabled) return;
    setTimes(open ? defaultBusinessHourTimes() : []);
  }
  function toggleAllDay() {
    if (disabled) return;
    setTimes(isAllDay ? defaultBusinessHourTimes() : [...ALL_DAY_TIMES]);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: [
        "fca-day-editor",
        sectionTitle ? "fca-day-editor--section" : "",
        `fca-day-editor--${tone}`
      ].filter(Boolean).join(" "),
      role: sectionTitle ? "group" : "dialog",
      "aria-labelledby": titleId,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "fca-day-editor__header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { id: titleId, className: "fca-day-editor__title", children: sectionTitle ?? dateLabel }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "fca-day-editor__summary", children: summarizeDayHours(times) })
          ] }),
          showClose && onClose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "fca-btn fca-btn--ghost", onClick: onClose, children: "Done" }) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "fca-day-editor__toolbar", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "fca-switch", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                type: "checkbox",
                checked: isOpen,
                disabled,
                onChange: (event) => setDayOpen(event.target.checked)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isOpen ? "Open" : isOverride ? "Off" : "Closed" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "fca-day-editor__toolbar-actions", children: [
            isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: `fca-chip${isAllDay ? " fca-chip--active" : ""}`,
                "aria-pressed": isAllDay,
                disabled,
                onClick: toggleAllDay,
                children: "24 hours"
              }
            ) : null,
            isOverride && onClearOverride ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: "fca-chip",
                disabled,
                onClick: () => {
                  if (disabled) return;
                  onClearOverride();
                },
                children: "Clear override"
              }
            ) : null
          ] })
        ] }),
        isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fca-period-tabs", role: "tablist", "aria-label": "Part of the day", children: DAY_PERIODS.map((p, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": index === periodIndex,
              className: `fca-period-tabs__item${index === periodIndex ? " is-active" : ""}`,
              onClick: () => setPeriodIndex(index),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fca-period-tabs__label", children: p.label }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fca-period-tabs__range", children: p.range })
              ]
            },
            p.label
          )) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fca-slot-grid", children: period.times.map((time) => {
            const open = openTimes.has(time);
            return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                "aria-pressed": open,
                disabled,
                "aria-label": `${formatTimeAmPm(time)}, ${open ? "open" : "blocked"}`,
                className: `fca-slot${open ? " is-open" : " is-blocked"}`,
                onClick: () => toggleTime(time),
                children: formatTimeAmPm(time).replace(" ", "")
              },
              time
            );
          }) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "fca-day-editor__hint", children: isOverride ? "This day is Off for clients. Clear override to make it blank, or turn it on to set hours." : "This day is blank (not bookable). Turn it on to set open hours." })
      ]
    }
  );
}

// src/availability-month-calendar.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function normalizeSchedules(props) {
  if (props.schedules && props.schedules.length > 0) return props.schedules;
  return [
    {
      id: "default",
      shortLabel: "Open",
      label: "Availability",
      tone: "green",
      days: props.value ?? {}
    }
  ];
}
function isExplicitDay(schedule, dateKey) {
  if (schedule.explicitDays !== void 0) {
    return Object.prototype.hasOwnProperty.call(schedule.explicitDays, dateKey);
  }
  return Object.prototype.hasOwnProperty.call(schedule.days, dateKey);
}
function badgeLabel(shortLabel, state) {
  return state === "open" ? `${shortLabel} Open` : `${shortLabel} Off`;
}
function AvailabilityMonthCalendar(props) {
  const {
    schedules: schedulesProp,
    onSchedulesChange,
    value,
    onChange,
    month: controlledMonth,
    onMonthChange,
    timeZone,
    disabled = false,
    className
  } = props;
  const schedules = normalizeSchedules(props);
  const multi = Boolean(schedulesProp && schedulesProp.length > 0);
  const [internalMonth, setInternalMonth] = React2.useState(
    () => startOfMonth(controlledMonth ?? /* @__PURE__ */ new Date())
  );
  const month = controlledMonth ? startOfMonth(controlledMonth) : internalMonth;
  const [selectedKey, setSelectedKey] = React2.useState(null);
  const today = React2.useMemo(() => /* @__PURE__ */ new Date(), []);
  const gridDays = React2.useMemo(() => getMonthGridDays(month), [month]);
  function setMonth(next) {
    const normalized = startOfMonth(next);
    if (!controlledMonth) setInternalMonth(normalized);
    onMonthChange?.(normalized);
  }
  function updateScheduleDay(scheduleId, dateKey, nextTimes) {
    if (multi) {
      const next = schedules.map((schedule) => {
        if (schedule.id !== scheduleId) return schedule;
        const nextDays = setDayTimes(schedule.days, dateKey, nextTimes);
        const nextExplicit = setDayTimes(schedule.explicitDays ?? {}, dateKey, nextTimes);
        return {
          ...schedule,
          days: nextDays,
          explicitDays: nextExplicit
        };
      });
      onSchedulesChange?.(next);
      return;
    }
    onChange?.(setDayTimes(value ?? {}, dateKey, nextTimes));
  }
  function clearScheduleDay(scheduleId, dateKey) {
    if (multi) {
      const next = schedules.map((schedule) => {
        if (schedule.id !== scheduleId) return schedule;
        return {
          ...schedule,
          days: clearDayTimes(schedule.days, dateKey),
          explicitDays: clearDayTimes(schedule.explicitDays ?? {}, dateKey)
        };
      });
      onSchedulesChange?.(next);
      return;
    }
    onChange?.(clearDayTimes(value ?? {}, dateKey));
  }
  const selectedDate = selectedKey ? gridDays.find((day) => toDateKey(day) === selectedKey) ?? null : null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: ["fca-root", className].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "fca-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "fca-header__nav", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: "fca-btn fca-btn--ghost",
            "aria-label": "Previous month",
            disabled,
            onClick: () => setMonth(addMonths(month, -1)),
            children: "\u2039"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { className: "fca-header__title", children: monthLabel(month) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: "fca-btn fca-btn--ghost",
            "aria-label": "Next month",
            disabled,
            onClick: () => setMonth(addMonths(month, 1)),
            children: "\u203A"
          }
        )
      ] }),
      timeZone ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "fca-header__tz", children: [
        timeZone.replace(/_/g, " "),
        " \xB7 30-minute slots"
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "fca-header__tz", children: "30-minute slots \xB7 click a day to set hours" }),
      multi ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "fca-header__legend", children: schedules.map((schedule) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "span",
        {
          className: `fca-legend-item fca-legend-item--${schedule.tone ?? "neutral"}`,
          children: [
            schedule.shortLabel,
            " = ",
            schedule.label
          ]
        },
        schedule.id
      )) }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "fca-weekdays", "aria-hidden": true, children: WEEKDAY_LABELS.map((label) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "fca-weekdays__item", children: label }, label)) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "fca-month-grid", role: "grid", "aria-label": monthLabel(month), children: gridDays.map((day) => {
      const dateKey = toDateKey(day);
      const inMonth = isSameMonth(day, month);
      const isToday = isSameDay(day, today);
      const isSelected = selectedKey === dateKey;
      const badges = schedules.map((schedule) => {
        const hasExplicit = isExplicitDay(schedule, dateKey);
        const explicitTimes = hasExplicit ? getDayTimes(schedule.explicitDays ?? schedule.days, dateKey) : [];
        const open = hasExplicit && explicitTimes.length > 0;
        const state = hasExplicit ? open ? "open" : "off" : null;
        return {
          id: schedule.id,
          shortLabel: schedule.shortLabel,
          tone: schedule.tone ?? "neutral",
          hasExplicit,
          open,
          state,
          summary: state ? badgeLabel(schedule.shortLabel, state) : `${schedule.shortLabel}: not set (default hours)`
        };
      });
      const visibleBadges = badges.filter((badge) => badge.state !== null);
      const anyExplicitOpen = badges.some((badge) => badge.hasExplicit && badge.open);
      const anyExplicitClosed = badges.some(
        (badge) => badge.hasExplicit && !badge.open
      );
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "button",
        {
          type: "button",
          role: "gridcell",
          disabled: disabled || !inMonth,
          "aria-label": `${dateKey}, ${badges.map((b) => b.summary).join("; ")}`,
          "aria-pressed": isSelected,
          className: [
            "fca-day",
            inMonth ? "" : "is-outside",
            isToday ? "is-today" : "",
            isSelected ? "is-selected" : "",
            anyExplicitOpen ? "is-open" : "",
            anyExplicitClosed && !anyExplicitOpen ? "is-closed" : ""
          ].filter(Boolean).join(" "),
          onClick: () => {
            if (!inMonth || disabled) return;
            setSelectedKey(dateKey);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "fca-day__number", children: day.getDate() }),
            visibleBadges.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "fca-day__badges", children: visibleBadges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "span",
              {
                className: [
                  "fca-day__badge",
                  `fca-day__badge--${badge.tone}`,
                  badge.state === "off" ? "fca-day__badge--off" : ""
                ].filter(Boolean).join(" "),
                children: badge.summary
              },
              badge.id
            )) }) : null
          ]
        },
        dateKey
      );
    }) }),
    selectedKey && selectedDate ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "fca-day-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "fca-day-panel__header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { className: "fca-day-panel__title", children: selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          }) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "fca-day-panel__hint", children: multi ? "Both services on this day \u2014 edit each separately. Saving marks the day as an override." : "Set open hours for this day. Saving marks the day as an override." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: "fca-btn fca-btn--ghost",
            onClick: () => setSelectedKey(null),
            children: "Done"
          }
        )
      ] }),
      schedules.map((schedule) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        DayEditor,
        {
          dateKey: selectedKey,
          dateLabel: schedule.label,
          sectionTitle: schedule.label,
          tone: schedule.tone ?? "green",
          showClose: false,
          times: getDayTimes(schedule.days, selectedKey),
          disabled,
          isOverride: isExplicitDay(schedule, selectedKey),
          onClearOverride: () => {
            clearScheduleDay(schedule.id, selectedKey);
          },
          onChange: (nextTimes) => {
            updateScheduleDay(schedule.id, selectedKey, nextTimes);
          }
        },
        schedule.id
      ))
    ] }) : null
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ALL_DAY_TIMES,
  AvailabilityMonthCalendar,
  BUSINESS_HOUR_END_MINUTES,
  BUSINESS_HOUR_START_MINUTES,
  DayEditor,
  SLOT_STEP_MINUTES,
  addMonths,
  clearDayTimes,
  defaultBusinessHourTimes,
  formatTimeAmPm,
  getDayTimes,
  getMonthGridDays,
  minutesToTimeLabel,
  monthDateKeys,
  monthLabel,
  normalizeAvailabilityTimes,
  parseDateKey,
  rangesToTimes,
  setDayTimes,
  startOfMonth,
  summarizeDayHours,
  timeToMinutes,
  timesToRanges,
  toDateKey
});
//# sourceMappingURL=index.cjs.map