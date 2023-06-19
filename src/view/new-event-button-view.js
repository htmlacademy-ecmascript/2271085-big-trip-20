import AbstractView from '../framework/view/abstract-view.js';

function createNewEventButtonTemplate () {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  #handleNewEventClick = null;

  constructor(onNewEventClick){
    super();
    this.#handleNewEventClick = onNewEventClick;

    this.element.addEventListener('click', this.#onNewEventClick);
  }

  get template () {
    return createNewEventButtonTemplate();
  }

  #onNewEventClick = (evt) => {
    evt.preventDefault();
    this.#handleNewEventClick(evt);
  };

}
