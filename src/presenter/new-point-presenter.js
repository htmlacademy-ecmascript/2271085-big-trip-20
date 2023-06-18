import { RenderPosition, remove, render} from '../framework/render';
import PointEditView from '../view/point-edit-view';
import { POINT_EMPTY,EditType, UpdateType, UserAction } from '../const';


export default class NewPointPresenter {
  #container = null;
  #pointNewComponent = null;
  #handleDataChange = null;
  #pointsModel = null;
  #handlePointDestroy = null;
  #point = null;

  constructor({container, pointsModel, onDataChange, onPointDestroy}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handlePointDestroy = onPointDestroy;
  }

  init (){

    this.#point = POINT_EMPTY;
    if(this.#pointNewComponent !== null){
      return;
    }

    this.#pointNewComponent = new PointEditView({
      point:this.#point,
      pointDestination:this.#point.destination,
      allDestinations: this.#pointsModel.destinations,
      pointOffers: this.#pointsModel.offers,
      formType: EditType.CREATING,
      onResetClick: this.#handleResetButtonClick,
      onSubmitClick: this.#handlePointSubmit,
    });

    render(this.#pointNewComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeydown);
  }

  destroy () {
    if (this.#pointNewComponent === null) {
      return;
    }

    this.#handlePointDestroy();
    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;

    document.removeEventListener('keydown', this.#onEscKeydown);
  }

  setSaving() {
    this.#pointNewComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }


  setAborting() {
    const resetFormState = () => {
      this.#pointNewComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#pointNewComponent.shake(resetFormState);
  }

  #handleResetButtonClick = () =>{
    this.destroy();
  };

  #handlePointSubmit = (update) => {
    if (!update.destination){
      return;
    }
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      update
    );
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };

}
