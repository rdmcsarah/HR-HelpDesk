// "use client"
// import * as React from "react"
// import { Calendar } from "@/components/ui/calendar"

// export function Calendar02() {
//   const [date, setDate] = React.useState<Date | undefined>(
//     new Date(2025, 5, 12)
//   )

//   return (
//     <Calendar
//       mode="single"
//       defaultMonth={date}
//       numberOfMonths={2}
//       selected={date}
//       onSelect={setDate}
//       className="rounded-lg border shadow-sm"
//       captionLayout="dropdown"
//       fromYear={2000}
//       toYear={2030}
//     />
//   )
// }

"use client"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"

export function Calendar02({
  startDate,
  endDate,
  onSelect,
}: {
  startDate?: Date
  endDate?: Date
  onSelect: (range: DateRange | undefined) => void
}) {
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      captionLayout="dropdown"
      fromYear={2000}
      toYear={2030}
      selected={{ from: startDate, to: endDate }}
      onSelect={onSelect}
      className="rounded-lg border shadow bg-white dark:bg-gray-800 dark:border-gray-700"
    />
  )
}
