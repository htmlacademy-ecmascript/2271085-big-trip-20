import AbstractView from '../framework/view/abstract-view.js';
import { humanizeRenderPointDate, humanizeAttributePointDate,humanizeAttributePointTime,humanizeRenderPointTime,calculateDuration } from '../utils.js';

function createPointTemplate ({point, pointDestination, pointOffers}) {

  const {type, basePrice, dateFrom, dateTo, offers,isFavorite} = point;

  const generatePointOffers = (pointType, availableOffers) => {

    const typeOffers = availableOffers.find((way) => way.type === pointType);
    const checkedOffers = [];
    for (let i = 0; i < offers.length; i ++){
      checkedOffers.push(typeOffers.offers.find((offer) => offer.id === offers[i]));
    }
    return checkedOffers;
  };

  const startRenderHumanizeDate = humanizeRenderPointDate(dateFrom);
  const startAttributeHumanizeDate = humanizeAttributePointDate(dateFrom);

  const startRenderHumanizeTime = humanizeRenderPointTime(dateFrom);
  const endRenderHumanizeTime = humanizeRenderPointTime(dateTo);
  const startAttributeHumanizeTime = humanizeAttributePointTime(dateFrom);
  const endAttributeHumanizeTime = humanizeAttributePointTime(dateTo);

  const favoriteClassName = isFavorite
    ? '--active'
    : '';

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${startAttributeHumanizeDate}">${startRenderHumanizeDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${pointDestination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startAttributeHumanizeTime}">${startRenderHumanizeTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${endAttributeHumanizeTime}">${endRenderHumanizeTime}</time>
        </p>
        <p class="event__duration">${calculateDuration(dateFrom,dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${createPointOffersTemplate(generatePointOffers(type, pointOffers))}
      </ul>
      <button class="event__favorite-btn event__favorite-btn${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

function createPointOffersTemplate (pointOffers) {
  const data = pointOffers.map((pointOffer) =>
    `<li class="event__offer">
      <span class="event__offer-title">${pointOffer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${pointOffer.price}</span>
    </li>`).join('');
  return data;
}


export default class PointView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, pointDestination, pointOffers,onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#onEditClick);
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#onFavoriteClick);
  }

  get template() {
    return createPointTemplate({
      point: this.#point,
      pointDestination: this.#pointDestination,
      pointOffers: this.#pointOffers,
    });
  }

  #onEditClick = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
