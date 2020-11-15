// jQuery
import $ from 'jquery';
import 'jquery-unveil';
import { throttle } from 'throttle-debounce';

// Bootstrap JS
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal';

// Core
import {
  userAgentBodyClass,
  cookiesEnabled,
  getQueryParams
} from './core/utils';
import {
  wrapTables,
  wrapIframe
} from './core/rte';
import { pageLinkFocus } from './core/a11y';
import * as Animations  from './core/animations';
import * as Breakpoints from './core/breakpoints';

// Components
import './components/quantityAdjuster'; // Needs to be imported to enable data API
import AccountDrawer from './components/accountDrawer'; // This exists outside of any section

// Sections
import SectionManager                from './sections/sectionManager';
import HeaderSection                 from './sections/header';
import FooterSection                 from './sections/footer';
import MobileMenuSection             from './sections/mobileMenu';
import ProductSection                from './sections/product';
import ProductExtendedSection        from './sections/productExtended';
import AJAXCartSection               from './sections/ajaxCart';
import CollectionSection             from './sections/collection';
import BlogSection                   from './sections/blog';
import ArticleSection                from './sections/article';
import TestimonialsSection           from './sections/testimonials';
import HelpQuestionsSection          from './sections/helpQuestions';
import PagePhilosophySection         from './sections/pagePhilosophy';
import ProductPromotionSection       from './sections/productPromotion';
import ShowcaseSection               from './sections/showcase';
import AplosRowSection               from './sections/aplosRow';
import HeroSection                   from './sections/hero';
import ReviewsSection                from './sections/reviews';
import CustomersLoginSection         from './sections/customersLogin';
import CustomersAccountSection       from './sections/customersAccount';
import CustomersAccountOrdersSection from './sections/customersAccountOrders';
import CustomersAddressesSection     from './sections/customersAddresses';
import CustomersOrderSection         from './sections/customersOrder';

// Templates
import './templates/pageStyles';
import './templates/pageComponents';

// Do this ASAP
Animations.initialize();
Breakpoints.initialize();

((Modernizr) => {
  const $document = $(document);
  const $body = $(document.body);
  const queryParams = getQueryParams();

  const sectionManager = new SectionManager();

  sectionManager.register('header', HeaderSection);
  sectionManager.register('footer', FooterSection);
  sectionManager.register('mobile-menu', MobileMenuSection);
  sectionManager.register('product', ProductSection);
  sectionManager.register('product-extended', ProductExtendedSection);
  sectionManager.register('ajax-cart', AJAXCartSection);
  sectionManager.register('collection', CollectionSection);
  sectionManager.register('blog', BlogSection);
  sectionManager.register('article', ArticleSection);
  sectionManager.register('testimonials', TestimonialsSection);
  sectionManager.register('help-questions', HelpQuestionsSection);
  sectionManager.register('page-philosophy', PagePhilosophySection);
  sectionManager.register('product-promotion', ProductPromotionSection);
  sectionManager.register('showcase', ShowcaseSection);
  sectionManager.register('aplos-row', AplosRowSection);
  sectionManager.register('hero', HeroSection);
  sectionManager.register('reviews', ReviewsSection);
  sectionManager.register('customers-login', CustomersLoginSection);
  sectionManager.register('customers-account', CustomersAccountSection);
  sectionManager.register('customers-account-orders', CustomersAccountOrdersSection);
  sectionManager.register('customers-addresses', CustomersAddressesSection);
  sectionManager.register('customers-order', CustomersOrderSection);

  $('.in-page-link').on('click', evt => pageLinkFocus($(evt.currentTarget.hash)));

  // Common a11y fixes
  pageLinkFocus($(window.location.hash));

  // Target tables to make them scrollable
  wrapTables({
    $tables: $('.rte table'),
    tableWrapperClass: 'table-responsive'
  });

  // Target iframes to make them responsive
  const iframeSelectors = '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]';

  wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply UA classes to the document
  userAgentBodyClass();

  // Apply a specific class to the html element for browser support of cookies.
  if (cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  // Inner page links get animated scroll to
  $('[data-page-nav]').on('click', (e) => {
    const $scrollTo = $(e.currentTarget.getAttribute('href'));

    if ($scrollTo.length === 0) return;

    e.preventDefault();

    const scrollTop = $scrollTo.offset().top - 120;

    $('html, body').animate({ scrollTop }, 500, 'easeInOutQuart');
  });

  // Form event handling / validation
  $body.on('change keydown', '.form-control', (e) => {
    $(e.currentTarget).removeClass('is-invalid');
  });

  // START - Global handler for collapse plugin to add state class for open expandable lists
  const isOpenClass = 'is-open';

  $document.on('show.bs.collapse', '.collapse', (e) => {
    $(e.currentTarget).parents('.expandable-list').addClass(isOpenClass);
  });

  $document.on('hide.bs.collapse', '.collapse', (e) => {
    $(e.currentTarget).parents('.expandable-list').removeClass(isOpenClass);
  });

  $('.collapse.show').each(function() {
    $(this).parents('.expandable-list').addClass(isOpenClass);
  });
  // END - Global handler for collapse plugin to add state class for open expandable lists

  const setViewportHeightProperty = () => {
    // If mobile / tablet, set var to window height. This fixes the 100vh iOS bug/feature.
    const v = window.innerWidth <= 1024 ? `${window.innerHeight}px` : '100vh';
    document.documentElement.style.setProperty('--viewport-height', v);
  };
  
  window.addEventListener('resize', throttle(100, setViewportHeightProperty));
  document.addEventListener('scroll', throttle(100, () => {
    if (window.innerWidth > 1024) return;
    setViewportHeightProperty();
  }));

  setViewportHeightProperty();     

  if ($('#account-drawer').length) {
    const aD = new AccountDrawer($('#account-drawer').first());

    // If redirected from an account page, show the drawer
    if (queryParams.login || queryParams.register || queryParams.recover) {
      aD.show();
    }
  }

  // Add "development mode" class for CSS hook
  // if (window.location.hostname === 'localhost') {
  $body.addClass('development-mode');
  // }
})(Modernizr);
