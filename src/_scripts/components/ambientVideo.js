import $ from 'jquery';

const classes = {
  playing: 'is-playing'
};

export default class AmbientVideo {
  constructor(video) {
    this.$video = $(video);

    if (this.$video.length === 0) return;

    this.$video.one('play', () => this.$video.addClass(classes.playing));

    // In case autoplay doesn't work
    setTimeout(() => {
      const p = this.$video.get(0).play(); // in case autoplay didn't work
      p && p.catch(e => console.log(e)); // eslint-disable-line
    }, 1000);
  }
}
