import { render } from '../render';
import EventListView from '../view/event-list-view';
import PointEditView from '../view/point-edit-view';
import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import {POINT_COUNT} from '../const.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  eventListComponent = new EventListView();

  constructor({container}) {
    this.container = container;
  }

  init(){
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    render(new PointEditView(), this.eventListComponent.getElement());
    for (let i = 0; i < POINT_COUNT; i++){
      render(new PointView(), this.eventListComponent.getElement());
    }
  }
}
