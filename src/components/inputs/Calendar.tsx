"use client"

import { Range, DateRange, RangeKeyDict } from "react-date-range";
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
        <DateRange
            rangeColors={["#262626"]}
            ranges={[value]}
            date={new Date()}
            onChange={(item: RangeKeyDict) => onChange(item.selection)}
            direction="vertical"
            showDateDisplay={false}
            minDate={new Date()}
            disabledDates={disabledDates}
            locale={fr}
        />
    )
}

export default Calendar