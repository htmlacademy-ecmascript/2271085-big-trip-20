import AbstractView from '../framework/view/abstract-view.js';
import {humanizeRenderPointDate, sortPointByDay} from '../utils.js';

function calculateDuration (startDate, endDate){

  if (startDate === endDate){
    return startDate;
  }

  const start = startDate.split(' ').reverse();
  const end = endDate.split(' ').reverse();

  return `${start.join(' ')}&nbsp;&mdash;&nbsp;${end.join(' ')}`;
}

function createMainInfoTemplate (points, destinations, offers) {

  const tripDestinations = [];
  const maxDestination = 3;

  let sum = 0;

  points.forEach((point) => {
    const city = destinations.find((destination) => destination.id === point.destination);
    tripDestinations.push(city.name);

    const typeOffers = offers.find((item) => item.type === point.type).offers;
    const offersById = typeOffers.filter((item) => point.offers.includes(item.id));
    const offersPrice = offersById.reduce((total, offer) => total + offer.price, 0);

    sum += point.basePrice + offersPrice;

  });

  const sortedPoints = points.sort(sortPointByDay);
  const startDate = humanizeRenderPointDate(sortedPoints[0].dateFrom);
  const endDate = humanizeRenderPointDate(sortedPoints[sortedPoints.length - 1].dateTo);


  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripDestinations.length > maxDestination ? `${tripDestinations[0]} &mdash; ... &mdash; ${tripDestinations[tripDestinations.length - 1]}` : tripDestinations.join(' &mdash; ')}</h1>

      <p class="trip-info__dates">${calculateDuration(startDate,endDate)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>
  </section>`
  );
}

export default class MainInfoView extends AbstractView {

  #points = null;
  #destinations = null;
  #offers = null;

  constructor(points, destinations, offers){
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;

  }

  get template() {
    return createMainInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
