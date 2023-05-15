import {render, RenderPosition} from './framework/render.js';
import FilterView from './view/filter-view.js';
import MainInfoView from './view/main-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';

const tripFiltersElement = document.querySelector('.trip-controls__filters');
const mainInfoElement = document.querySelector('.trip-main');
const tripEventsListElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();

const boardPresenter = new BoardPresenter({
  container: tripEventsListElement,
  pointsModel,
});

render (new MainInfoView(), mainInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), tripFiltersElement);

boardPresenter.init();
