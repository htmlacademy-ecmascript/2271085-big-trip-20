import {POINT_COUNT,DESTINATION_COUNT,OFFER_COUNT,WAYPOINT_TYPES} from '../const.js';
import {getRandomArrayElement, getRandomInteger} from '../utils.js';
import {generatePoint,generateDestination,generateOffer} from '../mock/points.js';

export default class PointsModel {
  destinations = [];
  offers = [];
  points = [];

  constructor(){
    this.destinations = this.generateDestinations();
    this.offers = this.generateOffers();
    this.points = this.generatePoints();
  }

  getPoints(){
    return this.points;
  }

  getDestinations(){
    return this.destinations;
  }

  getOffers(){
    return this.offers;
  }

  getByType(type) {
    return this.offers
      .find((offer) => offer.type === type).offers;
  }

  getById(id) {
    return this.destinations
      .find((destination) => destination.id === id);
  }

  generateDestinations() {
    return Array.from({length:DESTINATION_COUNT}, () => generateDestination()
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
      const destination = getRandomArrayElement(this.destinations);
      const hasOffers = getRandomInteger(0,1);
      const offersByType = this.offers
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

