import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_EMPTY,WAYPOINT_TYPES, EditType} from '../const.js';
import {humanizeRenderEditPointDate} from '../utils.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const ButtonLabel = {
  [EditType.EDITING]: 'Delete',
  [EditType.CREATING]: 'Cancel'
};


function createPointEditTemplate ({state,pointOffers,allDestinations,formType}) {

  const {type, basePrice, dateFrom, dateTo, offers, destination} = state;

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

  function getStateDestination(newDestination){
    const data = allDestinations.find((punkt) => punkt.id === newDestination);
    return data;
  }

  function getPhotosSRC(destin){

    const data = destin.pictures.map((picture) => (`<img class="event__photo" src="${picture.src}" alt="Event photo">`
    )).join('');
    return data;
  }

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
                ${createPointType(WAYPOINT_TYPES,type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination ? getStateDestination(destination).name : '')}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${createDestinationsList(allDestinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${he.encode(startRenderEditPointDate)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${he.encode(endRenderEditPointDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value=${basePrice}>
        </div>

        ${createPointEditControlsTemplate({formType})}
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
          <p class="event__destination-description">${ destination ? getStateDestination(destination).description : ''}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${ destination ? getPhotosSRC(getStateDestination(destination)) : ''}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );
}

function createDeleteButtonTemplate({formType}) {
  return `<button class="event__reset-btn" type="reset">${ButtonLabel[formType]}</button>`;
}

function createRollupButtonTemplate() {
  return '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>';
}

function createPointEditControlsTemplate({formType}) {
  return`
    <button class="event__save-btn btn btn--blue" type="submit">Save</button>
    ${createDeleteButtonTemplate({formType})}
    ${(formType !== EditType.CREATING) ? createRollupButtonTemplate() : ''}
  `;
}

function createPointType (wayTypes,type) {
  const checkedType = WAYPOINT_TYPES.find((way) => way === type);
  return wayTypes.map((wayType) => `
    <div class="event__type-item">
        <input id="event-type-${wayType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${wayType}" ${checkedType === wayType ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${wayType}" for="event-type-${wayType}-1">${wayType}</label>
     </div>
  `).join('');
}

function createDestinationsList (allDestinations){
  return allDestinations.map((destination) =>`
  <option value="${destination.name}"></option>`).join('');
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
  #startDatepicker = null;
  #finishDatepicker = null;
  #onDeleteClick = null;
  #formType = null;


  constructor({point = POINT_EMPTY, pointDestination, pointOffers, onDeleteClick, onResetClick, onSubmitClick,allDestinations, formType = EditType.EDITING}) {
    super();
    this.#destination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;
    this.#allDestinations = allDestinations;
    this.#onDeleteClick = onDeleteClick;
    this.#formType = formType;


    this._setState(PointEditView.parsePointToState(point));

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      state : this._state,
      pointDestination : this.#destination,
      pointOffers : this.#pointOffers,
      allDestinations: this.#allDestinations,
      formType: this.#formType
    });
  }

  removeElement(){
    super.removeElement();

    if(this.#startDatepicker){
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }
    if(this.#finishDatepicker){
      this.#finishDatepicker.destroy();
      this.#finishDatepicker = null;
    }
  }

  _restoreHandlers() {

    if(this.#formType === EditType.EDITING){
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupButtonClickHandler);

      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#deleteClickHandler);
    }

    if (this.#formType === EditType.CREATING){
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetClickHandler);
    }

    this.element
      .addEventListener('submit', this.#formSubmitHandler);

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

    this.#setDatepickerStart();
    this.#setDatepickerFinish();
  }

  #typeInputClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #offerCLickHandler = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      offers: checkedBoxes.map((element) => element.id)
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      basePrice: Number(evt.target.value)
    });

  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#allDestinations
      .find((pointDestination) => pointDestination.name === evt.target.value);


    const selectedDestinationId = (selectedDestination)
      ? selectedDestination.id
      : '';

    this.updateElement({
      destination: selectedDestinationId,
    });
  };

  reset(point) {
    this.updateElement(PointEditView.parsePointToState(point),
    );
  }

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();

  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };


  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(PointEditView.parseStateToPoint(this._state));

  };

  #startChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom:userDate
    });
  };

  #finishChangeHandler = ([userDate]) => {
    this._setState({
      dateTo:userDate
    });
  };

  #setDatepickerStart(){
    this.#startDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#startChangeHandler,
      }
    );
  }

  #setDatepickerFinish(){
    this.#finishDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#finishChangeHandler,
      }
    );
  }

  static parsePointToState = (point) => ({...point});

  static parseStateToPoint = (state) => ({...state});
}
