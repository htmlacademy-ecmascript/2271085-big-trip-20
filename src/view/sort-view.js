import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortTemplates = (sorts, currentSortType) =>
  sorts.map((sort) =>
    `<div class="trip-sort__item  trip-sort__item--${sort}">
    <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}"
    ${sort === SortType.EVENT || sort === SortType.OFFERS ? 'disabled' : ''} ${sort === currentSortType ? 'checked' : ''}
    data-sort-type="${sort}">
    <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
  </div>`).join('');

const createSortTemplate = (sorts, currentSortType) =>
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createSortTemplates(sorts, currentSortType)}
  </form>`;

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #sorts = null;
  #currentSortType = null;

  constructor({sorts,onSortTypeChange, currentSortType}){
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#sorts = sorts;
    this.#currentSortType = currentSortType;

    this.element
      .addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sorts, this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT'){
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}

