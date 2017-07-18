// Requires measurePlayer.js

function createMeasureLI(measure) {
  return '<li class="measure">' + measure + '</li>';
}

function AdvancedPlayer() {
  this.timer = null;
  this.playing = false;
  this.measureList = [];
  this.currentIndex = 0;
  this.currentMeasurePlayer = null;

  this.addMeasure = function(measureToAdd) {
    let m = jQuery.extend(true, {}, measureToAdd);
    this.measureList.push(m);
    $('#measure-list').append(createMeasureLI(m));
    if (this.measureList.length === 1) {
      $('.measure').addClass('active');
    }
  }

  this.play = function(self) {
    this.playing = true;
    self.currentMeasurePlayer = self.measureList[self.currentIndex];
    self.currentMeasurePlayer.play(self.currentMeasurePlayer);

    $('.measure').removeClass('active');
    $('.measure:eq(' + self.currentIndex + ')').addClass('active');
    $('#advanced-play-pause').html('pause');

    if (self.currentIndex + 1 < self.measureList.length) {
      self.timer = setTimeout(self.play, self.currentMeasurePlayer.totalTime, self);
      self.currentIndex++;
    }
    else {
      self.timer = setTimeout(self.pause, self.currentMeasurePlayer.totalTime, self);
    }
  }

  this.pause = function(self) {
    $('#advanced-play-pause').html('play_arrow');

    self.currentIndex--;
    this.playing = false;
    if (self.currentMeasurePlayer !== null) {
      self.currentMeasurePlayer.stop(self.currentMeasurePlayer);
    }
    if (self.timer !== null) {
      clearTimeout(self.timer);
    }
  }

  this.togglePlay = function() {
    if (this.currentIndex < this.measureList.length) {
      this.playing = !this.playing;
      if (this.playing === true) {
        this.play(this);
      }
      else {
        this.pause(this);
      }
    }
  }

  this.stop = function() {
    this.pause(this);
    this.currentIndex = 0;
    this.currentMeasurePlayer = null;
    this.timer = null;

    $('.measure').removeClass('active');
    let x = $($('.measure')[0]).addClass('active');
  }
}
