import $ from 'jquery';
import BaseSection from './base';

export default class HeroSection extends BaseSection {
  constructor(container) {
    super(container, 'hero');

    const $video = $('video', this.$container);

    $video.one('play', () => $video.addClass('is-playing'));    
  }
}
