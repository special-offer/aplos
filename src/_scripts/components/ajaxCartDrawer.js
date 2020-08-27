import $ from 'jquery';
import Handlebars from 'handlebars';
import CartAPI from '../core/cartAPI';
import QuantityAdjuster from './quantityAdjuster';
import Drawer from './drawer';

const selectors = {
  trigger: '[data-ajax-cart-trigger]',
  bodyTemplate: 'script[data-ajax-cart-body-template]',
  body: '[data-ajax-cart-body]',
  item: '[data-ajax-item][data-key][data-qty]',
  itemQuantityInput: 'input[type="number"]',
  quantityAdjuster: '[data-quantity-adjuster]',
  total: '[data-ajax-cart-total]'
};

const classes = {
  cartIsEmpty: 'is-empty',
  cartHasSingleItem: 'has-single-item',
  lockUI: 'lock-ui'
};

const $window = $(window);
const $body = $(document.body);

const events = {
  RENDER:  'render.ajaxCartDrawer'
};

class AJAXCartDrawer extends Drawer {
  static events = events; // Expose events for the rest of the app to use - @TODO is there a way to merge events with parent class?

  /**
   * AJAXCartDrawer constructor
   *
   * @param {HTML | jQuery} el
   * @param {Object} templateData - Merged with the cart object when rendering the handlebars template
   */  
  constructor(el, templateData = {}) {
    super(el);

    this.templateData         = templateData; // I don't think we need this, leaving it here for now just in case
    this.hasBeenRendered      = false; // Lock to prevent displaying the cart before anything has been rendered
    this.qaInteractionTimeout = null;
    this.qaInteractionDelay   = 200; // Delay before triggering the quantityadjuster change event (allows user to increment / decrement quickly)    

    this.$body         = $(selectors.body, this.$el);
    this.$bodyTemplate = $(selectors.bodyTemplate);
    this.$total        = $(selectors.total, this.$el);

    if (!this.$bodyTemplate.length) {
      console.warn(`[${this.name}] - Handlebars template required to initialize`);
      return;
    }

    // Compile this once during initialization
    this.bodyTemplate      = Handlebars.compile(this.$bodyTemplate.html());

    // Events + Callbacks
    this.onTriggerClick = this.onTriggerClick.bind(this);
    this.onRender = this.onRender.bind(this);

    this.$el.on('change.quantityAdjuster', this.onQuantityAdjusterChange.bind(this));
    $body.on('click', selectors.trigger, this.onTriggerClick);
    $window.on(events.RENDER, this.onRender);
  }

  /**
   * Clean up any event listeners added to elements outside of this.$el
   */
  destroy() {
    super.destroy();
    $body.off('click', selectors.trigger, this.onTriggerClick);
    $window.off(events.RENDER, this.onRender);    
  }

  /**
   * Ensure we are working with a valid number
   *
   * @param {int|string} qty
   * @return {int} - Integer quantity.  Defaults to 1
   */
  validateQty(qty) {
    return (parseFloat(qty) === parseInt(qty)) && !Number.isNaN(qty) ? qty : 1;
  }

  /**
   * Get data about the cart line item row
   *
   * @param {element} el - cart line item row or child element
   * @return {obj}
   */
  getItemRowAttributes(el) {
    const $el = $(el);
    const $row = $el.is(selectors.item) ? $el : $el.parents(selectors.item);

    return {
      $row: $row,
      key: $row.data('key'),
      line: $row.index() + 1,
      qty: this.validateQty($row.data('qty'))
    };
  }

  /**
   * Add a class to lock the cart UI from being interacted with
   *
   * @return this
   */
  lockUI() {
    this.$el.addClass(classes.lockUI);
    return this;
  }

  /**
   * Removes a class to unlock the cart UI
   *
   * @return this
   */
  unlockUI() {
    this.$el.removeClass(classes.lockUI);
    return this;
  }

  /**
   * Builds the HTML for the ajax cart and inserts it into the container element
   *
   * @param {object} cart - JSON representation of the cart.  See https://help.shopify.com/themes/development/getting-started/using-ajax-api#get-cart
   * @param {string} slot - specific slot to re-render, otherwise the entire cart will be re-rendered
   * @return this
   */
  render(cart, slot) {
    const templateData = $.extend(this.templateData, cart);

    // If cart.item_count == 0 we don't need to do anything.  this.onRender will trigger the empty state for us

    if (cart.item_count > 0) {
      if (slot === 'body') {
        this.$body.empty().append(this.bodyTemplate(templateData));
      }
      else if (slot === 'total') {
        this.$total.html(cart.total_price);
      }
      else {
        this.$body.empty().append(this.bodyTemplate(templateData));
        this.$total.html(cart.total_price);
      }
    }

    $window.trigger($.Event(events.RENDER, { cart }));

    return this;
  }

  /**
   * Callback when changing a cart quantity is successful
   *
   * @param {Object} cart - JSON representation of the cart.
   */
  onChangeSuccess(cart) {
    this.render(cart).show();
  }

  /**
   * STUB - Callback when changing a cart quantity fails
   *
   * @param {Object} data
   * @param {String} data.message - error message
   */
  onChangeFail(data) {
    console.warn(`[${this.name}] - onChangeFail`);
    console.warn(`[${this.name}] - ${data.message}`);
  }

  /**
   * Callback for when the cart HTML is rendered to the page
   * Allows us to add event handlers for events that don't bubble
   */
  onRender(e) {
    // cart.item_count != cart.items.length
    // item_count is line items * quantity for each
    if (e.cart) {
      this.$el.toggleClass(classes.cartIsEmpty, e.cart.item_count === 0);
      this.$el.toggleClass(classes.cartHasSingleItem, e.cart.items.length <= 1); // It's okay for 1 *or* 0
    }

    QuantityAdjuster.refresh(this.$el);

    this.unlockUI();
    this.hasBeenRendered = true;
  }  

  /**
   * Triggered when someone changes the value of the quantity input through the quantity adjuster
   * Event is triggered by the qa instance *on* the qa element.  The instance is passed as a property on the event
   *
   * @param {event} e - Change event
   * @param {QuantityAdjuster} e.instance
   */
  onQuantityAdjusterChange(e) {
    const instance = e.instance;

    if (!instance) return;
    
    const $qa = instance.$el;
    const attrs = this.getItemRowAttributes($qa);
    const qty = instance.getVal();

    let d = this.qaInteractionDelay;

    // If we hit the max or min on the input, trigger the quantity update request immediately;
    if (instance.isMax() || instance.isMin()) {
      d = 0;
    }

    clearTimeout(this.qaInteractionTimeout);

    this.qaInteractionTimeout = setTimeout(() => {
      this.lockUI();

      CartAPI.changeLineItemQuantityByKey(attrs.key, qty).then((cart) => {
        this.render(cart);
      })
        .fail(() => {
          console.warn('something went wrong...');
        })
        .always(() => {
          this.unlockUI();
        });
    }, d);
  }  

  /**
   * Click the 'ajaxCart - trigger' selector
   *
   * @param {event} e - Click event
   */
  onTriggerClick(e) {
    e.preventDefault();
    
    // If we haven't rendered the cart yet, don't show it
    if (!this.hasBeenRendered) {
      return;
    }

    this.toggle();
  }
}

export default AJAXCartDrawer;
