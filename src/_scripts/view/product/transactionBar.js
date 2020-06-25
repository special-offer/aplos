import $ from 'jquery';

const classes = {
  active: 'is-active'
};

export default class TransactionBar {
  /**
   * Transaction Bar
   *
   * @param {HTMLElement | jQuery} el
   */  
  constructor(el) {
    this.$el = $(el);

    this.isActive = false;
  }

  show() {
    if (this.isActive) return;

    this.$el.addClass(classes.active);
    this.isActive = true;
  }

  hide() {
    if (!this.isActive) return;

    this.$el.removeClass(classes.active);
    this.isActive = false;
  }
}
