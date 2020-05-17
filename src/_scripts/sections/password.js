import $ from 'jquery';
import BaseSection from './base';
import AJAXKlaviyoForm from '../lib/ajaxKlaviyoForm';

const selectors = {
  form: '[data-form]',
  formMessage: '[data-form-message]'
};

const $body = $(document.body);

const INTERACTION_MS = 300; // Give the user a little bit of time to move between input + submit

export default class PasswordSection extends BaseSection {
  constructor(container) {
    super(container, 'password');

    this.interactionTimeout = null;
    this.isSubmitting       = false;

    this.$form        = $(selectors.form, this.$container);
    this.$formMessage = $(selectors.formMessage, this.$container);

    this.klaviyoForm = new AJAXKlaviyoForm(this.$form, {
      listId: this.$form.data('klaviyo-list-id'),
      source: this.$form.data('klaviyo-source'),
      onSubscribeSuccess: this.onSubscribeSuccess.bind(this),
      onSubscribeFail: this.onSubscribeFail.bind(this),
      onSubmitFail: this.onSubmitFail.bind(this)
    });

    this.$input  = this.klaviyoForm.$input;
    this.$submit = this.klaviyoForm.$submit;

    this.$input.on({
      focus: () => this.setInteracting(true),
      blur: () => this.setInteracting(false)
    });
    this.$submit.on({
      'focus mouseenter': () => this.setInteracting(true),
      'blur': () => this.setInteracting(false)
    });
  }

  setInteracting(interacting) {
    // if (this.isSubmitting) return; // Maybe?

    if (interacting) {
      clearTimeout(this.interactionTimeout);
      $body.addClass('is-interacting');
    }
    else {
      this.interactionTimeout = setTimeout(() => {
        $body.removeClass('is-interacting');
      }, INTERACTION_MS);
    }
  }

  onSubscribeSuccess(response) {
    // console.log('success');
    // console.log(response);
    const isSubscribed = response && response.data && response.data.is_subscribed;
    this.$formMessage.text(this.$formMessage.data(isSubscribed ? 'message-already-subscribed' : 'message-success'));
  }

  onSubscribeFail(response) {
    // console.log('fail');
    // console.log(response);
    this.$formMessage.text(this.$formMessage.data('message-fail'));
  }

  onSubmitFail(errors) {
    // const e = Array.isArray(errors) ? errors.join('  ') : errors;
    // console.log(e)
  }
}
