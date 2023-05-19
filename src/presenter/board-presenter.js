import { render,replace,RenderPosition } from '../framework/render.js';
import EventListView from '../view/event-list-view';
import PointEditView from '../view/point-edit-view';
import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import EmptyView from '../view/empty-view.js';
import PointPresenter from './point-presenter.js';
export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #boardPoints = [];

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
      container: this.#container,
      pointsModel: this.#pointsModel
    });
    pointPresenter.init(point);
  }
}
