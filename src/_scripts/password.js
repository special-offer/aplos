import $ from 'jquery';
import { userAgentBodyClass } from './core/utils';
import SectionManager from './sections/sectionManager';
import PasswordSection from './sections/password';

((Modernizr) => {
  const $body = $(document.body);
  const sectionManager = new SectionManager();

  sectionManager.register('password', PasswordSection);

  userAgentBodyClass(); // Apply UA classes to the document

  $body.removeClass('is-loading').addClass('is-loaded');
})(Modernizr);
