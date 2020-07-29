import $ from 'jquery';
import { throttle } from 'throttle-debounce';
import BaseSection from './base';
import ProductForm from '../view/product/productForm';
import StoryPopup from '../view/product/storyPopup';
import TransactionBar from '../view/product/transactionBar';
import YotpoReviewsWidget from '../view/product/yotpoReviewsWidget';

const selectors = {
  productForm: 'form[data-product-form]',
  storyPopup: '[data-story-popup]',
  transactionBar: '[data-transaction-bar]',
  yotpoReviewsWidget: '.yotpo-main-widget'
  // productGrid: '.product-grid'
};

const $window = $(window);

export default class ProductSection extends BaseSection {
  constructor(container) {
    super(container, 'product');

    // this.$productGrids = $(selectors.productGrid);

    // @TODO - Don't really need to create these instance vars?
    this.$productForm    = $(selectors.productForm, this.$container).first();
    this.$storyPopup     = $(selectors.storyPopup, this.$container).first();
    this.$transactionBar = $(selectors.transactionBar, this.$container).first();
    this.$yotpoReviewsWidget = $(selectors.yotpoReviewsWidget, this.$container).first();

    this.productForm = new ProductForm(this.$productForm);
    this.storyPopup  = new StoryPopup(this.$storyPopup);
    this.transactionBar = new TransactionBar(this.$transactionBar);

    if (this.$yotpoReviewsWidget.length === 1) {
      this.yotpoReviewsWidget = new YotpoReviewsWidget(this.$yotpoReviewsWidget);    
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
