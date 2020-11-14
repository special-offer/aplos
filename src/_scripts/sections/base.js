import $ from 'jquery';
import AplosBlock from '../components/aplosBlock';
import AmbientVideo from '../components/ambientVideo';

const selectors = {
  aplosBlock: '.aplos-block',
  pageHero: '.page-hero',
  ambientVideo: '[data-ambient-video]'
};

export default class BaseSection {
  constructor(container, name) {
    this.$container = container instanceof $ ? container : $(container);
    this.id = this.$container.data('section-id');
    this.type = this.$container.data('section-type');
    this.name = name;
    this.namespace = `.${this.name}`;

    this.events = {
      SCROLL: `scroll${this.namespace}`,
      CLICK:  `click${this.namespace}`,
      RESIZE: `resize${this.namespace}`,
      MOUSEENTER: `mouseenter${this.namespace}`,
      MOUSELEAVE: `mouseleave${this.namespace}`
    };

    this.aplosBlocks = $.map($(selectors.aplosBlock, this.$container), el => new AplosBlock(el));
    this.ambientVideos = $.map($(selectors.pageHero, this.$container).find(selectors.ambientVideo), el => new AmbientVideo(el, true)); // Find any videos in the page hero
  }

  onUnload(e) {
    
  }

  onSelect(e) {
    
  }

  onDeselect(e) {

  }

  onReorder(e) {

  }

  onBlockSelect(e) {

  }

  onBlockDeselect(e) {

  }
}
