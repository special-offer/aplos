import $ from 'jquery';
import { whichTransitionEnd } from '../core/utils';

const $document = $(document);
const $body = $(document.body);

const selectors = {
  close: '[data-drawer-close]',
  overflow: '.drawer-overflow'
};

const classes = {
  drawer: 'drawer',
  visible: 'is-visible',
  backdrop: 'drawer-backdrop',
  backdropVisible: 'is-visible',
  bodyDrawerOpen: 'drawer-open'
};

export default class Drawer {
  /**
   * Drawer constructor
   *
   * @param {HTMLElement | $} el - The drawer element
   */
  constructor(el) {
    this.name = 'drawer';
    this.namespace = `.${this.name}`;

    this.$el = $(el);
    this.$overflow = $(selectors.overflow, this.$el);
    this.$backdrop = null;

    this.stateIsOpen            = false;
    this.transitionEndEvent     = whichTransitionEnd();
    this.supportsCssTransitions = !!Modernizr.csstransitions;
    this.bodyShiftClass = `drawer-shift--${this.$el.hasClass('drawer--left') ? 'left' : 'right'}`;

    if (this.$el === undefined || !this.$el.hasClass(classes.drawer)) {
      console.warn(`[${this.name}] - Element with class ${classes.drawer} required to initialize.`);
      return;
    }

    this.events = {
      HIDE:   'hide'   + this.namespace,
      HIDDEN: 'hidden' + this.namespace,
      SHOW:   'show'   + this.namespace,
      SHOWN:  'shown'  + this.namespace
    };

    this.$el.on('click', selectors.close, this.onCloseClick.bind(this));
  }

  destroy() {
    this.$backdrop && this.$backdrop.remove();
  }

  addBackdrop(callback = () => {}) {
    if (this.stateIsOpen) {
      this.$backdrop = $(document.createElement('div'));

      this.$backdrop.addClass(classes.backdrop).appendTo($body);

      this.$backdrop.one(this.transitionEndEvent, callback);
      this.$backdrop.one('click', this.hide.bind(this));

      // debug this...
      setTimeout(() => {
        $body.addClass(classes.bodyDrawerOpen);
        this.$backdrop.addClass(classes.backdropVisible);
      }, 10);
    }
    else {
      callback();
    }
  }

  removeBackdrop(callback = () => {}) {
    if (this.$backdrop) {
      this.$backdrop.one(this.transitionEndEvent, () => {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
        callback();
      });

      setTimeout(() => {
        this.$backdrop.removeClass(classes.backdropVisible);
        $body.removeClass(classes.bodyDrawerOpen);
      }, 10);
    }
    else {
      callback();
    }
  }
  
  /**
   * Called after the closing animation has run
   */    
  onHidden() {
    this.$overflow.scrollTop(0);
    this.stateIsOpen = false;
    const e = $.Event(this.events.HIDDEN);
    this.$el.trigger(e);
  }

  /**
   * Called after the opening animation has run
   */
  onShown() {
    const e = $.Event(this.events.SHOWN);
    this.$el.trigger(e);
  }

  show() {
    const e = $.Event(this.events.SHOW);
    this.$el.trigger(e);

    if (this.stateIsOpen) return;

    this.stateIsOpen = true;

    this.$el.addClass(classes.visible);
    $body.addClass(this.bodyShiftClass);

    this.addBackdrop();

    if (this.supportsCssTransitions) {
      this.$el.one(this.transitionEndEvent, this.onShown.bind(this));
    }
    else {
      this.onShown();
    }
  }  

  hide() {
    const e = $.Event(this.events.HIDE);
    this.$el.trigger(e);

    if (!this.stateIsOpen) return;

    this.$el.removeClass(classes.visible);
    $body.removeClass(this.bodyShiftClass);

    this.removeBackdrop();

    if (this.supportsCssTransitions) {
      this.$el.one(this.transitionEndEvent, this.onHidden.bind(this));
    }
    else {
      this.onHidden();
    }
  }

  toggle() {
    return this.stateIsOpen ? this.hide() : this.show();
  }

  onCloseClick(e) {
    e.preventDefault();
    this.hide();
  }
}

// Data API
$document.on('click.drawer', '[data-toggle="drawer"]', function(e) {
  const $this   = $(this);
  const $target = $($this.attr('data-target'));
  let data      = $this.data('drawer');

  if ($this.is('a')) e.preventDefault();

  if (!data) {
    $this.data('drawer', (data = new Drawer($target)));
    data.show();
  }
  else {
    data.toggle();
  }
});
