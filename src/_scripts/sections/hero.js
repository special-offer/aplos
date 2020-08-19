import $ from 'jquery';
import BaseSection from './base';
import AmbientVideo from '../components/ambientVideo';

const selectors = {
  ambientVideo: '[data-ambient-video]'
};

export default class HeroSection extends BaseSection {
  constructor(container) {
    super(container, 'hero');

    this.ambientVideo = new AmbientVideo($(selectors.ambientVideo, this.$container));
  }
}
