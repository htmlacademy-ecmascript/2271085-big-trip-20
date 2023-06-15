import AbstractView from '../framework/view/abstract-view.js';

function createNewEventButtonTemplate () {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  #clickHandler = null;

  constructor(clickHandler){
    super();
    this.#clickHandler = clickHandler;

    this.element.addEventListener('click', this.#handleCLick);
  }

  get template () {
    return createNewEventButtonTemplate();
  }

  #handleCLick = (evt) => {
    evt.preventDefault();
    this.#clickHandler(evt);
  };

}
