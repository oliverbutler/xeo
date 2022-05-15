import dayjs from 'dayjs';

var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

export type Time = string;

const isStringTime = (time: string | Time): time is Time => {
  const [hours, minutes] = time.split(':');

  if (Number(hours) < 0 || Number(hours) > 23) return false;
  if (Number(minutes) < 0 || Number(minutes) > 59) return false;

  return true;
};

export const getTimeFromUTCTime = (utcTime: Time): Time => {
  if (!isStringTime(utcTime)) throw new Error('Time is not a valid string');

  const day = dayjs()
    .utc()
    .set('hours', Number(utcTime.split(':')[0]))
    .set('minutes', Number(utcTime.split(':')[1]))
    // @ts-ignore
    .tz(dayjs.tz.guess());

  return day.format('HH:mm') as Time;
};

export const getUTCTimeFromTime = (time: Time): Time => {
  if (!isStringTime(time)) throw new Error('Time is not a valid string');

  const day = dayjs()
    .set('hours', Number(time.split(':')[0]))
    .set('minutes', Number(time.split(':')[1]))
    // @ts-ignore
    .tz('UTC');

  return day.format('HH:mm') as Time;
};
