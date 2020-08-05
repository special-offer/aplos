import $ from 'jquery';
import Drawer from './drawer';
import CustomerForm from '../lib/customerForm';

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

    $('form', this.$el).each((i, form) => new CustomerForm(form));

    this.$el.on('click', selectors.showContents, this.onShowContentsClick.bind(this));
  }

  onShowContentsClick(e) {
    const idToShow = $(e.currentTarget).data('show-contents');

    this.$drawerBodies.filter(':visible').fadeOut(350, 'easeOutCubic', () => {
      $(idToShow).fadeIn(450, 'easeOutCubic');
    });
  }

  onHidden() {
    this.$drawerBodies.hide();
    this.$drawerBodies.first().show();

    super.onHidden();
  }
}

export default AccountDrawer;
