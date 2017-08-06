// Requires toneGenerator.js

function MeasurePlayer(tempo, beats, subdivs, dbAccents) {
  this.init = function(tempo, beats, subdivs, dbAccents) {
    this.tempo = tempo;
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

  this.toString = function() {
    return 'Measure(' + this.tempo + 'bpm, ' + this.beats + ', ' + this.subdivs + '): ' + this.id
  }
}
