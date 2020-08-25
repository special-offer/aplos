import $ from 'jquery';
import Swiper from 'swiper';
import { isTouch } from '../core/utils';
import BaseSection from './base';
import ProductForm from '../components/productForm';

const selectors = {
  productForm: 'form[data-product-form]',
  slideshow: '[data-slideshow]'
};

export default class ProductSection extends BaseSection {
  constructor(container) {
    super(container, 'product');

    // @TODO - Don't really need to create this instance var?
    this.$productForm = $(selectors.productForm, this.$container).first();
    this.$slideshow = $(selectors.slideshow, this.$el);

    this.productForm = new ProductForm(this.$productForm);

    const swiperOptions = {
      loop: true,
      speed: 1200,
      autoplay: {
        delay: 3500
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      simulateTouch: false,
      disableOnInteraction: false
    };

    if (isTouch()) {
      swiperOptions.effect = 'slide';
    }
    else {
      swiperOptions.effect = 'fade';
      swiperOptions.fadeEffect = { crossFade: true };
    }    

    this.swiper = new Swiper(this.$slideshow.get(0), swiperOptions);

    this.swiper.autoplay.start();
  }
}
