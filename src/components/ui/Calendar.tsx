import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  onDateRangeSelect?: (range: DateRange | undefined) => void;
}

export default function Calendar({ onDateRangeSelect }: CalendarProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const handleRangeSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    if (onDateRangeSelect) {
      onDateRangeSelect(newRange);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleRangeSelect}
        numberOfMonths={1}
        showOutsideDays
        className="text-sm"
        disabled={{ before: new Date() }}
      />
      {range?.from && range?.to && (
        <p className="mt-2 text-gray-700">
          Selected from {range.from.toLocaleDateString()} to {range.to.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}