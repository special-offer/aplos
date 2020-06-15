import $ from 'jquery';
import { isTouch } from '../core/utils';
import BaseSection from './base';
import AJAXKlaviyoForm from '../lib/ajaxKlaviyoForm';

const selectors = {
  form: '[data-form]',
  formMessage: '[data-form-message]',
  inputWrapper: '.input-wrapper',
  bloom: '[data-bloom]'
};

const classes = {
  formShowMessage: 'show-message',
  hidePlaceholder: 'hide-placeholder'
};

const $body = $(document.body);

const INTERACTION_MS = 300; // Give the user a little bit of time to move between input + submit

export default class PasswordSection extends BaseSection {
  constructor(container) {
    super(container, 'password');

    this.interactionTimeout = null;
    this.formMessageTimeout = null;

    this.$form = $(selectors.form, this.$container);
    this.$formMessage = $(selectors.formMessage, this.$container);
    this.$inputWrapper = $(selectors.inputWrapper, this.$container);
    this.$bloom = $(selectors.bloom, this.$container);

    this.klaviyoForm = new AJAXKlaviyoForm(this.$form, {
      listId: this.$form.data('klaviyo-list-id'),
      source: this.$form.data('klaviyo-source'),
      onSubscribeSuccess: this.onSubscribeSuccess.bind(this),
      onSubscribeFail: this.onSubscribeFail.bind(this),
      onSubmitFail: this.onSubmitFail.bind(this)
    });

    this.$input = this.klaviyoForm.$input;
    this.$submit = this.klaviyoForm.$submit;

    this.$input.on({
      'focus': () => this.setInteracting(true),
      'blur': () => this.onBlur(),
      'keydown keyup': e => this.onInputChange(e)
    });

    this.$submit.on({
      'focus mouseenter': () => this.setInteracting(true),
      'blur': () => this.onBlur()
    });

    const interactionEvent = isTouch() ? 'touchstart' : 'mouseenter';
    this.$bloom.on(interactionEvent, this.onBloomInteractionStart.bind(this));
  }

  setInteracting(interacting, immediate = false) {
    if (this.klaviyoForm.isSubmitting) return;

    if (interacting) {
      clearTimeout(this.interactionTimeout);
      $body.addClass('is-interacting');
    }
    else {
      this.interactionTimeout = setTimeout(() => {
        $body.removeClass('is-interacting');
      }, (immediate ? 0 : INTERACTION_MS));
    }
  }

  showMessageTemporarily(cb = () => { }) {
    this.$form.addClass(classes.formShowMessage);

    clearTimeout(this.formMessageTimeout);
    this.formMessageTimeout = setTimeout(() => {
      this.$form.removeClass(classes.formShowMessage);
      this.$formMessage.one('transitionend', cb);
    }, 3500);
  }

  onSubscribeSuccess(response) {
    const isSubscribed = response && response.data && response.data.is_subscribed;

    this.$formMessage.text(this.$formMessage.data(isSubscribed ? 'message-already-subscribed' : 'message-success'));
    this.showMessageTemporarily(() => {
      this.$input.val('');
      this.onInputChange();
    });
    this.setInteracting(false, true);
  }

  onSubscribeFail(response) {
    this.$formMessage.text(this.$formMessage.data('message-fail'));
    this.showMessageTemporarily();
  }

  onSubmitFail(errors) {
    this.$formMessage.html(Array.isArray(errors) ? errors.join('  ') : errors);
    this.showMessageTemporarily();
  }

  onInputChange() {
    this.$inputWrapper.toggleClass(classes.hidePlaceholder, this.$input.val().length > 0);
  }

  onBlur() {
    if (this.$input.val().length === 0) {
      this.setInteracting(false);
    }
  }

  onBloomInteractionStart(e) {
    const y = e.pageY - this.$bloom.offset().top;
    const left =  Math.floor(Math.random() * 100) + 1;
    let top = 0;

    if (y < 200) {
      top = Math.floor(Math.random() * (100 - 66 + 1) + 66);
    }
    else {
      top = Math.floor(Math.random() * (33 - 0 + 1));
    }

    this.$bloom.css({
      top: `${top}%`,
      left: `${left}%`
    });
  }
}
