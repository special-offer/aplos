import $ from 'jquery';

export default class CustomerForm {
  /**
   * Customer Form Constructor
   *
   * @constructor
   * @param {HTMLElement | jQuery} form
   */  
  constructor(form) {
    this.$form = $(form);

    if (!this.$form || this.$form.length === 0) {
      console.warn('[CustomerForm] - Form required to initialize.');
      return;
    }

    this.$formControls = $('.form-control', this.$form);
    this.$passwordInput = this.$formControls.filter('[name="customer[password]"]');
    this.$passwordConfirmInput = this.$formControls.filter('[name="customer[password_confirm]"]');

    this.$form.on('focus', '.form-control', this.onFormControlFocus.bind(this));
    this.$form.on('keydown', '.form-control', this.onFormControlKeydown.bind(this));
    this.$form.on('submit', this.onSubmit.bind(this));
  }

  validate() {
    let valid = true;

    this.$formControls.each((i, el) => {
      if (el.value.length === 0) {
        valid = false;
        this.applyError(el, 'Field cannot be blank');
      }
    });

    if (this.$passwordInput.length && this.$passwordConfirmInput.length) {
      if (this.$passwordInput.val() !== this.$passwordConfirmInput.val()) {
        valid = false;
        this.applyError(this.$passwordConfirmInput, 'Passwords must match');
      }
    }

    return valid;
  }

  getFormGroup($el) {
    return $el.is('.form-group') ? $el : $el.parents('.form-group');
  }

  applyError(el, message) {
    const $el = $(el);
    const $formGroup = this.getFormGroup($el);
    const $feedback = $formGroup.find('.form-feedback');
    
    $formGroup.addClass('is-invalid');

    if (message) {
      if ($feedback.length) {
        $feedback.text(message);
      }
      else {
        const $msg = $(document.createElement('div')).addClass('form-feedback').text(message);
        $msg.appendTo($formGroup);
      }
    }
  }

  removeError(el) {
    const $el = $(el);
    const $formGroup = this.getFormGroup($el);
    
    $formGroup.removeClass('is-invalid');
    $formGroup.find('.form-feedback').remove(); // remove message if there is one
  }  

  onFormControlFocus(e) {
    this.removeError(e.currentTarget);
  }

  onFormControlKeydown(e) {
    this.removeError(e.currentTarget); 
  }

  onSubmit(e) {
    const valid = this.validate();

    if (!valid) {
      e.preventDefault();
      return false;
    }

    return true;
  }
}
