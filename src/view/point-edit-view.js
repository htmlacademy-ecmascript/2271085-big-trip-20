import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_EMPTY} from '../const.js';
import {humanizeRenderEditPointDate} from '../utils.js';

function createPointEditTemplate ({state, pointDestination, pointOffers,allDestinations}) {

  const {type, basePrice, dateFrom, dateTo, offers, destination} = state.point;
  console.log('firstState.point', state.point);

  const startRenderEditPointDate = humanizeRenderEditPointDate(dateFrom);
  const endRenderEditPointDate = humanizeRenderEditPointDate(dateTo);

  const generatePointEditOffers = (pointType, availableOffers) => {
    const typeOffers = availableOffers.find((way) => way.type === pointType);
    const checkedOffersCollection = [];

    for (let i = 0; i < offers.length; i ++){
      checkedOffersCollection.push(typeOffers.offers.find((offer) => offer.id === offers[i]));
    }
    return checkedOffersCollection;
  };
  const checkedOffers = generatePointEditOffers(type,pointOffers);

  function getStateDestination(newdestination){
    const data = allDestinations.find((punkt) => punkt.id === newdestination);
    return data;
  }

  const stateDestination = getStateDestination(destination);

  function getPhotosSRC(destin){

    const data = destin.pictures.map((pictureObject) => pictureObject.src);
    return data;
  }
  const photosSRC = getPhotosSRC(stateDestination);

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${stateDestination.name} list="destination-list-1">
          <datalist id="destination-list-1">
          ${createDestinationsList(allDestinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startRenderEditPointDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endRenderEditPointDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${createPointEditOffersTemplate(pointOffers,type,checkedOffers)}

          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${createPhotosDestinationsTemplate(photosSRC)}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );
}
function createDestinationsList (allDestinations){
  return allDestinations.map((destination) =>`
  <option value="${destination.name}"></option>`).join('');
}

function createPhotosDestinationsTemplate(srcs){
  const data = srcs.map((photo) =>
    (
      `<img class="event__photo" src=${photo} alt="Event photo">`
    )
  );
  return data;
}

function createPointEditOffersTemplate (pointOffers,type,checkedOffers){

  const typeOffers = pointOffers.find((way) => way.type === type);

  const checkedOffersIds = checkedOffers.map((offer) => offer.id);

  return typeOffers.offers.map((item) => `
  <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${item.id}" type="checkbox" name="event-offer-luggage" ${checkedOffersIds.includes(item.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="${item.id}">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </label>
   </div> `).join('');
}

export default class PointEditView extends AbstractStatefulView {
  #destination = null;
  #pointOffers = null;
  #onResetClick = null;
  #onSubmitClick = null;
  #allDestinations = null;


  constructor({point = POINT_EMPTY, pointDestination, pointOffers, onResetClick, onSubmitClick,allDestinations}) {
    super();
    this.#destination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;
    this.#allDestinations = allDestinations;


    this._setState(PointEditView.parsePointToState({point}));


    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      state : this._state,
      pointDestination : this.#destination,
      pointOffers : this.#pointOffers,
      allDestinations: this.#allDestinations
    });
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#resetClickHandler);

    this.element
      .querySelector('.event__save-btn')
      .addEventListener('click',this.#submitClickHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeInputClick);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChange);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChange);

    const offerBlock = this.element
      .querySelector('.event__available-offers');

    if(offerBlock){
      offerBlock.addEventListener('change', this.#offerCLickHandler);
    }
  }

  #typeInputClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #offerCLickHandler = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.id)
      }
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      point:{
        ...this._state.point,
        basePrice: Number(evt.target.value)
      }
    });

  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#allDestinations
      .find((pointDestination) => pointDestination.name === evt.target.value);

    const selectedDestinationId = (selectedDestination)
      ? selectedDestination.id
      : null;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestinationId,
      }
    });
  };

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();

  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(PointEditView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({...point});

  static parseStateToPoint = (state) => state.point;
}
