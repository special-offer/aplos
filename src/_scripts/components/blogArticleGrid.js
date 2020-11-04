import $ from 'jquery';
import { throttle } from 'throttle-debounce';

const classes = {
  gridHasExpandedItem: 'has-expanded-item',
  itemIsExpanded: 'is-expanded',
  trayIsAnimating: 'is-animating',
  itemIsAnimating: 'is-animating'
};

const TRANSITION_DURATION = 750;

class ArticleGridItem {
  constructor(el, options) {
    const defaults = {
      onOpen: () => {},
      onOpened: () => {},
      onClose: () => {},
      onClosed: () => {}
    };

    this.settings = $.extend({}, defaults, options);

    this.$el = $(el);
    this.$contents = this.$el.find('.article-card__contents');
    this.$tray = this.$el.find('.article-tray');
    this.$trayContents = this.$el.find('.article-tray__contents');
    this.isOpen = false;

    this.$el.on('click', '[data-close]', this.onCloseClick.bind(this));
  }

  setOpenDimensions() {
    if (!this.isOpen) {
      return;
    }

    const contentsNaturalHeight = this.$contents.outerHeight(true);
    const trayContentsNaturalHeight = this.$trayContents.outerHeight(true);

    this.$el.height(contentsNaturalHeight + trayContentsNaturalHeight);
    this.$tray.height(trayContentsNaturalHeight);    
  }

  open() {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.openAnimation();
    this.settings.onOpen(this);
  }

  close() {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.closeAnimation();
    this.settings.onClose();
  }

  openAnimation() {
    this.$el.height(this.$contents.outerHeight(true));
    this.$tray.height(0);
    
    this.$tray.addClass(classes.trayIsAnimating);
    this.$el.addClass(classes.itemIsAnimating);
    this.$el.addClass(classes.itemIsExpanded);

    this.$tray.offset().left; // eslint-disable-line

    this.setOpenDimensions();

    setTimeout(() => {
      this.$tray.removeClass(classes.trayIsAnimating);
      this.$el.removeClass(classes.itemIsAnimating);
      this.settings.onOpened();
    }, TRANSITION_DURATION);    
  }

  closeAnimation() {
    this.$tray.addClass(classes.trayIsAnimating);
    this.$el.addClass(classes.itemIsAnimating);
    this.$el.removeClass(classes.itemIsExpanded);

    this.$el.height(this.$contents.outerHeight(true));
    this.$tray.height(0);

    setTimeout(() => {
      this.$tray.removeClass(classes.trayIsAnimating);
      this.$el.removeClass(classes.itemIsAnimating);
      this.$el.height('');
      this.settings.onClosed();
    }, TRANSITION_DURATION); 
  }

  onCloseClick(e) {
    e.preventDefault();
    this.close();
  }
}

export default class BlogArticleGrid {
  constructor(el) {
    this.name = 'blogArticleGrid';
    this.namespace = `.${this.name}`;

    this.$el = $(el);

    this.transitionInProgress = false;
    this.items = {};

    // Add grid items to items obj with handle as the key
    this.$el.find('.article-card').each((i, elm) => {
      this.items[$(elm).data('handle')] = new ArticleGridItem(elm, {
        onOpen: this.onItemOpen.bind(this),
        onOpened: this.onItemOpened.bind(this),
        onClose: this.onItemClose.bind(this),
        onClosed: this.onItemClosed.bind(this)
      });
    });

    this.$el.on('click', '.article-card__contents', this.onArticleCardContentsClick.bind(this));

    $(window).on('resize', throttle(150, this.onResize.bind(this)));
  }

  getOpenItem() {
    let openItem = null;
    
    $.each(this.items, (key, item) => {
      if (item.isOpen) {
        openItem = item;
        return false; // break $.each
      }

      return true;
    });

    return openItem;
  }

  closeOpenItems(cb) {
    const openItem = this.getOpenItem();

    if (openItem === null) {
      cb && cb();
    }
    else {
      openItem.close();
      setTimeout(() => {
        cb && cb();
      }, TRANSITION_DURATION);
    }
  }

  onArticleCardContentsClick(e) {
    e.preventDefault();

    const $card = $(e.currentTarget).parent('.article-card[data-handle]');
    const item = this.items[$card.data('handle')];

    if (!item || this.transitionInProgress) {
      return;
    }

    if (item.isOpen) {
      item.close();
    }
    else {
      // Close any open items and *then* open the item
      this.closeOpenItems(item.open.bind(item));
    }
  }

  onItemOpen(gridItem) {
    this.$el.addClass(classes.gridHasExpandedItem);
    this.transitionInProgress = true;

    const offset = gridItem.$trayContents.offset().top - (window.innerHeight * 0.15);

    $('html, body').animate({
      scrollTop: offset
    }, 800, 'easeInOutCubic');
  }

  onItemOpened() {
    this.transitionInProgress = false;
  }

  onItemClose() {
    this.$el.removeClass(classes.gridHasExpandedItem);
    this.transitionInProgress = true;
  }

  onItemClosed() {
    this.transitionInProgress = false;
  }

  onResize() {
    const openItem = this.getOpenItem();

    if (openItem) {
      openItem.setOpenDimensions();
    }
  }
}
