import $ from 'jquery';

import * as Animations  from './core/animations';
import * as Breakpoints from './core/breakpoints';

// Sections
import SectionManager  from './sections/sectionManager';
import PasswordSection from './sections/password';

// Do this ASAP
Animations.initialize();
Breakpoints.initialize();

((Modernizr) => {
  const $body = $(document.body);
  const sectionManager = new SectionManager();

  sectionManager.register('password', PasswordSection);

  setTimeout(() => {
    $body.removeClass('is-loading').addClass('is-loaded');
  }, 500);

  // Add "development mode" class for CSS hook
  if (window.location.hostname === 'localhost') {
    document.body.classList.add('development-mode');
  }
})(Modernizr);
