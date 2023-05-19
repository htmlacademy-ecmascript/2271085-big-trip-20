import { remove, render, replace } from '../framework/render';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';

export default class PointPresenter{
  #container = null;
  #pointsModel = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;

  constructor({container,pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init(point){
    this.#point = point;


    this.#pointComponent = new PointView({
      point: this.#point,
      pointDestination: this.#pointsModel.getById(point.destination),
      pointOffers: this.#pointsModel.offers,
      onEditClick: this.#handlerPointEditClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      pointDestination: this.#pointsModel.getById(point.destination),
      pointOffers: this.#pointsModel.offers,
      onResetClick: this.#handlerResetButtonClick,
      onSubmitClick: this.#handlerPointSubmit,
    });

    render(this.#pointComponent, this.#container);
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'esc'){
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handlerPointEditClick() {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #handlerResetButtonClick(){
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handlerPointSubmit(){
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

}
