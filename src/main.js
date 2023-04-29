import {render, RenderPosition} from './render.js';
import FilterView from './view/filter-view.js';
import MainInfoView from './view/main-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';

const tripFiltersElement = document.querySelector('.trip-controls__filters');
const mainInfoElement = document.querySelector('.trip-main');
const tripEventsListElement = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  container: tripEventsListElement
});

render (new MainInfoView(), mainInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), tripFiltersElement);

boardPresenter.init();
