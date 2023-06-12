import { remove, render,RenderPosition } from '../framework/render.js';
import {sortPointByTime, sortPointByPrice, sortPointByDay, filter} from '../utils.js';
import EventListView from '../view/event-list-view';
import SortView from '../view/sort-view';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType,UserAction, UpdateType, FilterType } from '../const.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #newEventPresenter = null;
  #isCreating = false;
  #newEventButton = document.querySelector('.trip-main__event-add-btn');
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #eventListComponent = new EventListView();
  #emptyViewComponent = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #filterType = FilterType.EVERYTHING;

  constructor({container, pointsModel, filterModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newEventButton.addEventListener('click',this.#onNewEventClick);

    this.#newEventPresenter = new NewPointPresenter({
      container: this.#eventListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onPointDestroy: this.#handleNewPointFormClose,
    });
  }

  get points(){
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch(this.#currentSortType){
      case SortType.TIME:
        return filteredPoints.sort(sortPointByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointByPrice);
    }
    return filteredPoints.sort(sortPointByDay);
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
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#newEventButton.disabled = false;
        remove(this.#loadingComponent);
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
      render(this.#sortComponent, this.#eventListComponent.element,RenderPosition.BEFOREBEGIN);
    }
  }

  #renderMessage(){
    this.#emptyViewComponent = new EmptyView({filterType: this.#filterType});
    render(this.#emptyViewComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    render(this.#eventListComponent, this.#container);

    if(this.#isLoading){
      this.#renderLoading();
      this.#newEventButton.disabled = true;
      return;
    }

    if(this.points.length === 0 && !this.#isCreating){
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    for(let i = 0; i < this.points.length; i ++){
      this.#renderPoint(this.points[i]);
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
    remove(this.#loadingComponent);
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
    this.#newEventButton.disabled = true;
    remove(this.#emptyViewComponent);
    this.#createPoint();
  };

  #createPoint () {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #handleNewPointFormClose = () => {
    this.#isCreating = false;
    this.#newEventButton.disabled = false;
    if (!this.points.length && !this.#isCreating) {
      remove(this.#sortComponent);
      this.#renderMessage();
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }
}
