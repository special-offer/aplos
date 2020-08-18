import $ from 'jquery';

const classes = {
  videoLoaded: 'is-loaded'
};

export default class AplosBlock {
  constructor(el) {
    this.name = 'aplosBlock';
    this.namespace = `.${this.name}`;

    this.$el = $(el);
    this.type = this.$el.data('type');
    this.$content = this.$el.find('.aplos-block__content');
    this.$backgroundImage = this.$el.find('.aplos-block__bg img');
    this.$backgroundVideo = this.$el.find('.aplos-block__bg video');

    // Lazy load in all the images in the block
    $('[data-src]', this.$el).each((i, img) => {
      const $img = $(img);
      $img.on('load', () => $img.attr('data-src', null));
      $img.attr('src', $img.data('src'));
    });

    this.$backgroundVideo.one('loadeddata play', () => {
      this.$backgroundVideo.addClass(classes.videoLoaded);
      const p = this.$backgroundVideo.get(0).play(); // in case autoplay didn't work

      p && p.catch(e => console.log(e));
    });
  }

  hasBackgroundMedia() {
    return this.$backgroundImage.length > 0 || this.$backgroundVideo.length > 0;
  }
}
