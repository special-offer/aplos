import $ from 'jquery';

export default class YotpoReviewsWidget {
  /**
   * YotpoReviewsWidget
   *
   * @param {HTMLElement | jQuery} el - main widget element
   */  
  constructor(el) {
    this.$el = $(el);

    if (!this.$el || this.$el.length !== 1) {
      console.log('double check yotpo review widget constructor'); // eslint-disable-line
      return;
    }

    this.adjusted = false; // flag to prevent running 'this.adjustWidget' multiple times
    this.observer = null;

    const observerConfig = { childList: true };

    if (this.$el.children().length === 0) {
      if (window.MutationObserver) {
        this.observer = new MutationObserver(this.adjustWidget.bind(this));
        this.observer.observe(this.$el.get(0), observerConfig);
      }
      else {
        // setTimeout
        // @TODO - Add settimeout?
      }
    }
    else {
      this.adjustWidget();
    }
  }

  adjustWidget(e) {
    const $mainWidget = $('.main-widget', this.$el);

    if (this.adjusted || $mainWidget.length !== 1) return;

    $('.yotpo-helpful .label-helpful', this.$el).text('Was this helpful?');

    $('label[for="yotpo_input_review_username"]', this.$el).contents().filter((i, el) => el.nodeName === '#text').replaceWith(document.createTextNode('Name: '));

    // Feedback button
    const $writeReviewButton = $('.write-review-button', this.$el).first();

    $writeReviewButton.find('.yotpo-icon-button-text').text('Leave Feedback');
    $writeReviewButton.detach().appendTo($mainWidget); // put it at the bottom of the widget

    // Nicer widget title
    const header = document.createElement('h3');
    
    header.innerText = 'Feedback';

    $('.yotpo-bottomline-2-boxes', this.$el).prepend(header);

    // Cleanup now that we're done making adjustments
    this.observer && this.observer.disconnect();
    this.adjusted = true;
    this.$el.addClass('is-ready');
  }
}
