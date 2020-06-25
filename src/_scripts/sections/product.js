import $ from 'jquery';
import { throttle } from 'throttle-debounce';
import BaseSection from './base';
import ProductForm from '../view/product/productForm';
import StoryPopup from '../view/product/storyPopup';
import TransactionBar from '../view/product/transactionBar';

const selectors = {
  productForm: 'form[data-product-form]',
  storyPopup: '[data-story-popup]',
  transactionBar: '[data-transaction-bar]'
};

const $window = $(window);

export default class ProductSection extends BaseSection {
  constructor(container) {
    super(container, 'product');

    // @TODO - Don't really need to create these instance vars?
    this.$productForm    = $(selectors.productForm, this.$container).first();
    this.$storyPopup     = $(selectors.storyPopup, this.$el);
    this.$transactionBar = $(selectors.transactionBar, this.$el);

    this.productForm = new ProductForm(this.$productForm);
    this.storyPopup  = new StoryPopup(this.$storyPopup);
    this.transactionBar = new TransactionBar(this.$transactionBar);

    this.throttledScroll = throttle(50, this.onScroll.bind(this));

    $window.on('scroll', this.throttledScroll);

    // Hit once when the section loads
    this.onScroll();
  }

  onUnload() {
    $window.off('scroll', this.throttledScroll);
  }

  onScroll(e) {
    const scrollTop = $window.scrollTop();

    scrollTop > 50 ? this.transactionBar.show() : this.transactionBar.hide();
  }
}
