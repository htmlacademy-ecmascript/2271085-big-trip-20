import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {FilterType} from './const.js';
dayjs.extend(duration);

const RENDER_DATE_FORMAT = 'MMM D';
const ATTRIBUTE_DATE_FORMAT = 'YYYY-MM-DD';
const RENDER_TIME_FORMAT = 'HH:mm';
const ATTRIBUTE_TIME_FORMAT = 'YYYY-MM-DD THH-mm';
const POINT_EDIT_FORMAT = 'DD/MM/YY HH:mm';

function capitalize(string){
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

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

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

const sortPointByTime = (pointA, pointB) => {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return timeB - timeA;
};

const sortPointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortPointByDay = (pointA, pointB) =>dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);

// function updateItem(items, update) {
//   return items.map((item) => item.id === update.id ? update : item);
// }

export {getRandomInteger,
  getRandomArrayElement,
  filter,
  sortPointByTime,
  sortPointByPrice,
  sortPointByDay,
  capitalize,
  humanizeRenderEditPointDate,
  humanizeRenderPointDate,
  humanizeAttributePointDate,
  humanizeAttributePointTime,
  humanizeRenderPointTime,calculateDuration,
  // updateItem
};
