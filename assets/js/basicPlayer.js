// Requires measurePlayer.js

function BasicPlayer(measurePlayer) {
  this.measurePlayer = measurePlayer;
  this.timer = null;
  this.playing = false;

  this.play = function(self) {
    self.measurePlayer.play(self.measurePlayer);
    self.timer = setTimeout(self.play, self.measurePlayer.totalTime, self);
  }

  this.stop = function(self) {
    self.measurePlayer.stop(self.measurePlayer);
    clearTimeout(self.timer);
  }

  this.togglePlay = function() {
    var objsToUpdate = $('.update-object');
    this.playing = !this.playing;
    if (this.playing === true) {
      this.play(this);
      $('#basic-play-stop').html('pause');
    }
    else {
      this.stop(this);
      $('#basic-play-stop').html('play_arrow');
    }
    for (var objIndex = 0; objIndex < objsToUpdate.length; objIndex++) {
      objsToUpdate[objIndex].disabled = this.playing;
    }
  }
}
