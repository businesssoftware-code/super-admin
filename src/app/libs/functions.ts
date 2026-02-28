import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function getTodaysDate(date?: string) {
  if (date) {
    return dayjs(date).tz("Asia/Kolkata").format();
  }

  return dayjs().tz("Asia/Kolkata").format();
}
export function formatDateWithOrdinal(dateStr: string): string {
  const parsed = dayjs(dateStr);
  if (!parsed.isValid()) return "";

  return parsed.format("DD MMMM, YYYY");
}

export function formatDateWithShort(dateStr: string): string {
  const parsed = dayjs(dateStr);
  if (!parsed.isValid()) return "";

  return parsed.format("DD/MM/YYYY");
}

export function formatDateDifference(dateStr1: string, dateStr2: string) {
  const date1 = dayjs(dateStr1, "DD/MM/YYYY");
  const date2 = dayjs(dateStr2, "DD/MM/YYYY");

  return date1.diff(date2, "day");
}
