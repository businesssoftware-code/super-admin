import dayjs from "dayjs";

export function formatDateWithOrdinal(dateStr: string): string {
  const parsed = dayjs(dateStr);
  if (!parsed.isValid()) return '';

  return parsed.format('DD MMMM, YYYY');
}
