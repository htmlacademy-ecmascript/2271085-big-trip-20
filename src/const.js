const WAYPOINT_TYPES = [ 'taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'];

const DEFAULT_TYPE = 'flight';
const POINT_EMPTY = {
  basePrice: 1,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};

const FilterTypeMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};

export {FilterType,FilterTypeMessage,UserAction,UpdateType,
  SortType,EditType,WAYPOINT_TYPES,
  POINT_EMPTY};
