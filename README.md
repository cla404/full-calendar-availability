# @cla404/full-calendar-availability

Month-first React availability calendar. Click a day to set open hours on a 30-minute grid. No week/day/year view switcher — month only.

## Install

```bash
pnpm add @cla404/full-calendar-availability
# or via git:
pnpm add github:cla404/full-calendar-availability
```

## Usage

```tsx
import { useState } from "react"
import {
  AvailabilityMonthCalendar,
  type AvailabilityDays,
  monthDateKeys,
} from "@cla404/full-calendar-availability"
import "@cla404/full-calendar-availability/styles.css"

export function ScheduleEditor() {
  const [days, setDays] = useState<AvailabilityDays>({})
  const [month, setMonth] = useState(() => new Date())

  // Load/save `days` for monthDateKeys(month) from your API
  void monthDateKeys(month)

  return (
    <AvailabilityMonthCalendar
      value={days}
      onChange={setDays}
      month={month}
      onMonthChange={setMonth}
      timeZone="Asia/Manila"
    />
  )
}
```

## Data shape

```ts
type AvailabilityDays = Record<string, string[]>
// "2026-11-13" → ["09:00", "09:30", "10:00", ...]
```

- Keys: `YYYY-MM-DD`
- Values: open **start** times on `:00` / `:30` only
- Empty array = day closed
- For multi-schedule mode, pass `days` (effective hours shown) and optional `explicitDays` (saved overrides). Badges: **Open** / **Off** when explicit, **Default** when falling back to weekly/defaults.

## API

| Export | Description |
|--------|-------------|
| `AvailabilityMonthCalendar` | Month grid + day editor |
| `DayEditor` | Standalone day hours editor |
| `timesToRanges` / `rangesToTimes` | Convert between slot lists and ranges |
| `monthDateKeys` | `{ fromDate, toDate }` for the visible month |

Peer dependencies: `react` and `react-dom` ≥ 18.

## License

MIT
