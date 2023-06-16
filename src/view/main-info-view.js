import AbstractView from '../framework/view/abstract-view.js';

function createMainInfoTemplate (points, destinations, offers) {

  console.log('points in template',points);
  console.log('destinations in tmplate', destinations);
  const tripDestinations = [];

  let sum = 0;

  points.forEach((point) => {

console.log('point-destination', point.destination.id);
    const city = destinations.find((destination) => destination.id === point.destination.id);
    tripDestinations.push(city.destination.name);
    console.log('tripDestinations', tripDestinations);

  });


  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
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
