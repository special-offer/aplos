import $ from 'jquery';
import BaseSection from './base';
import AJAXKlaviyoForm from '../lib/ajaxKlaviyoForm';

const selectors = {
  form: '[data-form]',
  formMessage: '[data-form-message]'
};

const $body = $(document.body);

export default class PasswordSection extends BaseSection {
  constructor(container) {
    super(container, 'password');

    this.$form = $(selectors.form, this.$container);
    this.$input = this.$form.find('input[type="email"]');
    this.$formMessage = $(selectors.formMessage, this.$container);

    this.klaviyoForm = new AJAXKlaviyoForm(this.$form, {
      listId: this.$form.data('klaviyo-list-id'),
      source: this.$form.data('klaviyo-source'),
      onSubscribeSuccess: this.onSubscribeSuccess.bind(this),
      onSubscribeFail: this.onSubscribeFail.bind(this),
      onSubmitFail: this.onSubmitFail.bind(this)
    })

    this.$input.one('focus', () => $body.addClass('is-interacted'));
  }

  onSubscribeSuccess(response) {
    console.log('success');
    console.log(response);

    const isSubscribed = response && response.data && response.data.is_subscribed;
    this.$formMessage.text(this.$formMessage.data(isSubscribed ? 'message-already-subscribed' : 'message-success'));
  }

  onSubscribeFail(response) {
    console.log('fail');
    console.log(response);
    this.$formMessage.text(this.$formMessage.data('message-fail'));
  }

  onSubmitFail(errors) {
    const e = Array.isArray(errors) ? errors.join('  ') : errors

    console.log(e)
  }
}
