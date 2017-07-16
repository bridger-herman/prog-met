let FREQS = {"a5":880.000000000000000, "d6":1174.659071669630241, "a6":1760.000000000000000};
let DURATION = 30; // milliseconds
let BASIC_PLAYER = null;

function printProps(obj) {
  for (var p in obj) {
    console.log(p);
  }
}

function updateMeasure(event) {
  let tempo = document.getElementsByName('tempo')[0].value;
  let beats = document.getElementsByName('beats')[0].value;
  let subdiv = document.getElementsByName('subdiv')[0].value;
  let accents = document.getElementsByName('db-accent')[0].checked;
  BASIC_PLAYER.init(tempo, beats, subdiv, accents);
}

function init() {
  var objsToUpdate = document.getElementsByClassName('update-object');
  for (var objIndex = 0; objIndex < objsToUpdate.length; objIndex++) {
    objsToUpdate[objIndex].onchange = updateMeasure;
  }

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

  var tempo = document.getElementsByName('tempo')[0].value;
  var beats = document.getElementsByName('beats')[0].value;
  var subdiv = document.getElementsByName('subdiv')[0].value;
  var accents = document.getElementsByName('db-accent')[0].checked;
  BASIC_PLAYER = new BasicPlayer(tempo, beats, subdiv, accents);
}

function ToneGenerator(toneIndex) {
  this.audioContext = new (window.AudioContext || window.webkitAudioContext);
  this.toneIndex = toneIndex;
  this.currentOsc = null;
  this.toneTimer = null;

  this.masterGainNode = this.audioContext.createGain();
  this.masterGainNode.connect(this.audioContext.destination);
  this.masterGainNode.gain.value = 0.5;

  // TODO add performance.now() to have higher precision timing
  this.playTone = function(self) {
    // console.log(self.toneIndex + " " + (Date.now()));
    self.currentOsc = self.audioContext.createOscillator();
    self.currentOsc.connect(self.masterGainNode);
    self.currentOsc.frequency.value = FREQS[self.toneIndex];
    self.currentOsc.type = "sine";
    self.currentOsc.start();
    self.toneTimer = setTimeout(self.stopTone, DURATION, self); // TODO perhaps a better way than this...
  }

  this.stopTone = function(self) {
    self.currentOsc.stop();
    clearTimeout(self.toneTimer);
    self.toneTimer = null;
    self.currentOsc = null;
  }
}

function MeasurePlayer(tempo, beats, subdivs, dbAccents) {
  this.init = function(tempo, beats, subdivs, dbAccents) {
    this.beats = beats;
    this.subdivs = subdivs;
    this.dbAccents = dbAccents;
    this.numSubdivs = beats*subdivs;

    this.timePerBeat = 60000/tempo;
    this.totalTime = this.timePerBeat*beats;
    this.timePerSubdiv = this.totalTime/this.numSubdivs;
  }

  this.init(tempo, beats, subdivs, dbAccents);

  this.dbTones = new ToneGenerator("a6");
  this.beatTones = new ToneGenerator("d6");
  this.subdivTones = new ToneGenerator("a5");

  this.timers = [];
  for (var timerIndex = 0; timerIndex < this.numSubdivs; timerIndex++) {
    this.timers[timerIndex] = null;
  }

  // TODO add a toggle feature
  this.play = function(self) {
    for (var timerIndex = 0; timerIndex < self.numSubdivs; timerIndex++) {
      if (timerIndex % self.subdivs === 0) {
        if (timerIndex === 0 && this.dbAccents === true) {
          // console.log("db");
          this.timers[timerIndex] = setTimeout(self.dbTones.playTone, timerIndex*self.timePerSubdiv, self.dbTones);
        }
        else {
          // console.log("beat");
          this.timers[timerIndex] = setTimeout(self.beatTones.playTone, timerIndex*self.timePerSubdiv, self.beatTones);
        }
      }
      else {
        // console.log("sub");
        this.timers[timerIndex] = setTimeout(self.subdivTones.playTone, timerIndex*self.timePerSubdiv, self.subdivTones);
      }
    }
  }

  this.stop = function(self) {
    for (var timerIndex = 0; timerIndex < this.numSubdivs; timerIndex++) {
      clearTimeout(this.timers[timerIndex]);
      this.timers[timerIndex] = null;
    }
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
