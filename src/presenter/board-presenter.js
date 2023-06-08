import { remove, render,RenderPosition } from '../framework/render.js';
import {sortPointByTime, sortPointByPrice} from '../utils.js';
import EventListView from '../view/event-list-view';
import SortView from '../view/sort-view';
import EmptyView from '../view/empty-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType,UserAction, UpdateType } from '../const.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;

  #pointPresenters = new Map();
  #newEventPresenter = null;
  #isCreating = false;
  #newEventElement = document.querySelector('.trip-main__event-add-btn');
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #eventListComponent = new EventListView();
  #emptyViewComponent = new EmptyView();

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);

    this.#newEventElement.addEventListener('click',this.#onNewEventClick);

    this.#newEventPresenter = new NewPointPresenter({
      container: this.#eventListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onPointDestroy: this.#handleNewPointFormClose,
    });
  }

  get points(){
    switch(this.#currentSortType){
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortPointByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPointByPrice);
    }
    return this.#pointsModel.points;
  }


  init(){
    this.#renderBoard();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType){
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType,update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType,update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType,update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType){
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType : true});
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType){
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      sorts: Object.values(SortType),
      currentSortType : this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    if (this.points.length !== 0){
      render(this.#sortComponent, this.#eventListComponent.element,RenderPosition.AFTERBEGIN);
    }
  }

  #renderEmptyList(){
    render(this.#emptyViewComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    render(this.#eventListComponent, this.#container);
    this.#renderSort();
    for(let i = 0; i < this.points.length; i ++){
      this.#renderPoint(this.points[i]);
    }
    if(this.points.length === 0 && !this.#isCreating){
      this.#renderEmptyList();
    }

  }


  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#emptyViewComponent);
    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #onNewEventClick = () => {
    this.#isCreating = true;
    this.#newEventElement.disabled = true;
    this.#createPoint();
  };

  #createPoint () {
    this.#currentSortType = SortType.DAY;
    this.#newEventPresenter.init();
  }

  #handleNewPointFormClose = () => {
    this.#isCreating = false;
    this.#newEventElement.disabled = false;
    if (!this.points.length && !this.#isCreating) {
      remove(this.#sortComponent);
      this.#renderEmptyList();
    }
  };
}
