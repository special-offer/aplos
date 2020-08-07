import $ from 'jquery';
import BaseSection from './base';

const selectors = {
  pageNav: '[data-page-nav]'
};

export default class PageSection extends BaseSection {
  constructor(container) {
    super(container, 'page');

    $(selectors.pageNav, this.$container).on('click', this.onPageNavClick.bind(this));
  }

  onPageNavClick(e) {
    const $scrollTo = $(e.currentTarget.getAttribute('href'));

    if ($scrollTo.length === 0) return;

    e.preventDefault();

    const scrollTop = $scrollTo.offset().top - 120;

    $('html, body').animate({ scrollTop }, 500, 'easeInOutQuart');
  }
}
