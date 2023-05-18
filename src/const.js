const WAYPOINT_TYPES = [ 'taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'];
const POINT_COUNT = 5;
const DESTINATION_COUNT = 5;
const OFFER_COUNT = 3;
const DEFAULT_TYPE = 'flight';
const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const CITIES = ['Berlin', 'Minsk', 'Moscow', 'Amsterdam', 'Tokio', 'Oslo', 'Gomel', 'Helsinki', 'New-York', 'Geneva'];
const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.';
const BASE_PRICE = {
  MIN: 1,
  MAX: 1000
};
const Duration = {
  HOUR: 5,
  DAY: 5,
  MIN: 59,
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export {FilterType,POINT_COUNT, OFFER_COUNT,WAYPOINT_TYPES, POINT_EMPTY, CITIES, DESCRIPTION,BASE_PRICE,DESTINATION_COUNT,Duration};
