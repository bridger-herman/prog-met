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
  this.timer = null;
  this.beepDuration = 50; // milliseconds
  this.timePerBeat = (60000)/tempo;

  this.masterGainNode = this.audioContext.createGain();
  this.masterGainNode.connect(this.audioContext.destination);
  this.masterGainNode.gain.value = 0.5;

  this.play = function() {
    playBeat = function(which, self) {
      let beatTimer = null;
      self.currentOsc = self.audioContext.createOscillator();
      self.currentOsc.connect(self.masterGainNode);
      self.currentOsc.frequency.value = FREQS[which];
      self.currentOsc.type = "sine";
      self.currentOsc.start();
      stopBeat = function(osc) {
        osc.stop();
        clearTimeout(beatTimer);
      }
      beat = setTimeout(stopBeat, self.beepDuration, self.currentOsc); // TODO perhaps a better way than this...
    }
    this.timer = setInterval(playBeat, this.timePerBeat, 1, this);
  }

  this.stop = function() {
    clearInterval(this.timer);
    this.timer = null;
  }
}

document.onload = init();
