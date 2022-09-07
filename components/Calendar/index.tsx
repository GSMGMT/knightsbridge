import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import DatePicker from 'react-datepicker';
import {
  isThisYear,
  format,
  startOfToday,
  endOfDay,
  endOfToday,
} from 'date-fns';

import { Icon } from '@components/Icon';

import styles from './Calendar.module.scss';

interface CalendarProps {
  className: string;
  handleSetDate: (type: 'START' | 'END', date: Date | undefined) => void;
}
export const Calendar = ({ className, handleSetDate }: CalendarProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(startOfToday());
  const [endDate, setEndDate] = useState<Date | undefined>(endOfToday());
  const [dateIsSelected, setDateIsSelected] = useState<boolean>(false);

  const onChange: (date: [Date, Date]) => void = useCallback(
    ([start, end]) => {
      setStartDate(start);

      if (end) setEndDate(end);
      else setEndDate(undefined);

      if (!dateIsSelected) setDateIsSelected(true);
    },
    [dateIsSelected]
  );

  useEffect(() => {
    if (!visible) {
      if (dateIsSelected) {
        handleSetDate('START', startDate);

        let newEndDate: Date;

        if (endDate) newEndDate = endDate;
        else newEndDate = endOfDay(startDate);

        handleSetDate('END', endOfDay(newEndDate));
      } else {
        handleSetDate('START', undefined);
        handleSetDate('END', undefined);
      }
    }
  }, [visible, dateIsSelected, startDate, endDate]);

  const dateButton = useMemo(() => {
    if (!dateIsSelected) {
      return 'All time';
    }

    let date: string;

    const needYear = !isThisYear(startDate);

    const formatString = needYear ? 'MMM dd, yyyy' : 'MMM dd';

    const formatStartDate = format(startDate, formatString);
    date = formatStartDate;

    if (endDate) {
      const formatEndDate = format(endDate, formatString);
      date = `${formatStartDate} - ${formatEndDate}`;
    }

    return date;
  }, [dateIsSelected, startDate, endDate]);

  const handleReset = useCallback(() => {
    setStartDate(startOfToday());
    setEndDate(endOfToday());

    setDateIsSelected(false);

    setVisible(false);
  }, []);

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(className, styles.calendar)}>
        <button
          className={cn(
            'button-stroke button-small',
            { [styles.active]: visible },
            styles.button
          )}
          onClick={() => setVisible(!visible)}
          type="button"
        >
          <span>{dateButton}</span>
          <Icon name="calendar" size={16} />
        </button>
        <div className={cn(styles.body, { [styles.show]: visible })}>
          <div className={styles.datepicker}>
            <DatePicker
              selected={dateIsSelected ? startDate : undefined}
              onChange={onChange}
              startDate={dateIsSelected ? startDate : undefined}
              endDate={dateIsSelected ? endDate : undefined}
              monthsShown={2}
              dateFormatCalendar="MMM yyyy"
              selectsRange
              inline
            />

            <button
              type="button"
              className={cn('button button-small button-black', styles.reset)}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};
