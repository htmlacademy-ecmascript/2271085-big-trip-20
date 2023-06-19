import AbstractView from '../framework/view/abstract-view.js';

const createServerUnavailableTemplate = () => '<p class="trip-events__msg">Server is unavailable. Try again later.</p>';

export default class ServerUnavailableView extends AbstractView {
  get template() {
    return createServerUnavailableTemplate();
  }
}
