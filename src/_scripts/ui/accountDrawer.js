import $ from 'jquery';
import Drawer from './drawer';

const selectors = {
  showContents: '[data-show-contents]'
};

class AccountDrawer extends Drawer {
  /**
   * Account drawer constructor
   *
   * @param {HTML | jQuery} el
   */  
  constructor(el) {
    super(el);
    this.$drawerBodies = $('.drawer__body', this.$el);

    // Allow this drawer to be triggered anywhere in the app
    $('[data-account-drawer-trigger]').on('click', (e) => {
      e.preventDefault();
      this.show();
    });

    this.$el.on('click', selectors.showContents, this.onShowContentsClick.bind(this));
  }

  onShowContentsClick(e) {
    const idToShow = $(e.currentTarget).data('show-contents');

    this.$drawerBodies.filter(':visible').fadeOut(250, 'easeInOutCubic', () => {
      $(idToShow).fadeIn(400, 'easeInOutCubic');
    });
  }

  onHidden() {
    this.$drawerBodies.hide();
    this.$drawerBodies.first().show();

    super.onHidden();
  }
}

export default AccountDrawer;
