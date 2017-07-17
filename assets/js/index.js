// Depends on measurePlayer.js

let BASIC_PLAYER = null;
let ACTIVE_MEASURE = null;

function init() {
  // Input callbacks
  var objsToUpdate = $('.update-object');
  for (var objIndex = 0; objIndex < objsToUpdate.length; objIndex++) {
    objsToUpdate[objIndex].onchange = updateMeasure;
  }

  // Input validation
  let inputs = $('input[type=number]');
  inputs.each(function (i) {
    $(inputs[i]).on('change', function (e) {
      let val = e.target.value;
      let min = parseInt(e.target.min);
      let max = parseInt(e.target.max);
      if (val == '') {
        e.target.value = 1;
      }
      else if (val < min) {
        e.target.value = min;
      }
      else if (val > max) {
        e.target.value = max;
      }
    })
  })

  // Get the initial values
  ACTIVE_MEASURE = new MeasurePlayer();
  updateMeasure();
  BASIC_PLAYER = new BasicPlayer(ACTIVE_MEASURE);
}

function updateMeasure(event) {
  var tempo = $('#tempo').val();
  var beats = $('#beats').val();
  var subdiv = $('#subdiv').val();
  var accents = $('#db-accent').prop('checked');
  ACTIVE_MEASURE.init(tempo, beats, subdiv, accents);
}

function printProps(obj) {
  for (var p in obj) {
    console.log(p);
  }
}

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
      $('#play-stop').html('pause');
    }
    else {
      this.stop(this);
      $('#play-stop').html('play_arrow');
    }
    for (var objIndex = 0; objIndex < objsToUpdate.length; objIndex++) {
      objsToUpdate[objIndex].disabled = this.playing;
    }
  }
}

document.onload = init();
