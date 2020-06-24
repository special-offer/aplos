import $ from 'jquery';
import Swiper from 'swiper';

const selectors = {
  swiper: '[data-story-popup-swiper]',
  pagination: '[data-story-popup-pagination]',
  open: '[data-story-popup-open]',
  close: '[data-story-popup-close]'
};

const classes = {
  active: 'is-active',
  bodyOpen: 'story-popup-open'
};

const $body = $(document.body);

export default class StoryPopup {
  /**
   * Story Popup
   *
   * @param {HTMLElement | jQuery} el - popup element
   */  
  constructor(el) {
    this.$el = $(el);
    this.$swiper = $(selectors.swiper, this.$el);
    this.$pagination = $(selectors.pagination, this.$el);

    this.swiper = new Swiper(this.$swiper.get(0), {
      loop: false,
      speed: 500,
      pagination: {
        el: this.$pagination.get(0),
        type: 'bullets'
      },
      simulateTouch: false
    });    

    this.$el.on('click', selectors.close, this.onCloseClick.bind(this));
    $body.on('click', selectors.open, this.onOpenClick.bind(this));
  }

  onCloseClick(e) {
    e.preventDefault();
    this.$el.removeClass(classes.active);
    $body.removeClass(classes.bodyOpen);
  }

  onOpenClick(e) {
    e.preventDefault();
    this.$el.addClass(classes.active);
    $body.addClass(classes.bodyOpen);
  }
}
