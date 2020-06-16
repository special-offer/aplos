import $ from 'jquery';
import BaseSection from './base';
import Drawer from '../ui/drawer';
import AJAXKlaviyoForm from '../lib/ajaxKlaviyoForm';
import NewsletterForm from '../ui/newsletterForm';

const selectors = {
  toggle: '[data-mobile-menu-toggle]',
  menu: '[data-mobile-menu]',
  newsletterForm: '[data-newsletter-form]'
};

export default class MobileMenuSection extends BaseSection {
  constructor(container) {
    super(container, 'mobileMenu');

    this.$el     = $(selectors.menu, this.$container);
    this.$toggle = $(selectors.toggle); // Don't scope to this.$container
    this.$form   = $(selectors.newsletterForm, this.$container);

    this.drawer  = new Drawer(this.$el);
    this.newsletterForm = new NewsletterForm(this.$form, { setCookies: false });

    this.ajaxForm = new AJAXKlaviyoForm(this.$form, {
      listId: this.$form.data('klaviyo-list-id'),
      source: this.$form.data('klaviyo-source'),
      onSubmitFail: errors => this.newsletterForm.onSubmitFail(errors),
      onSubscribeSuccess: response => this.newsletterForm.onSubscribeSuccess(response),
      onSubscribeFail: response => this.newsletterForm.onSubscribeFail(response)
    });     

    this.$toggle.on('click', this.onToggleClick.bind(this));
  }

  onToggleClick(e) {
    e.preventDefault();
    this.drawer.toggle();
  }

  onSelect() {
    this.drawer.show();
  }

  onDeselect() {
    this.drawer.hide();
  }

  onUnload() {
    this.drawer.$backdrop && this.drawer.$backdrop.remove();
  }
}
