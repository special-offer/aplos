import $ from 'jquery';
import Masonry from 'masonry-layout';
import BaseSection from './base';

const selectors = {
  helpCard: '[data-help-card]'
};

const classes = {
  helpCardExpanded: 'is-expanded'
};

export default class HelpQuestionsSection extends BaseSection {
  constructor(container) {
    super(container, 'help-questions');

    const $grid = $('.help-card-grid', this.$container);

    this.masonry = null;

    if ($grid.length) {
      this.masonry = new Masonry($grid.get(0), {
        itemSelector: '.help-card-grid__item',
        percentPosition: true,
        horizontalOrder: true,
        transitionDuration: 0
      });
    }

    this.$container.on('click', selectors.helpCard, this.onHelpCardClick.bind(this));
  }

  onHelpCardClick(e) {
    const $card = $(e.currentTarget);
    const $cardReveal = $card.find('.help-card__reveal');

    if ($card.hasClass(classes.helpCardExpanded)) {
      $cardReveal.slideUp({
        duration: 350,
        start: () => $cardReveal.fadeTo(100, 0),
        progress: () => this.masonry && this.masonry.layout(),
        done: () => $card.removeClass(classes.helpCardExpanded),
      });
    }
    else {      
      $cardReveal.slideDown({
        duration: 350,
        start: () => $cardReveal.fadeTo(180, 1),
        progress: () => this.masonry && this.masonry.layout(),
        done: () => $card.addClass(classes.helpCardExpanded),
      });
    }
  }
}
