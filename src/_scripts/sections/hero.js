import $ from 'jquery';
import BaseSection from './base';
import AmbientVideo from '../components/ambientVideo';

const selectors = {
  ambientVideo: '[data-ambient-video]'
};

const classes = {
  ready: 'is-ready'
};

export default class HeroSection extends BaseSection {
  constructor(container) {
    super(container, 'hero');

    this.$hero = $('.hero', this.$container);

    this.ambientVideo = new AmbientVideo($(selectors.ambientVideo, this.$container));

    this.$hero.addClass(classes.ready);
  }
}
