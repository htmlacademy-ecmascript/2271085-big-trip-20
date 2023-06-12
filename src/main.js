import {render, RenderPosition} from './framework/render.js';
import MainInfoView from './view/main-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const tripFiltersElement = document.querySelector('.trip-controls__filters');
const mainInfoElement = document.querySelector('.trip-main');
const tripEventsListElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter ({
  container: tripFiltersElement,
  pointsModel,
  filterModel
});

const boardPresenter = new BoardPresenter({
  container: tripEventsListElement,
  pointsModel,
  filterModel,
});

render (new MainInfoView(), mainInfoElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
boardPresenter.init();
