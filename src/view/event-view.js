import AbstractView from '../framework/view/abstract-view';
import { formatDate, formatTime } from '../utils/date';
import { encodeValue, getTripDuration } from '../utils/trip';

const createScheduleTemplate = (dateFrom, dateTo) => {
  const fromTime = formatTime(dateFrom);
  const toTime = formatTime(dateTo);

  const duration = getTripDuration(dateFrom, dateTo);

  return (`
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFrom}">${fromTime}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateTo}">${toTime}</time>
      </p>
      <p class="event__duration">${duration}</p>
    </div>
  `);
};

const createOfferTemplate = ({title, price}) => (`
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>
`);

const createOffersTemplate = (offers) => offers?.length ? offers.map(createOfferTemplate).join('') : '';

const createEventTemplate = ({basePrice, dateFrom, dateTo, destination, isFavorite, offers, type}) => {
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  const eventDate = formatDate(dateFrom, 'DD MMM');
  const eventDateTime = formatDate(dateFrom);

  const offersTemplate = createOffersTemplate(offers);

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${eventDateTime}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination ? encodeValue(destination.name) : ''}</h3>
        ${createScheduleTemplate(dateFrom, dateTo)}
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};


export default class EventView extends AbstractView {
  #event = null;

  constructor(event) {
    super();
    this.#event = event;
  }

  get template() {
    return createEventTemplate(this.#event);
  }

  setRollUpButtonClick = (callback) => {
    this._callback.rollUpButtonClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpButtonHandler);
  };

  setFavoriteClick = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteHandler);
  };

  #rollUpButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollUpButtonClick(this.#event, this);
  };

  #favoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
