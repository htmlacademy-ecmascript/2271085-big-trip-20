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

  const {type, basePrice, dateFrom, dateTo, offers, destination,isDisabled, isSaving, isDeleting} = state;

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
    const data = allDestinations.find((item) => item.id === newDestination);
    return data;
  }

  function getPhotoAddress(place){

    const data = place.pictures.map((picture) => (`<img class="event__photo" src="${picture.src}" alt="Event photo">`
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
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox"
           ${isDisabled ? 'disabled' : ''}>
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination ? getStateDestination(destination).name : '')}" list="destination-list-1"
          ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
          ${createDestinationsList(allDestinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${he.encode(startRenderEditPointDate)}"
          ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${he.encode(endRenderEditPointDate)}"
          ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value=${basePrice === 0 ? '' : basePrice}
          ${isDisabled ? 'disabled' : ''}>
        </div>

        ${createPointEditControlsTemplate({formType, isSaving, isDeleting, isDisabled})}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${createPointEditOffersTemplate(pointOffers,type,checkedOffers)}

          </div>
        </section>

        <section class="event__section  event__section--destination ${destination === '' ? 'visually-hidden' : ''}">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${ destination ? getStateDestination(destination).description : ''}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${ destination ? getPhotoAddress(getStateDestination(destination)) : ''}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );
}

function createDeleteButtonTemplate({formType, isDisabled, isDeleting}) {
  return `<button class="event__reset-btn" type="reset"  ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : ButtonLabel[formType]}</button>`;
}

function createRollupButtonTemplate() {
  return '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>';
}

function createPointEditControlsTemplate({formType, isSaving, isDisabled, isDeleting}) {
  return`
    <button class="event__save-btn btn btn--blue" type="submit"  ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
    ${createDeleteButtonTemplate({formType,isDisabled, isDeleting })}
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
  #handleResetClick = null;
  #handleSubmitClick = null;
  #allDestinations = null;
  #startDatepicker = null;
  #finishDatepicker = null;
  #handleDeleteClick = null;
  #formType = null;


  constructor({point = POINT_EMPTY, pointDestination, pointOffers, onDeleteClick, onResetClick, onSubmitClick,allDestinations, formType = EditType.EDITING}) {
    super();
    this.#destination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleResetClick = onResetClick;
    this.#handleSubmitClick = onSubmitClick;
    this.#allDestinations = allDestinations;
    this.#handleDeleteClick = onDeleteClick;
    this.#formType = formType;


    this._setState(PointEditView.parsePointToState(point));

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      state : this._state,
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
        .addEventListener('click', this.#onRollupButtonClick);

      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#onDeleteClick);
    }

    if (this.#formType === EditType.CREATING){
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#onResetClick);
    }

    this.element
      .addEventListener('submit', this.#onFormSubmit);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#onTypeInputClick);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#onDestinationInputChange);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#onPriceInputChange);

    const offerBlock = this.element
      .querySelector('.event__available-offers');

    if(offerBlock){
      offerBlock.addEventListener('change', this.#onOfferCLick);
    }

    this.#setDatePicker();
  }

  reset(point) {
    this.updateElement(PointEditView.parsePointToState(point),
    );
  }

  #onTypeInputClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #onOfferCLick = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      offers: checkedBoxes.map((element) => element.id)
    });
  };

  #onPriceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      basePrice: Number(evt.target.value)
    });

  };

  #onDestinationInputChange = (evt) => {
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

  #onResetClick = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();

  };

  #onDeleteClick = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #onRollupButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  };


  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.#handleSubmitClick(PointEditView.parseStateToPoint(this._state));

  };

  #onStartDateChange = ([dateFrom]) => {
    this.updateElement({
      dateFrom: dateFrom,
    });
  };

  #onEndDateChange = ([dateTo]) => {
    this.updateElement({
      dateTo: dateTo,
    });
  };


  #setDatePicker () {
    const startDate = this.element.querySelector('#event-start-time-1');
    const endDate = this.element.querySelector('#event-end-time-1');

    flatpickr(
      startDate,
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        locale: {
          firstDayOfWeek: 1
        },
        onChange: this.#onStartDateChange,
      }
    );

    flatpickr(
      endDate,
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        locale: {
          firstDayOfWeek: 1
        },
        onChange: this.#onEndDateChange,
      }
    );
  }

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint (state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isDeleting;
    delete point.isSaving;

    return point;
  }
}
