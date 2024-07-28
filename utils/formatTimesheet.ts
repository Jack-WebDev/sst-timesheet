import { format, parse } from "date-fns";

export const formatTime = (time: string | number) => {
  if (typeof time === 'string') {
    const [hours, minutes] = time.split(':').map(Number);
    return {
      fullTime: time,
      hours,
      minutes
    };
  }

  const totalMinutes = Math.round(time * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const totalTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return {
    totalTime,
    hours,
    minutes
  };
};

export const formatDate = (dateStr: any) => {
  const parsedDate = parse(dateStr, 'd-MMM-yy', new Date());
  return format(parsedDate, 'yyyy-MM-dd');
};
