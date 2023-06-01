import { remove, render, replace } from '../framework/render';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};
export default class PointPresenter{
  #container = null;
  #pointsModel = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #mode = Mode.DEFAULT;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor({container, pointsModel, onDataChange, onModeChange}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point){
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointDestination: this.#pointsModel.getById(point.destination),
      pointOffers: this.#pointsModel.offers,
      onEditClick: this.#handlerPointEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      pointDestination: this.#pointsModel.getById(point.destination),
      allDestinations: this.#pointsModel.destinations,
      pointOffers: this.#pointsModel.offers,
      onResetClick: this.#handlerResetButtonClick,
      onSubmitClick: this.#handlerPointSubmit,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if(this.#mode === Mode.DEFAULT){
      replace(this.#pointComponent, prevPointComponent);
    }

    if(this.#mode === Mode.EDITING){
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT){
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'esc'){
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handlerPointEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handlerResetButtonClick = () =>{
    // this.resetView();

    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () =>{
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handlerPointSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

}
