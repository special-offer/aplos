import $ from 'jquery';
import AmbientVideo from './ambientVideo';

const selectors = {
  ambientVideo: '[data-ambient-video]'
};

const classes = {
  ready: 'is-ready'
};

export default class AplosBlock {
  constructor(el) {
    this.name = 'aplosBlock';
    this.namespace = `.${this.name}`;

    this.$el = $(el);
    this.type = this.$el.data('type');
    this.$content = this.$el.find('.aplos-block__content');
    this.$backgroundImage = this.$el.find('.aplos-block__bg img');

    // Lazy load in all the images in the block
    $('[data-src]', this.$el).each((i, img) => {
      const $img = $(img);
      $img.on('load', () => $img.attr('data-src', null));
      $img.attr('src', $img.data('src'));
    });

    if ($(selectors.ambientVideo, this.$el).length > 0) {
      this.ambientVideo = new AmbientVideo($(selectors.ambientVideo, this.$el).first());
    }

    this.$el.addClass(classes.ready);
  }

  hasBackgroundMedia() {
    return this.$backgroundImage.length > 0 || !!this.ambientVideo;
  }
}
