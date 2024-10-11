"use client"

import { DateRange as LibDateRange, RangeKeyDict, Range } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { fr } from 'date-fns/locale';

interface CalendarProps {
    value: Range;
    onChange: (value: Range) => void;
    disabledDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    onChange,
    disabledDates
}) => {
    return (
        <LibDateRange
            rangeColors={["#262626"]}
            ranges={[value]}
            date={new Date()}
            onChange={(item: RangeKeyDict) => {
                const selection = item[value.key || 'selection'];
                if (selection.startDate && selection.endDate) {
                    onChange({
                        startDate: selection.startDate,
                        endDate: selection.endDate,
                        key: value.key || 'selection'
                    });
                }
            }}
            direction="vertical"
            showDateDisplay={false}
            minDate={new Date()}
            disabledDates={disabledDates}
            locale={fr}
        />
    )
}

export default Calendar