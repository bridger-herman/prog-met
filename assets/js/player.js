let FREQS = {"a5":880.000000000000000, "d6":1174.659071669630241, "a6":1760.000000000000000};
let DURATION = 30; // milliseconds
let P = null;

function printProps(obj) {
  for (var p in obj) {
    console.log(p);
  }
}

function updateMeasure(event) {
  var tempo = document.getElementsByName('tempo')[0].value;
  var beats = document.getElementsByName('beats')[0].value;
  var subdiv = document.getElementsByName('subdiv')[0].value;
  var accents = document.getElementsByName('db-accent')[0].checked;
  P.init(tempo, beats, subdiv, accents);
}

function init() {
  var objsToUpdate = document.getElementsByClassName('update-object');
  for (var objIndex = 0; objIndex < objsToUpdate.length; objIndex++) {
    objsToUpdate[objIndex].onchange = updateMeasure;
  }

  var tempo = document.getElementsByName('tempo')[0].value;
  var beats = document.getElementsByName('beats')[0].value;
  var subdiv = document.getElementsByName('subdiv')[0].value;
  var accents = document.getElementsByName('db-accent')[0].checked;
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

function MeasurePlayer(tempo, beats, subdivs, dbAccents) {
  this.init = function(tempo, beats, subdivs, dbAccents) {
    this.beats = beats;
    this.subdivs = subdivs;
    this.dbAccents = dbAccents;
    this.numSubdivs = beats*subdivs;

    this.timePerBeat = 60000/tempo;
    this.timePerMeasure = this.timePerBeat*beats;
    this.timePerSubdiv = this.timePerMeasure/this.numSubdivs;
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
        if (timerIndex === 0 && this.numSubdivs === true) {
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
