let FREQS = [880.000000000000000, 1174.659071669630241, 1760.000000000000000];
let P = null;

function printProps(obj) {
  for (var p in obj) {
    console.log(p);
  }
}

function init() {
  tempo = document.getElementById('tempo').value;
  P = new Player(tempo, 4);
}

function Player(tempo, beats) {
  this.audioContext = new (window.AudioContext || window.webkitAudioContext);
  this.currentOsc = null;
  this.masterGainNode = null;
  this.beepDuration = 50; // milliseconds
  this.baseTime = null;

  this.masterGainNode = this.audioContext.createGain();
  this.masterGainNode.connect(this.audioContext.destination);
  this.masterGainNode.gain.value = 0.5;

  this.play = function(which) {
    this.currentOsc = this.audioContext.createOscillator();
    this.currentOsc.connect(this.masterGainNode);
    this.currentOsc.frequency.value = FREQS[which];
    this.currentOsc.type = "sine";
    this.currentOsc.start();
    setTimeout(this.stop, this.beepDuration, this.currentOsc); // TODO perhaps a better way than this...
  }

  this.stop = function(osc) {
    osc.stop();
    clearTimeout();
  }
}

document.onload = init();
