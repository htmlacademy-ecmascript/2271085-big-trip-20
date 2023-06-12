import Observable from '../framework/observable.js';
import {POINT_COUNT,DESTINATION_COUNT,OFFER_COUNT,WAYPOINT_TYPES, CITIES, UpdateType} from '../const.js';
import {getRandomArrayElement, getRandomInteger} from '../utils.js';
import {generatePoint,generateDestination,generateCityDestination,generateOffer} from '../mock/points.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #destinations = [];
  #offers = [];
  #points = [];

  constructor({pointsApiService}){
    super();
    this.#pointsApiService = pointsApiService;

    // this.#pointsApiService.points.then((points) => {
    //   console.log(points.map(this.#adaptToClient));
    // });

    // this.#destinations = this.generateDestinations();
    // this.#offers = this.generateOffers();
    //this.#points = this.generatePoints();
  }

  get points(){
    return this.#points;
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


  async init(){
    try{
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);

      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;

        console.log(this.#points);
        console.log(this.#destinations);
        console.log(this.#offers);

      // this.#tripPoints = tripPoints.map((tripPoint) => {
      //   const offers = this.#offers.find(
      //     (offer) => offer.type === tripPoint.type
      //   );
      //   const adaptedTripPoint = this.#adaptToClient(
      //     tripPoint,
      //     this.#destinations,
      //     offers.offers
      //   );
      //   return adaptedTripPoint;
      // });
    } catch (err){
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
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
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType);
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

  #adaptToClient(point, destinations, offers) {
    const adaptedPoint = {
      ...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      basePrice: point['base_price'],
      isFavorite: point['is_favorite'],
    };
    // const adaptedDestination = destinations.find(
    //   (destination) => destination.id === point.destination
    // );
    // adaptedPoint.destination = adaptedDestination;

    // const adaptedOffers = [];
    // adaptedPoint.offers.forEach((offerId) =>
    //   adaptedOffers.push(offers.find((offer) => offer.id === offerId))
    // );
    // adaptedPoint.offers = adaptedOffers;

    delete adaptedPoint['date_from'] ;
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

}

