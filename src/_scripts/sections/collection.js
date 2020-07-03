import $ from 'jquery';
import BaseSection from './base';
import ProductCard from '../view/product/productCard';

const selectors = {
  productCard: '[data-product-card]'
};

export default class CollectionSection extends BaseSection {
  constructor(container) {
    super(container, 'collection');

    this.productCards = $.map($(selectors.productCard, this.$container), el => new ProductCard(el));
  }
}
