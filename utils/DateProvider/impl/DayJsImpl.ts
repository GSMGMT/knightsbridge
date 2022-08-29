/* eslint-disable class-methods-use-this */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { DateProvider } from '../DateProvider';

dayjs.extend(utc);

export class DayjsDateProvider implements DateProvider {
  private convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  currentDate(): Date {
    return dayjs().toDate();
  }

  fromUnixTimestamp(unixDate: number): Date {
    return dayjs.unix(unixDate).toDate();
  }

  compareInMinutes(startDate: Date, endDate: Date): number {
    return dayjs(this.convertToUTC(endDate)).diff(
      this.convertToUTC(startDate),
      'minutes'
    );
  }

  compareInHours(startDate: Date, endDate: Date): number {
    return dayjs(this.convertToUTC(endDate)).diff(
      this.convertToUTC(startDate),
      'hours'
    );
  }

  compareInDays(startDate: Date, endDate: Date): number {
    return dayjs(this.convertToUTC(endDate)).diff(
      this.convertToUTC(startDate),
      'days'
    );
  }

  addDays(days: number): Date {
    return dayjs().add(days, 'day').toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, 'hour').toDate();
  }

  addMinutes(minutes: number): Date {
    return dayjs().add(minutes, 'minute').toDate();
  }

  compareIfBefore(startDate: Date, endDate: Date): boolean {
    return dayjs(startDate).isBefore(endDate);
  }
}
