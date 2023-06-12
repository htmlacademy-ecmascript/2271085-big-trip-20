import AbstractView from '../framework/view/abstract-view.js';
import { FilterTypeMessage } from '../const.js';


const createEmptyTemplate = (activeFilter) => {
  const emptyMessage = FilterTypeMessage[activeFilter];
  return`
  <p class="trip-events__msg">${emptyMessage}</p>`;
};

export default class EmptyView extends AbstractView{

  #activeFilter = null;

  constructor({ filterType }) {
    super();
    this.#activeFilter = filterType;
  }

  get template(){
    return createEmptyTemplate(this.#activeFilter.toUpperCase());
  }
}
