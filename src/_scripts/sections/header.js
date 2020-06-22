import $ from 'jquery';
import { throttle } from 'throttle-debounce';
import BaseSection from './base';
import AJAXCartDrawer from '../ui/ajaxCartDrawer';

const $window = $(window);
const $body   = $(document.body);

const selectors = {
  header: '[data-header]',
  cartBadge: '[data-cart-badge]',
  cartBadgeCount: '[data-cart-badge-count]'
};

const classes = {
  headerFixed: 'is-fixed',
  siteHasFixedHeader: 'site-fixed-header',
  cartBadgeHasItems: 'has-items'
};

export default class HeaderSection extends BaseSection {
  constructor(container) {
    super(container, 'header');

    this.$el = $(selectors.header, this.$container);
    this.$cartBadge      = $(selectors.cartBadge, this.$container);
    this.$cartBadgeCount = $(selectors.cartBadgeCount, this.$container);

    // We pass in the fixed behavior as a class on the body of the site
    if ($body.hasClass(classes.siteHasFixedHeader)) {
      $window.on('scroll', throttle(50, this.onScroll.bind(this)));
      this.onScroll(); // hit this one time on init to make sure everything is good
    }

    $window.on(AJAXCartDrawer.events.RENDER, this.onAJAXCartRender.bind(this));
  }

  onAJAXCartRender(e) {
    if (e.cart) {
      this.updateCartCount(e.cart.item_count);
    }
  }

  /**
   * Update the cart badge + count
   *
   * @param {Number} count
   */
  updateCartCount(count) {
    this.$cartBadgeCount.html(count);
    this.$cartBadge.toggleClass(classes.cartBadgeHasItems, count > 0);
  }

  scrollCheck() {
    // Do measurements outside of rAF.
    const scrollTop = $window.scrollTop();
    const actualOffset = this.$container.offset().top - this.$el.outerHeight();
    const toggle = !(scrollTop < actualOffset);

    // Do DOM updates inside.
    requestAnimationFrame(() => this.$el.toggleClass(classes.headerFixed, toggle));
  }

  onScroll() {
    this.scrollCheck();
  }
}
