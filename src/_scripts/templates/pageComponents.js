import $ from 'jquery';
import BaseTemplate from './base';
import NewsletterForm from '../components/newsletterForm';
  
const selectors = {
  qaToggleEnabled: '[data-qa-toggle-enabled]',
  qa: '[data-quantity-adjuster]',
  newsletterForm: '#newsletter-form',
  newsletterTriggerSuccess: '[data-newsletter-trigger-success]',
  newsletterTriggerSubscribed: '[data-newsletter-trigger-subscribed]',
  newsletterTriggerFail: '[data-newsletter-trigger-fail]'
};

class PageComponentsTemplate extends BaseTemplate {
  constructor() {
    super('template-page-components');
  }

  addEventHandlers() {
    $(selectors.qaToggleEnabled).on('click', (e) => {
      const $qaInput = $(selectors.qa).find('input[type="number"]');
      $qaInput.attr('disabled', !$qaInput.is(':disabled'));
    });

    // Newsletter Form
    this.newsletterForm = new NewsletterForm($(selectors.newsletterForm), { setCookies: false });

    /* eslint-disable */
    $(selectors.newsletterTriggerSuccess).on('click', () => { this.newsletterForm.onSubscribeSuccess({ data: { is_subscribed: false }}); })
    $(selectors.newsletterTriggerSubscribed).on('click', () => { this.newsletterForm.onSubscribeSuccess({ data: { is_subscribed: true }}); })
    $(selectors.newsletterTriggerFail).on('click', () => { this.newsletterForm.onSubscribeFail(); })
    /* eslint-enable */

    $(document).on('click', 'a[href="#"]', e => e.preventDefault());
  }
}

export default new PageComponentsTemplate();
