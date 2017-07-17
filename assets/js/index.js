// Requires basicPlayer.js
// Requires measurePlayer.js
// Requires advancedPlayer.js

let BASIC_PLAYER = null;
let ADVANCED_PLAYER = null;
let USER_MEASURE = null;

function init() {
  // Input callbacks
  var objsToUpdate = $('.update-object');
  objsToUpdate.each(function (objIndex) {
    $(objsToUpdate[objIndex]).on('change', updateUserMeasure);
  })


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
  USER_MEASURE = new MeasurePlayer();
  updateUserMeasure();
  BASIC_PLAYER = new BasicPlayer(USER_MEASURE);
  ADVANCED_PLAYER = new AdvancedPlayer();

  // Add measure callback
  $('#add-measure').on('click', function() {ADVANCED_PLAYER.addMeasure(USER_MEASURE)});

  // Play button callbacks
  $('#basic-play-stop').on('click', function() {BASIC_PLAYER.togglePlay()});
  $('#advanced-play-stop').on('click', function() {ADVANCED_PLAYER.togglePlay()});
}

function updateUserMeasure(event) {
  var tempo = $('#tempo').val();
  var beats = $('#beats').val();
  var subdiv = $('#subdiv').val();
  var accents = $('#db-accent').prop('checked');
  USER_MEASURE.init(tempo, beats, subdiv, accents);
}

function printProps(obj) {
  for (var p in obj) {
    console.log(p);
  }
}

document.onload = init();
