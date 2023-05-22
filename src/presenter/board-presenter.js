import { render,RenderPosition } from '../framework/render.js';
import {updateItem} from '../utils.js';
import EventListView from '../view/event-list-view';
import SortView from '../view/sort-view';
import EmptyView from '../view/empty-view.js';
import PointPresenter from './point-presenter.js';
export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #boardPoints = [];
  #pointPresenters = new Map();

  #sortComponent = new SortView();
  #eventListComponent = new EventListView();
  #emptyViewComponent = new EmptyView();

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init(){

    this.#boardPoints = [...this.#pointsModel.points];
    this.#renderEventList();
    this.#renderPoints();
  }

  #renderSort() {
    if (this.#boardPoints.length !== 0){
      render(this.#sortComponent, this.#container,RenderPosition.AFTERBEGIN);
    }
  }

  #renderEmptyList(){
    render(this.#emptyViewComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderEventList () {
    render(this.#eventListComponent, this.#container);
    if(this.#boardPoints.length === 0){
      this.#renderEmptyList();
    }
    this.#renderSort();
  }

  #renderPoints() {
    for(let i = 0; i < this.#boardPoints.length; i ++){
      this.#renderPoint(this.#boardPoints[i]);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handlerPointChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlerPointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };
}
