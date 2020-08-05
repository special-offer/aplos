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
    const $cardDetail = $card.find('.help-card__detail');

    if ($card.hasClass(classes.helpCardExpanded)) {
      $cardReveal.slideUp({
        duration: 400,
        easing: 'easeInOutCubic',
        start: () => $cardDetail.fadeTo(300, 0, 'easeOutCubic'),
        progress: () => this.masonry && this.masonry.layout(),
        done: () => $card.removeClass(classes.helpCardExpanded),
      });
    }
    else {      
      $cardReveal.slideDown({
        duration: 650,
        easing: 'easeOutQuint',
        start: () => setTimeout(() => {
          $cardDetail.fadeTo(500, 1, 'easeOutCubic');
        }, 150),
        progress: () => this.masonry && this.masonry.layout(),
        done: () => $card.addClass(classes.helpCardExpanded),
      });
    }
  }
}
