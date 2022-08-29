export interface DateProvider {
  currentDate(): Date;
  fromUnixTimestamp(unixDate: number): Date;
  compareInMinutes(startDate: Date, endDate: Date): number;
  compareInHours(startDate: Date, endDate: Date): number;
  compareInDays(startDate: Date, endDate: Date): number;
  compareIfBefore(startDate: Date, endDate: Date): boolean;
  addDays(days: number): Date;
  addHours(hours: number): Date;
  addMinutes(minutes: number): Date;
}
