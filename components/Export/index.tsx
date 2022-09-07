import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import DatePicker from 'react-datepicker';
import { endOfDay, format, isThisYear } from 'date-fns';

import { Icon } from '@components/Icon';

import { api } from '@services/api';

import styles from './Export.module.scss';

interface ExportProps {
  className?: string;
  status?: string;
  urlExport: string;
}
export const Export = ({ className, status, urlExport }: ExportProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [canDownload, setCanDownload] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const onChange: (date: [Date, Date]) => void = ([start, end]) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    if (!visible) {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [visible]);

  useEffect(() => {
    setCanDownload(false);
  }, [startDate, endDate]);

  const dateIsSelected = useMemo(() => {
    if (startDate) return true;

    return false;
  }, [startDate]);

  const definedEndDate = useMemo(
    () => endDate || endOfDay(startDate!),
    [endDate]
  );

  const dateButton = useMemo(() => {
    if (!dateIsSelected) {
      return 'All time';
    }

    const definedStartDate = startDate!;

    let date: string;

    const needYear =
      !isThisYear(definedStartDate) || !isThisYear(definedEndDate);

    const formatString = needYear ? 'MMM dd, yyyy' : 'MMM dd';

    const formatStartDate = format(definedStartDate, formatString);
    date = formatStartDate;

    if (endDate) {
      const formatEndDate = format(endDate, formatString);
      date = `${formatStartDate} - ${formatEndDate}`;
    }

    return date;
  }, [dateIsSelected, startDate, endDate]);

  const [fetching, setFetching] = useState<boolean>(false);
  const canSubmit = useMemo(
    () => !!(startDate || fetching),
    [startDate, fetching]
  );
  const handleSubmit = useCallback(async () => {
    if (!dateIsSelected || fetching) return;

    setFetching(true);

    try {
      const startDateRequest = +startDate! / 1000;
      const endDateRequest = +definedEndDate / 1000;
      const statusRequest = status === 'ALL' ? undefined : status;

      const { data } = await api.get(urlExport, {
        params: {
          startDate: startDateRequest,
          endDate: endDateRequest,
          status: statusRequest,
        },
      });

      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setCanDownload(true);
    } finally {
      setFetching(false);
    }
  }, [dateIsSelected, startDate, definedEndDate, status, urlExport, fetching]);

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(className, styles.export)}>
        <button
          className={cn(
            'button-small',
            { [styles.active]: visible },
            styles.button
          )}
          onClick={() => setVisible(!visible)}
          type="button"
        >
          <Icon name="arrow-bottom" size={16} />
          <span>Export</span>
        </button>
        <div className={cn(styles.body, { [styles.show]: visible })}>
          <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            dateFormatCalendar="MMM yyyy"
            endDate={endDate}
            selectsRange
            inline
          />
          {dateIsSelected && (
            <div className={styles.interval}>{dateButton}</div>
          )}
          <button
            className={cn('button', styles.button)}
            disabled={canSubmit}
            type="button"
            onClick={handleSubmit}
          >
            {canDownload
              ? 'Request again'
              : fetching
              ? 'Requesting'
              : 'Request'}{' '}
            .CSV
          </button>
          {canDownload && (
            <a
              href={downloadUrl}
              download="export.csv"
              className={styles.download}
            >
              DOWNLOAD
            </a>
          )}
        </div>
      </div>
    </OutsideClickHandler>
  );
};
Export.defaultProps = {
  className: undefined,
  status: undefined,
};
