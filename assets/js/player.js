let FREQS = [880.000000000000000, 1174.659071669630241, 1760.000000000000000];
let DURATION = 30; // milliseconds
let P = null;

function printProps(obj) {
  for (var p in obj) {
    console.log(p);
  }
}

function init() {
  var tempo = document.getElementById('tempo').value;
  var beats = document.getElementById('beats').value;
  var subdiv = document.getElementById('subdiv').value;
  var accents = document.getElementById('db-accent').checked;
  P = new MeasurePlayer(tempo, beats, subdiv, accents);
  // T = new ToneGenerator(1);
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

function MeasurePlayer(tempo, beats, subdivs, downbeatAccents) {
  this.beats = beats;
  this.subdivs = subdivs;
  this.numSubdivs = beats*subdivs;

  this.timePerBeat = 60000/tempo;
  this.timePerMeasure = this.timePerBeat*beats;
  this.timePerSubdiv = this.timePerMeasure/this.numSubdivs;

  this.dbTones = new ToneGenerator(2);
  this.beatTones = new ToneGenerator(1);
  this.subdivTones = new ToneGenerator(0);

  this.timers = [];
  for (var timerIndex = 0; timerIndex < this.numSubdivs; timerIndex++) {
    this.timers[timerIndex] = null;
  }

  // TODO add a toggle feature
  this.play = function(self) {
    for (var timerIndex = 0; timerIndex < self.numSubdivs; timerIndex++) {
      if (timerIndex % self.subdivs === 0) {
        if (timerIndex === 0) {
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

document.onload = init();
