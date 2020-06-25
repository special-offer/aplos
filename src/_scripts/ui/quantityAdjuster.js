import $ from 'jquery';

/**
 * Quantity Adjuster Scripts
 * -----------------------------------------------------------------------------
 * Handles any events associated with the quantity adjuster component
 * Quantity Adjuster for Aplos is unique because it only accepts values 0, 1, 2, and 4
 *
 *  [data-quantity-adjuster]
 *    [data-increment]
 *    input[type="number"]
 *    [data-decrement]
 *
 */

const selectors = {
  adjuster:  '[data-quantity-adjuster]',
  increment: '[data-increment]',
  decrement: '[data-decrement]',
  input:     'input[type="number"]'
};

const dataKey = 'quantity-adjuster';

export default class QuantityAdjuster {
  /**
   * Quantity Adjuster Constructor
   *
   * @param {HTMLElement | jQuery} el - element, either matching selectors.adjuster or a child element
   */  
  constructor(el) {
    this.name = 'quantityAdjuster';
    this.namespace = `.${this.name}`;

    this.$el = $(el).is(selectors.adjuster) ? $(el) : $(el).parents(selectors.adjuster);

    if (!this.$el) {
      console.warn(`[${this.name}] - Element required to initialize`);
      return;
    }

    this.$increment = $(selectors.increment, this.$el);
    this.$decrement = $(selectors.decrement, this.$el);
    this.$input     = $(selectors.input, this.$el);

    this.min = parseInt(this.$input.attr('min')) || 0;
    this.max = parseInt(this.$input.attr('max')) || 4;

    this.$increment.on('click', this.onIncrementClick.bind(this));
    this.$decrement.on('click', this.onDecrementClick.bind(this));
    this.$input.on('change',    this.onInputChange.bind(this));

    this._updateDisabledState();
  }

  _updateDisabledState() {
    if (this.$input.is(':disabled')) {
      this.$increment.prop('disabled', true);
      this.$decrement.prop('disabled', true);
      return;
    }

    const val = this.getVal();

    if (val === this.max && val === this.min) {
      this.$increment.prop('disabled', true);
      this.$decrement.prop('disabled', true);
    }
    else if (val >= this.max) {
      this.$increment.prop('disabled', true);
      this.$decrement.prop('disabled', false);
    }
    else if (val <= this.min) {
      this.$increment.prop('disabled', false);
      this.$decrement.prop('disabled', true);
    }
    else {
      this.$increment.prop('disabled', false);
      this.$decrement.prop('disabled', false);
    }
  }

  _changeValue(newVal) {
    if (this.$input.is(':disabled') || typeof newVal === 'undefined') return;

    newVal = parseInt(newVal);

    // Don't change if the value is the same or invalid
    if (newVal === this.$input.val() || newVal > this.max || newVal < this.min) return;

    this.$input.val(newVal);
    this.$input.trigger('change');
  }

  _clampInputVal() {
    const currVal = parseInt(this.$input.val());
    const max = this.max;
    const min = this.min;

    if (currVal > max) {
      this.$input.val(max);
    }
    else if (currVal < min) {
      this.$input.val(min);
    }
  }

  getVal() {
    return parseInt(this.$input.val());
  }

  isMin() {
    return this.getVal() === this.min;
  }  

  isMax() {
    return this.getVal() === this.max;
  }

  getIncrementedValue() {
    let newValue;
    const currVal = this.getVal();

    switch (currVal) {
      case 0:
        newValue = 1;
        break;
      case 1:
        newValue = 2;
        break;
      case 2:
        newValue = 4;
        break;
      default:
        newValue = currVal;
    }

    return newValue;    
  }

  getDecrementedValue() {
    let newValue;
    const currVal = this.getVal();

    switch (currVal) {
      case 0:
      case 1:
        newValue = 0;
        break;
      case 2:
        newValue = 1;
        break;
      case 4:
        newValue = 2;
        break;
      default:
        newValue = currVal;        
    }

    return newValue;
  }

  onInputChange() {
    this._clampInputVal();
    this._updateDisabledState();
    this.$el.trigger($.Event(`change${this.namespace}`, { instance: this }));
  }

  onIncrementClick(e) {
    e.preventDefault();
    this._changeValue(this.getIncrementedValue());
  }

  onDecrementClick(e) {
    e.preventDefault();
    this._changeValue(this.getDecrementedValue());
  }

  static ensure(el) {
    let $el =  $(el);

    if (!$el.is(selectors.adjuster)) {
      $el = $el.parents(selectors.adjuster);
    }

    let data = $el.data(dataKey);

    if (!data) {
      $el.data(dataKey, (data = new QuantityAdjuster($el)));
    }

    return data;
  }

  static refresh($container) {
    $(selectors.adjuster, $container).each((i, el) => {
      QuantityAdjuster.ensure(el);
    });
  }
}

const shopifyEvents = [
  'shopify:section:unload',
  'shopify:section:select',
  'shopify:section:deselect',
  'shopify:section:reorder',
  'shopify:block:select',
  'shopify:block:deselect'
];

$(document).on(shopifyEvents.join(' '), QuantityAdjuster.refresh);

QuantityAdjuster.refresh();
