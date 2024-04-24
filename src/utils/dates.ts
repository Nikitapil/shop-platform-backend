export const getDiffInHours = (date1: Date, date2: Date) =>
  Math.abs(date1.getTime() - date2.getTime()) / 36e5;
