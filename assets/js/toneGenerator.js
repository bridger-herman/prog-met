let FREQS = {"a5":880.000000000000000, "d6":1174.659071669630241, "a6":1760.000000000000000};

function ToneGenerator(toneIndex) {
  this.audioContext = new (window.AudioContext || window.webkitAudioContext);
  this.toneIndex = toneIndex;
  this.currentOsc = null;
  this.toneTimer = null;
  this.duration = 30; // milliseconds

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
    self.toneTimer = setTimeout(self.stopTone, self.duration, self); // TODO perhaps a better way than this...
  }

  this.stopTone = function(self) {
    self.currentOsc.stop();
    clearTimeout(self.toneTimer);
    self.toneTimer = null;
    self.currentOsc = null;
  }
}
