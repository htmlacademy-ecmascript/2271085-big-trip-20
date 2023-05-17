import { render,replace } from '../framework/render.js';
import EventListView from '../view/event-list-view';
import PointEditView from '../view/point-edit-view';
import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import EmptyView from '../view/empty-view.js';
export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #boardPoints = [];

  #sortComponent = new SortView();
  #eventListComponent = new EventListView();

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
  }

  init(){

    if(this.#boardPoints.length === 0){
      render(new EmptyView(), this.#container);
    }
    render(this.#sortComponent, this.#container);
    render(this.#eventListComponent, this.#container);

    for(let i = 0; i < this.#boardPoints.length; i ++){
      this.#renderPoint(this.#boardPoints[i]);

    }
  }

  #renderPoint(point) {
    const pointComponent = new PointView({
      point,
      pointDestination: this.#pointsModel.getById(point.destination),
      pointOffers: this.#pointsModel.offers,
      onEditClick: pointEditClickHandler
    });

    const pointEditComponent = new PointEditView({
      point,
      pointDestination: this.#pointsModel.getById(point.destination),
      pointOffers: this.#pointsModel.offers,
      onResetClick: resetButtonClickHandler,
      onSubmitClick: pointSubmitHandler,
    });

    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };

    const escKeyDownHandler = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'esc'){
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function pointEditClickHandler() {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function resetButtonClickHandler(){
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function pointSubmitHandler(){
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#eventListComponent.element);
  }
}

