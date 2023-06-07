import Observable from '../framework/observable.js';
import {POINT_COUNT,DESTINATION_COUNT,OFFER_COUNT,WAYPOINT_TYPES, CITIES} from '../const.js';
import {getRandomArrayElement, getRandomInteger} from '../utils.js';
import {generatePoint,generateDestination,generateCityDestination,generateOffer} from '../mock/points.js';

export default class PointsModel extends Observable {
  #destinations = [];
  #offers = [];
  #points = [];

  constructor(){
    super();
    this.#destinations = this.generateDestinations();
    this.#offers = this.generateOffers();
    this.#points = this.generatePoints();
  }

  get points(){
    return this.#points;
  }

  updatePoint (updateType,update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];
    this._notify(updateType,update);
  }

  addPoint(updateType, update){
    this.#points = [
      update,
      ...this.#points,
    ];
    this._notify(updateType,update);
  }

  deletePoint(updateType, update){
    const index = this.#points.FindIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType);
  }

  get allCities(){
    return CITIES.map((city) => generateCityDestination(city));
  }

  get destinations(){
    return this.#destinations;
  }

  get offers(){
    return this.#offers;
  }

  getByType(type) {
    return this.#offers
      .find((offer) => offer.type === type).offers;
  }

  getById(id) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }

  generateDestinations() {
    return Array.from({length:DESTINATION_COUNT}, (_,index) => generateDestination(index)
    );
  }

  generateOffers(){
    return WAYPOINT_TYPES.map((type) => ({
      type,
      offers: Array.from({length: getRandomInteger(0,OFFER_COUNT)}, () => generateOffer(type))
    }));
  }

  generatePoints(){
    return Array.from({length: POINT_COUNT}, () => {
      const type = getRandomArrayElement(WAYPOINT_TYPES);
      const destination = getRandomArrayElement(this.#destinations);
      const hasOffers = getRandomInteger(0,1);
      const offersByType = this.#offers
        .find((offerByType) => offerByType.type === type);
      const offerIds = (hasOffers)
        ? offersByType.offers
          .slice(0,getRandomInteger(0,OFFER_COUNT))
          .map((offer) => offer.id)
        : [];
      return generatePoint(type, destination.id, offerIds);
    });
  }

}

