import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const RENDER_DATE_FORMAT = 'MMM D';
const ATTRIBUTE_DATE_FORMAT = 'YYYY-MM-DD';
const RENDER_TIME_FORMAT = 'HH:mm';
const ATTRIBUTE_TIME_FORMAT = 'YYYY-MM-DDTHH-mm';
const POINT_EDIT_FORMAT = 'DD/MM/YYHH:mm';

function getRandomInteger (a = 0, b = 1){
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomArrayElement(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

function humanizeRenderEditPointDate(date) {
  return date ? dayjs(date).format(POINT_EDIT_FORMAT) : '';
}

function humanizeRenderPointDate(date) {
  return date ? dayjs(date).format(RENDER_DATE_FORMAT) : '';
}

function humanizeAttributePointDate(date) {
  return date ? dayjs(date).format(ATTRIBUTE_DATE_FORMAT) : '';
}

function humanizeAttributePointTime(date) {
  return date ? dayjs(date).format(ATTRIBUTE_TIME_FORMAT) : '';
}

function humanizeRenderPointTime(date) {
  return date ? dayjs(date).format(RENDER_TIME_FORMAT) : '';
}

function calculateDuration (start, stop) {
  const eventTime = dayjs.duration(dayjs(stop) - dayjs(start), 'millisecond');

  if(eventTime.$d.days){
    return eventTime.format('DD[d] HH[h] mm[M]');
  } else if (!eventTime.$d.days && eventTime.$d.hours){
    return eventTime.format('HH[h] mm[M]');
  }
  return eventTime.format('mm[M]');

}

export {getRandomInteger,getRandomArrayElement,humanizeRenderEditPointDate,humanizeRenderPointDate, humanizeAttributePointDate,humanizeAttributePointTime,humanizeRenderPointTime,calculateDuration};
