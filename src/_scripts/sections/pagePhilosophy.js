import $ from 'jquery';
import Handlebars from 'handlebars';
import { shuffle } from '../core/utils';
import BaseSection from './base';

const selectors = {
  philosophiesJSON: '#philosophies-json',
  slotTemplate: '[data-slot-template]'
}

export default class PagePhilosophySection extends BaseSection {
  constructor(container) {
    super(container, 'page-philosophy');

    const $slotTemplateRaw = $(selectors.slotTemplate, this.$container);
    const slotTemplate = Handlebars.compile($slotTemplateRaw.html());
    const json = JSON.parse($(selectors.philosophiesJSON).first().html());
    const philosophies = json && json.philosophies;

    if (philosophies.length) {
      shuffle(philosophies);

      let textBlockCount = 0;
      $.each(this.aplosBlocks, (i, block) => {
        if (block.type === 'text') {
          if (philosophies[textBlockCount]) {
            const data = {
              heading: philosophies[textBlockCount].heading,
              title: philosophies[textBlockCount].title,
              light_text: !!block.hasBackgroundMedia()
            };
            block.$content.append(slotTemplate(data));
          }

          textBlockCount++;
        }
      });      
    }
  }
}
