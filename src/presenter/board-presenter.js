import { remove, render,RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {sortPointByTime, sortPointByPrice, sortPointByDay, filter} from '../utils.js';
import EventListView from '../view/event-list-view';
import SortView from '../view/sort-view';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import NewPointButtonView from '../view/nev-event-button.-view.js';
import MainInfoView from '../view/main-info-view.js';
import { SortType,UserAction, UpdateType, FilterType } from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #newEventPresenter = null;
  #isCreating = false;
  #newEventButton;
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #eventListComponent = new EventListView();
  #emptyViewComponent = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #filterType = FilterType.EVERYTHING;
  #headerContainer = null;
  #mainInfoComponent = new MainInfoView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({container, pointsModel, filterModel, headerContainer}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#headerContainer = headerContainer;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newEventButton = new NewPointButtonView(this.#onNewEventClick);

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
    render(this.#newEventButton, this.#headerContainer);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType){
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try{
          await this.#pointsModel.updatePoint(updateType,update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType,update);
        } catch(err){
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType,update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType){
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        this.#renderTripInfo();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType : true});
        this.#renderBoard();
        this.#renderTripInfo();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#newEventButton.element.disabled = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#renderTripInfo();
        break;
    }
  };

  #renderTripInfo(){
    this.#mainInfoComponent = new MainInfoView(this.#pointsModel.points, this.#pointsModel.destinations, this.#pointsModel.offers);
    render (this.#mainInfoComponent,this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

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
      this.#newEventButton.element.disabled = true;
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

  #createPoint () {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
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

  #renderLoading() {
    render(this.#loadingComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({resetSortType = false} = {}) {

    this.#newEventPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#emptyViewComponent);
    remove(this.#loadingComponent);
    remove(this.#mainInfoComponent);
    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType){
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
    this.#renderTripInfo();
  };

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleNewPointFormClose = () => {
    this.#isCreating = false;
    this.#newEventButton.element.disabled = false;
    if (!this.points.length && !this.#isCreating) {
      remove(this.#sortComponent);
      this.#renderMessage();
    }
  };

  #onNewEventClick = () => {
    this.#isCreating = true;
    this.#newEventButton.element.disabled = true;
    remove(this.#emptyViewComponent);
    this.#createPoint();
  };

}
