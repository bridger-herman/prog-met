// Requires basicPlayer.js
// Requires measurePlayer.js
// Requires advancedPlayer.js

let BASIC_PLAYER = null;
let ADVANCED_PLAYER = null;
let CURRENT_MEASURE = null;

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
  CURRENT_MEASURE = new MeasurePlayer();
  updateMeasure();
  BASIC_PLAYER = new BasicPlayer(CURRENT_MEASURE);
  ADVANCED_PLAYER = new AdvancedPlayer();

  // Add measure callback
  $('#add-measure').on('click', addCurrentMeasure);
}

function updateMeasure(event) {
  var tempo = $('#tempo').val();
  var beats = $('#beats').val();
  var subdiv = $('#subdiv').val();
  var accents = $('#db-accent').prop('checked');
  CURRENT_MEASURE.init(tempo, beats, subdiv, accents);
}

function addCurrentMeasure(event) {
  ADVANCED_PLAYER.addMeasure(CURRENT_MEASURE);
}

function printProps(obj) {
  for (var p in obj) {
    console.log(p);
  }
}

document.onload = init();
