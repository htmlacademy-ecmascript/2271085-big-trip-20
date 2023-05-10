import { render } from '../render';
import EventListView from '../view/event-list-view';
import PointEditView from '../view/point-edit-view';
import SortView from '../view/sort-view';
import PointView from '../view/point-view';
export default class BoardPresenter {
  sortComponent = new SortView();
  eventListComponent = new EventListView();

  constructor({container, pointsModel}) {
    this.container = container;
    this.pointsModel = pointsModel;
    this.boardPoints = [...this.pointsModel.getPoints()];
  }

  init(){

    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    render (
      new PointEditView({
        point: this.boardPoints[0],
        pointDestination: this.pointsModel.getById(this.boardPoints[0].destination),
        pointOffers: this.pointsModel.getOffers(),
      }),
      this.eventListComponent.getElement()
    );

    for(let i = 1; i < this.boardPoints.length; i ++){
      render(
        new PointView({
          point: this.boardPoints[i],
          pointDestination: this.pointsModel.getById(this.boardPoints[i].destination),
          pointOffers: this.pointsModel.getOffers()
        }),
        this.eventListComponent.getElement());

    }
  }
}
