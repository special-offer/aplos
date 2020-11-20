import $ from 'jquery';

const classes = {
  playing: 'is-playing'
};

export default class AmbientVideo {
  constructor($video, clickable = false) {
    this.$video = $($video);
    this.video = this.$video.get(0); // do it this way incase a jquery object is passed in
    this.clickable = clickable;
    this.clickableAttached = false;

    if (this.$video.length === 0) return;

    this.$video.on('play', this.onPlay.bind(this));

    // In case autoplay doesn't work
    setTimeout(() => {
      const p = this.video.play(); // in case autoplay didn't work
      p && p.catch(e => console.log(e)); // eslint-disable-line
    }, 1000);
  }

  onPlay() {
    this.$video.addClass(classes.playing);

    if (this.clickable && this.clickableAttached === false) {
      this.$video
        .css('cursor', 'pointer')
        .attr('title', 'Click to toggle audio')
        .on('click', this.toggleVolume.bind(this));

      this.clickableAttached = true;
    }
  }

  toggleVolume() {
    this.video.muted = !this.video.muted;
  }
}
