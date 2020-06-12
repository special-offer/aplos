import $ from 'jquery';
import Swiper from 'swiper';

const selectors = {
  slideshow: '[data-slideshow]',
  initialSlide: '[data-initial-slide]'
};

export default class ProductDetailGallery {
  /**
   * Product Detail Gallery Constructor
   *
   * See: snippets/product-detail-gallery.liquid
   *
   * @param {HTMLElement | jQuery} el - gallery element containing elements matching the slideshow
   */  
  constructor(el) {
    this.$el = $(el);
    this.$slideshow  = this.$el.find(selectors.slideshow);
    this.optionValue = this.$el.data('option-value');

    // Look for element with the initialSlide selector.
    const initialSlide = this.$slideshow.find(selectors.initialSlide).length ? this.$slideshow.find(selectors.initialSlide).index() : 0;

    this.swiper = new Swiper(this.$slideshow.get(0), {
      init: false,
      loop: true,
      initialSlide: initialSlide,
      speed: 500
    });

    this.swiper.init();
  }
}
