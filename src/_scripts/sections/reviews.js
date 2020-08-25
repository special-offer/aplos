import $ from 'jquery';
import BaseSection from './base';
import YotpoReviewsWidget from '../components/yotpoReviewsWidget';

const selectors = {
  yotpoReviewsWidget: '.yotpo-main-widget'
};

export default class ReviewsSection extends BaseSection {
  constructor(container) {
    super(container, 'reviews');

    this.widget = new YotpoReviewsWidget($(selectors.yotpoReviewsWidget, this.$container).first());
  }
}
