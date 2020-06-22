import $ from 'jquery';
import BaseSection from './base';
import CartAPI from '../core/cartAPI';
import { getQueryParams } from '../core/utils';
import AJAXFormManager from '../managers/ajaxForm';
import AJAXCartDrawer from '../ui/ajaxCartDrawer';

const $window = $(window);

/**
 * Ajax Cart Section Script
 * ------------------------------------------------------------------------------
 * All logic is handled via CartAPI or AJAXCartDrawer
 * This file is strictly for handling section settings/instantiation and theme editor interactions
 *
 */
export default class AJAXCartSection extends BaseSection {
  constructor(container) {
    super(container, 'ajaxCart');

    this.ajaxCartDrawer = new AJAXCartDrawer(this.$container.find('.drawer').first());

    // Store callbacks so we can remove them later
    this.callbacks = {
      changeSuccess: e => this.ajaxCartDrawer.onChangeSuccess(e.cart),
      changeFail:    e => this.ajaxCartDrawer.onChangeFail(e.message)
    };

    $window.on(AJAXFormManager.events.ADD_SUCCESS, this.callbacks.changeSuccess);
    $window.on(AJAXFormManager.events.ADD_FAIL, this.callbacks.changeFail);

    // Make sure we get the latest cart data when this initializes
    CartAPI.getCart().then((cart) => {
      this.ajaxCartDrawer.render(cart);

      // If redirected from the cart, show the ajax cart after a short delay
      if (getQueryParams().cart) {
        this.ajaxCartDrawer.show();
      }
    });
  }

  onSelect() {
    this.ajaxCartDrawer.show();
  }

  onDeselect() {
    this.ajaxCartDrawer.hide();
  }

  onUnload() {
    this.ajaxCartDrawer.destroy(); // Need to destroy to clean up body / window event listeners
    $window.off(AJAXFormManager.events.ADD_SUCCESS, this.callbacks.changeSuccess);
    $window.off(AJAXFormManager.events.ADD_FAIL, this.callbacks.changeFail);
  }
}
