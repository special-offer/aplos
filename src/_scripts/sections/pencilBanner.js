// import $ from 'jquery';
// import { isThemeEditor } from '../core/utils';
import BaseSection from './base';

const selectors = {
  close: '[data-pencil-banner-close]'
};

export default class PencilBannerSection extends BaseSection {
  constructor(container) {
    super(container, 'pencilBanner');

    this.$container.on('click', selectors.close, this.onCloseClick.bind(this));
  }

  onCloseClick(e) {
    e.preventDefault();

    // if (isThemeEditor()) return;
  }
}
