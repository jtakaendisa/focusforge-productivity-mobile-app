export const toFormattedDateString = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [{ value: month }, , { value: day }, , { value: year }] =
    formatter.formatToParts(date);

  return `${year}-${month}-${day}`;
};
