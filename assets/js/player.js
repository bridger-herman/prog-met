let FREQS = [880.000000000000000, 1174.659071669630241, 1760.000000000000000];
let P = null;

function printProps(obj) {
  for (var p in obj) {
    console.log(p);
  }
}

function init() {
  tempo = document.getElementById('tempo').value;
  P = new MeasurePlayer(tempo, 4, true);
}

function ToneGenerator() {
  this.audioContext = new (window.AudioContext || window.webkitAudioContext);
  this.currentOsc = null;
  this.toneTimer = null;
  this.toneDuration = 50; // milliseconds

  this.masterGainNode = this.audioContext.createGain();
  this.masterGainNode.connect(this.audioContext.destination);
  this.masterGainNode.gain.value = 0.5;

  this.playTone = function(self) {
    self.currentOsc = self.audioContext.createOscillator();
    self.currentOsc.connect(self.masterGainNode);
    self.currentOsc.frequency.value = FREQS[1];
    self.currentOsc.type = "sine";
    self.currentOsc.start();
    self.toneTimer = setTimeout(self.stopTone, self.toneDuration, self); // TODO perhaps a better way than this...
  }

  this.stopTone = function(self) {
    self.currentOsc.stop();
    clearTimeout(self.toneTimer);
    self.toneTimer = null;
    self.currentOsc = null;
  }
}

function MeasurePlayer(tempo, beats, downbeatAccents) {
  this.timer = null;
  this.endTimer = null;
  this.toneGenerator = new ToneGenerator();
  this.timePerBeat = (60000)/tempo;
  this.totalTime = this.timePerBeat * beats;


  this.play = function() {
    this.timer = setInterval(this.toneGenerator.playTone, this.timePerBeat, this.toneGenerator);
    this.endTimer = setTimeout(this.stop, this.totalTime, this);
  }

  this.stop = function(self) {
    clearInterval(self.timer);
    clearInterval(self.endTimer);
    self.timer = null;
  }
}

document.onload = init();
