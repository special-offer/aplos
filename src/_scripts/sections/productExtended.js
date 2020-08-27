import $ from 'jquery';
import { throttle } from 'throttle-debounce';
import Swiper from 'swiper';
import BaseSection from './base';
import ProductForm from '../components/productForm';
import TransactionBar from '../components/transactionBar';
import AmbientVideo from '../components/ambientVideo';
import YotpoReviewsWidget from '../components/yotpoReviewsWidget';

const selectors = {
  productForm: 'form[data-product-form]',
  transactionBar: '[data-transaction-bar]',
  ambientVideo: '[data-ambient-video]',
  recipeSlideshow: '[data-recipe-slideshow]',
  yotpoReviewsWidget: '.yotpo-main-widget'
};

const $window = $(window);

export default class ProductExtendedSection extends BaseSection {
  constructor(container) {
    super(container, 'product');

    this.$productForm    = $(selectors.productForm, this.$container).first();
    this.$transactionBar = $(selectors.transactionBar, this.$container).first();
    this.$yotpoReviewsWidgets = $(selectors.yotpoReviewsWidget, this.$container);
    this.$recipeSlideshow = $(selectors.recipeSlideshow, this.$container);
    this.$firstProductGrid = $('.product-grid').first();
    this.$lastProductGrid  = $('.product-grid').last();

    this.productForm = new ProductForm(this.$productForm);
    this.transactionBar = new TransactionBar(this.$transactionBar);
    this.$yotpoReviewsWidgets.each((i, el) => new YotpoReviewsWidget($(el)));
    this.ambientVideos = $.map($(selectors.ambientVideo, this.$container), el => new AmbientVideo(el));
    this.measurements = {
      firstProductGridHeight: 0,
      productGridsBottom: 0
    };

    if (this.$recipeSlideshow.length && this.$recipeSlideshow.find('.swiper-slide').length > 1) {
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
    this.onResize();
  }

  onUnload() {
    $window.off('scroll', this.throttledOnScroll);
    $window.off('resize', this.throttledOnResize);
  }

  onScroll() {
    const scrollTop = $window.scrollTop();
    const threshold = this.measurements.firstProductGridHeight - window.innerHeight;
    const shouldShow = scrollTop > threshold && scrollTop < (this.measurements.productGridsBottom + 200 - window.innerHeight);

    shouldShow ? this.transactionBar.show() : this.transactionBar.hide();
  }

  onResize() {
    this.measurements = {
      firstProductGridHeight: this.$firstProductGrid.outerHeight(),
      productGridsBottom: (this.$lastProductGrid.offset().top + this.$lastProductGrid.outerHeight())
    };    

    this.onScroll();
  }
}
