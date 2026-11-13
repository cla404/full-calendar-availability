import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import {
  AvailabilityMonthCalendar,
  type AvailabilityDays,
} from "../src/index"
import "../src/styles.css"

function Demo() {
  const [days, setDays] = useState<AvailabilityDays>({
    "2026-11-13": [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
    ],
    "2026-11-14": [],
    "2026-11-17": ["09:00", "09:30", "10:00", "10:30"],
  })
  const [month, setMonth] = useState(() => new Date(2026, 10, 1))

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>
)
