import $ from 'jquery';
import Swiper from 'swiper';
import BaseSection from './base';

const selectors = {
  slideshow: '[data-slideshow]'
};

export default class TestimonialsSection extends BaseSection {
  constructor(container) {
    super(container, 'testimonials');

    this.$slideshow = $(selectors.slideshow, this.$container);

    const swiperOptions = {
      loop: true,
      speed: 1200,
      effect: 'fade',
      navigation: {
        nextEl: this.$slideshow.find('.arrow--right').get(0),
        prevEl: this.$slideshow.find('.arrow--left').get(0)
      },
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 3500
      }
    };

    // if (this.$slideshow.data('autoplay')) {
    //   swiperOptions.autoplay = {
    //     delay: Number.parseInt(this.$slideshow.data('speed')) || 5000
    //   };
    // }

    this.swiper = new Swiper(this.$slideshow.get(0), swiperOptions);
  }

  /**
   * Theme Editor section events below
   */
  onBlockSelect(e) {
    const $blockSlide = this.$slideshow.find(`[data-block-id="${e.detail.blockId}"]`);

    if ($blockSlide.length === 0) {
      return;
    }

    this.swiper.slideToLoop($blockSlide.first().data('swiper-slide-index'));
    this.swiper.autoplay.stop();
  }

  onBlockDeselect(e) {
    this.swiper.autoplay.start();
  }
}
