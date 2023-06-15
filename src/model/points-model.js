import Observable from '../framework/observable.js';
import { UpdateType} from '../const.js';
export default class PointsModel extends Observable {
  #pointsApiService = null;
  #destinations = [];
  #offers = [];
  #points = [];

  constructor({pointsApiService}){
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points(){
    return this.#points;
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

    } catch (err){
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint (updateType,update){

    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType,updatedPoint);
    } catch (err){
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update){

    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [
        newPoint,
        ...this.#points,
      ];
      this._notify(updateType,update);
    } catch(err){
      throw new Error('Can\'t add task');
    }
  }

  async deletePoint(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try{
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err){
      throw new Error('Can\'t delete point');
    }
  }

  getByType(type) {
    return this.#offers
      .find((offer) => offer.type === type).offers;
  }

  getById(id) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      basePrice: point['base_price'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['date_from'] ;
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

}

