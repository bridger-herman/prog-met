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
  }

  this.play = function(self) {
    self.currentMeasurePlayer = self.measureList[self.currentIndex];
    self.currentMeasurePlayer.play(self.currentMeasurePlayer);

    $('.measure').removeClass('active');
    $('.measure:eq(' + self.currentIndex + ')').addClass('active');

    $('#advanced-play-stop').html('pause');
    if (self.currentIndex + 1 < self.measureList.length) {
      self.timer = setTimeout(self.play, self.currentMeasurePlayer.totalTime, self);
      self.currentIndex++;
    }
    else {
      self.timer = setTimeout(self.stop, self.currentMeasurePlayer.totalTime, self);
      self.currentIndex = 0;
    }
  }

  this.stop = function(self) {
    $('.measure').removeClass('active');
    $('#advanced-play-stop').html('play_arrow');
    this.playing = false;
    if (self.currentMeasurePlayer !== null) {
      self.currentMeasurePlayer.stop(self.currentMeasurePlayer);
    }
    if (self.timer !== null) {
      clearTimeout(self.timer);
    }
  }

  this.togglePlay = function() {
    // var objsToUpdate = $('.update-object');
    if (this.currentIndex < this.measureList.length) {
      this.playing = !this.playing;
      if (this.playing === true) {
        this.play(this);
      }
      else {
        this.stop(this);
      }
    }
    // for (var objIndex = 0; objIndex < objsToUpdate.length; objIndex++) {
    //   objsToUpdate[objIndex].disabled = this.playing;
    // }
  }
}
