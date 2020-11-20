import $ from 'jquery';
import BaseSection from './base';
import BlogArticleGrid from '../components/blogArticleGrid';

const selectors = {
  contentGrid: '.content-grid',
  contentGridItem: '.content-grid__item',
  pagination: '[data-pagination]',
  nextPageLink: '[data-next-page]'
};

export default class BlogSection extends BaseSection {
  constructor(container) {
    super(container, 'blog');

    this.blogArticleGrid = new BlogArticleGrid($('.content-grid', this.$container), this.$container.data('base-url'));

    this.$container.on('click', selectors.nextPageLink, this.onNextPageLinkClick.bind(this));
  }

  onNextPageLinkClick(e) {
    e.preventDefault();
    
    const $link = $(e.currentTarget);
    const url   = $link.attr('href');

    $.ajax({
      url,
      beforeSend() {
        $link.html(theme.strings.loading || 'Loading');
      }
    })
      .done((data) => {
        const $dom = $(data);
        const $contentItems = $(selectors.contentGridItem, $dom);
        const $newNextPageLink = $(selectors.nextPageLink, $dom);

        $(selectors.contentGrid, this.$container).append($contentItems);

        if ($newNextPageLink.length) {
          $link.replaceWith($newNextPageLink);
        }
        else {
          $(selectors.pagination, this.$container).remove();
        }
      });
  }
}
