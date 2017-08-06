// Requires measurePlayer.js

function createMeasureLI(measure) {
  return '<li class="measure">' +
      '<input type="checkbox" name="' + measure.id + '">' +
      '<label for="' + measure.id + '">' + measure + '</label></li>';
}

function AdvancedPlayer() {
  this.timer = null;
  this.playing = false;
  this.measureList = [];
  this.currentIndex = 0;
  this.currentMeasurePlayer = null;

  this.updateMeasureDisplay = function() {
    $('#measure-list').empty();
    for (var i = 0; i < this.measureList.length; i++) {
      $('#measure-list').append(createMeasureLI(this.measureList[i]));
    }
    $('.measure').removeClass('active');
    $('.measure:eq(' + this.currentIndex + ')').addClass('active');
    // $('.measure').attr('checked', false); // TODO not sure if this is desired
    // $('.measure input[type="checkbox"]:eq(' + this.currentIndex + ')').attr('checked', true);
  }

  this.updateMediaControls = function() {
    if (this.playing === true) {
      $('#advanced-play-pause').html('pause');
      $('.step').attr('disabled', true);
    }
    else {
      $('#advanced-play-pause').html('play_arrow');
      $('.step').attr('disabled', false);
    }
  }

  this.findMeasureIndex = function(measureID) {
    let index = -1;
    for (var i = 0; i < this.measureList.length; i++) {
      if (this.measureList[i].id === measureID) {
        index = i;
      }
    }
    return index;
  }

  this.addMeasure = function(measureToAdd) {
    let m = jQuery.extend(true, {}, measureToAdd);
    console.log('adding measure ' + measureToAdd);
    m.id = 'measure-' + Date.now();
    this.measureList.push(m);
    this.updateMeasureDisplay();
  }

  this.removeMeasure = function(measureIDToRemove) {
    let index = this.findMeasureIndex(measureIDToRemove);
    if (index > -1) {
      this.measureList.splice(index, 1);
    }
    this.updateMeasureDisplay();
  }

  this.editMeasure = function(measureIDToEdit, newMeasure) {
    let index = this.findMeasureIndex(measureIDToEdit);
    if (index > -1) {
      let m = jQuery.extend(true, {}, newMeasure);
      m.id = 'measure-' + Date.now();
      this.measureList[index] = m;
    }
    this.updateMeasureDisplay();
  }

  this.play = function(self) {
    self.playing = true;
    self.currentMeasurePlayer = self.measureList[self.currentIndex];
    self.currentMeasurePlayer.play(self.currentMeasurePlayer);

    self.updateMeasureDisplay();

    if (self.currentIndex + 1 < self.measureList.length) {
      self.timer = setTimeout(self.play, self.currentMeasurePlayer.totalTime, self);
      self.currentIndex++;
    }
    else {
      self.timer = setTimeout(self.end, self.currentMeasurePlayer.totalTime, self);
    }
  }

  this.pause = function(self) {
    self.currentIndex--;
    self.playing = false;
    if (self.currentMeasurePlayer !== null) {
      self.currentMeasurePlayer.stop(self.currentMeasurePlayer);
    }
    if (self.timer !== null) {
      clearTimeout(self.timer);
    }
    self.updateMediaControls();
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
    this.updateMediaControls();
  }

  this.end = function(self) {
    self.stop();
  }

  this.stop = function() {
    this.pause(this);
    this.currentIndex = 0;
    this.currentMeasurePlayer = null;
    this.timer = null;

    this.updateMeasureDisplay();
    this.updateMediaControls();
  }

  this.nextMeasure = function() {
    if (this.currentIndex + 1 < this.measureList.length) {
      this.currentIndex++;
      this.updateMeasureDisplay();
    }
  }

  this.previousMeasure = function() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateMeasureDisplay();
    }
  }

}
