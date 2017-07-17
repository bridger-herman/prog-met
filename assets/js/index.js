// Depends on measurePlayer.js

let BASIC_PLAYER = null;

function init() {
  // Input callbacks
  var objsToUpdate = document.getElementsByClassName('update-object');
  for (var objIndex = 0; objIndex < objsToUpdate.length; objIndex++) {
    objsToUpdate[objIndex].onchange = updateMeasure;
  }

  // Input validation
  let numInputs = document.querySelectorAll('input[type=number]')
  numInputs.forEach(function (input) {
    input.addEventListener('change', function (e) {
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
  var tempo = document.getElementsByName('tempo')[0].value;
  var beats = document.getElementsByName('beats')[0].value;
  var subdiv = document.getElementsByName('subdiv')[0].value;
  var accents = document.getElementsByName('db-accent')[0].checked;
  BASIC_PLAYER = new BasicPlayer(tempo, beats, subdiv, accents);
}

function updateMeasure(event) {
  let tempo = document.getElementsByName('tempo')[0].value;
  let beats = document.getElementsByName('beats')[0].value;
  let subdiv = document.getElementsByName('subdiv')[0].value;
  let accents = document.getElementsByName('db-accent')[0].checked;
  BASIC_PLAYER.init(tempo, beats, subdiv, accents);
}

function printProps(obj) {
  for (var p in obj) {
    console.log(p);
  }
}

function BasicPlayer(tempo, beats, subdivs, dbAccents) {
  this.measurePlayer = new MeasurePlayer(tempo, beats, subdivs, dbAccents);
  this.timer = null;
  this.playing = false;

  this.init = function(tempo, beats, subdivs, dbAccents) {
    this.measurePlayer.init(tempo, beats, subdivs, dbAccents);
  }

  this.play = function(self) {
    self.measurePlayer.play(self.measurePlayer);
    self.timer = setTimeout(self.play, self.measurePlayer.totalTime, self);
  }

  this.stop = function(self) {
    self.measurePlayer.stop(self.measurePlayer);
    clearTimeout(self.timer);
  }

  this.togglePlay = function() {
    var objsToUpdate = document.getElementsByClassName('update-object');
    this.playing = !this.playing;
    if (this.playing === true) {
      this.play(this);
      document.getElementsByName('play-stop')[0].innerHTML = 'pause';
    }
    else {
      this.stop(this);
      document.getElementsByName('play-stop')[0].innerHTML = 'play_arrow';
    }
    for (var objIndex = 0; objIndex < objsToUpdate.length; objIndex++) {
      objsToUpdate[objIndex].disabled = this.playing;
    }
  }
}

document.onload = init();
