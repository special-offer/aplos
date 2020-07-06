import $ from 'jquery';
import Masonry from 'masonry-layout';
import BaseSection from './base';

export default class HelpQuestionsSection extends BaseSection {
  constructor(container) {
    super(container, 'help-questions');

    const $grid = $('.help-card-grid', this.$container);

    if ($grid.length) {
      new Masonry($grid.get(0), {
        itemSelector: '.help-card-grid__item',
        percentPosition: true,
        horizontalOrder: true,
        transitionDuration: 0
      });
    }
  }
}
