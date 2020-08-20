import $ from 'jquery';
import { throttle } from 'throttle-debounce';
import Swiper from 'swiper';
import BaseSection from './base';
import ProductForm from '../components/productForm';
import StoryPopup from '../components/storyPopup';
import TransactionBar from '../components/transactionBar';
import AmbientVideo from '../components/ambientVideo';
import YotpoReviewsWidget from '../components/yotpoReviewsWidget';

const selectors = {
  productForm: 'form[data-product-form]',
  storyPopup: '[data-story-popup]',
  transactionBar: '[data-transaction-bar]',
  ambientVideo: '[data-ambient-video]',
  recipeSlideshow: '[data-recipe-slideshow]',
  yotpoReviewsWidget: '.yotpo-main-widget'
};

const $window = $(window);

export default class ProductExtendedSection extends BaseSection {
  constructor(container) {
    super(container, 'product');

    // @TODO - Don't really need to create these instance vars?
    this.$productForm    = $(selectors.productForm, this.$container).first();
    this.$storyPopup     = $(selectors.storyPopup, this.$container).first();
    this.$transactionBar = $(selectors.transactionBar, this.$container).first();
    this.$yotpoReviewsWidgets = $(selectors.yotpoReviewsWidget, this.$container);
    this.$recipeSlideshow = $(selectors.recipeSlideshow, this.$container);

    this.productForm = new ProductForm(this.$productForm);
    this.storyPopup  = new StoryPopup(this.$storyPopup);
    this.transactionBar = new TransactionBar(this.$transactionBar);
    this.$yotpoReviewsWidgets.each((i, el) => new YotpoReviewsWidget($(el))); // One on desktop + one inside the story popup
    this.ambientVideos = $.map($(selectors.ambientVideo, this.$container), el => new AmbientVideo(el));

    if (this.$recipeSlideshow.length) {
      this.swiper = new Swiper(this.$recipeSlideshow.get(0), {
        loop: true,
        speed: 500,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      });
    }

    this.throttledOnScroll = throttle(50, this.onScroll.bind(this));
    this.throttledOnResize = throttle(300, this.onResize.bind(this));

    $window.on('scroll', this.throttledOnScroll);
    $window.on('resize', this.throttledOnResize);

    // Hit once when the section loads
    this.onScroll();
  }

  onUnload() {
    $window.off('scroll', this.throttledOnScroll);
    $window.off('resize', this.throttledOnResize);
  }

  onScroll() {
    // @TODO - Cache the first product grid height 
    const scrollTop = $window.scrollTop();
    const threshold = $('.product-grid').first().outerHeight() - window.innerHeight;
    const shouldShow = scrollTop > threshold && scrollTop < (this.$container.outerHeight() - window.innerHeight);

    shouldShow ? this.transactionBar.show() : this.transactionBar.hide();
  }

  onResize() {
    this.onScroll();
  }
}
