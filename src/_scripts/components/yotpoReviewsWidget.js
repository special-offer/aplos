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
        setTimeout(this.adjustWidget.bind(this), 3000); // wait a bit and hope that the widget has loaded by now
      }
    }
    else {
      this.adjustWidget();
    }
  }

  adjustWidget(e) {
    const $mainWidget = $('.main-widget', this.$el);

    if (this.adjusted || $mainWidget.length !== 1) return;

    const $writeReviewWrapper = $('.write-review-wrapper', this.$el);
    const $messages = $('.yotpo-messages', this.$el);

    // Create a footer for the form
    const $footer = $(document.createElement('div')).addClass('main-widget-footer');

    $footer.appendTo($mainWidget);

    $('.yotpo-helpful .label-helpful', this.$el).text('Was this helpful?');

    // Change 'Username' -> 'Name'
    $('label[for="yotpo_input_review_username"]', this.$el).contents().filter((i, el) => el.nodeName === '#text').replaceWith(document.createTextNode('Name: '));

    // Move the feedback form to the bottom of the page
    $writeReviewWrapper.detach().insertBefore($footer);

    // Move the 'messsages' section to the above the write form
    $messages.detach().insertBefore($writeReviewWrapper);

    // Leave Feedback button
    const $writeReviewButton = $('.write-review-button', this.$el).first();

    $writeReviewButton.find('.yotpo-icon-button-text').text('Leave Feedback');
    $writeReviewButton.detach().appendTo($footer); // put it in the footer

    // Update the "write review" heading
    $('.write-review .yotpo-header-title').text('Leave Feedback');

    // Update the submit review button
    $('.write-review .submit-button .yotpo-submit').val('Submit Feedback');

    // Cleanup now that we're done making adjustments
    this.observer && this.observer.disconnect();
    this.adjusted = true;
    this.$el.addClass('is-ready');
  }
}
