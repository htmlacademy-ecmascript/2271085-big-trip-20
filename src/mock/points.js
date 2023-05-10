import {getRandomArrayElement,getRandomInteger} from '../utils.js';
import { CITIES, DESCRIPTION,BASE_PRICE,Duration} from '../const.js';
import dayjs from 'dayjs';

const generateDestination = () => {
  const city = getRandomArrayElement(CITIES);

  return {
    id: crypto.randomUUID(),
    name: city,
    description: DESCRIPTION,
    pictures: [
      {
        'src': `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
        'description': `${city} description`
      }
    ]
  };
};

const generateOffer = (type) => ({
  id: crypto.randomUUID(),
  title: `Offer ${type}`,
  price: getRandomInteger(BASE_PRICE.MIN, (BASE_PRICE.MAX / 10))
});

function generatePoint (type, destinationId, offersIds) {

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(BASE_PRICE.MIN,BASE_PRICE.MAX),
    dateFrom: getDate({next:false}),
    dateTo: getDate({next:true}),
    destination: destinationId,
    offers: offersIds,
    isFavorite: Math.random() > 0.5,
    type
  };
}

let date = dayjs().subtract(getRandomInteger(0,Duration.DAY),'day').toDate();

function getDate({next}) {
  const minsGap = getRandomInteger(0, Duration.MIN);
  const hoursGap = getRandomInteger(1, Duration.HOUR);
  const daysGap = getRandomInteger(0, Duration.DAY);

  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }
  return date;
}
export {generatePoint,generateDestination,generateOffer};
