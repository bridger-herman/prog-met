// Requires basicPlayer.js
// Requires measurePlayer.js
// Requires advancedPlayer.js

let BASIC_PLAYER = null;
let ADVANCED_PLAYER = null;
let USER_MEASURE = null;

function init() {
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

  // Add measure callback
  $('#add-measure').on('click', function() {ADVANCED_PLAYER.addMeasure(USER_MEASURE);});

  // Media controls
  $('#basic-play-pause').on('click', function() {BASIC_PLAYER.togglePlay();});
  $('#advanced-play-pause').on('click', function() {ADVANCED_PLAYER.togglePlay();});
  $('#advanced-stop').on('click', function() {ADVANCED_PLAYER.stop();});
  $('#advanced-step-forward').on('click', function() {ADVANCED_PLAYER.nextMeasure();});
  $('#advanced-step-back').on('click', function() {ADVANCED_PLAYER.previousMeasure();});

  // Edit/delete controls
  $('#delete-measure').on('click', deleteSelectedMeasures);
  $('#edit-measure').on('click', editSelectedMeasures);

  $(window).on('hashchange', function() {
    $('nav ul li a').removeClass('active');
    $('nav ul li a[href="' + window.location.hash + '"]').addClass('active');
    insertMeasureControls(window.location.hash);
  });

  // Default to basic mode
  if (window.location.hash !== '#basic-mode') {
    window.location.hash = '#basic-mode';
  }

  // Get the initial values
  USER_MEASURE = new MeasurePlayer();
  updateUserMeasure();
  BASIC_PLAYER = new BasicPlayer(USER_MEASURE);
  ADVANCED_PLAYER = new AdvancedPlayer();

  // Insert the HTML for measure controls (in the right place)
  insertMeasureControls(window.location.hash);
}

function insertMeasureControls(context) {
  html = '<form>' +
    '<label for="tempo">Tempo</label>' +
    '<input required minlength="1" class="user-measure" type="number" name="tempo" id="tempo" value="120" min="1" max="300">' +

    '<label for="beats">Beats per measure</label>' +
    '<input required minlength="1" class="user-measure" type="number" name="beats" id="beats" value="4" min="1" max="20">' +

    '<label for="subdiv">Clicks per beat</label>' +
    '<input required minlength="1" class="user-measure" type="number" name="subdiv" id="subdiv" value="1" min="1" max="10">' +

    '<label for="db-accent">Accent downbeats</label>' +
    '<input required minlength="1" class="user-measure" type="checkbox" name="db-accent" id="db-accent" checked>' +
  '</form>';
  $('.measure-controls').empty();
  $(context + ' .measure-controls').html(html);

  // Update input callbacks
  var measureInputs = $('.user-measure');
  measureInputs.each(function (index) {
    $(measureInputs[index]).on('change', updateUserMeasure);
  })
  updateUserMeasure();
}

function deleteSelectedMeasures() {
  let selectedMeasures = $('ul .measure input[type="checkbox"]:checked');
  for (var i = 0; i < selectedMeasures.length; i++) {
    ADVANCED_PLAYER.removeMeasure(selectedMeasures[i].name);
  }
}

function editSelectedMeasures() {
  let selectedMeasures = $('ul .measure input[type="checkbox"]:checked');
  for (var i = 0; i < selectedMeasures.length; i++) {
    ADVANCED_PLAYER.editMeasure(selectedMeasures[i].name, USER_MEASURE);
  }
}

function updateUserMeasure(event) {
  console.log('updating measure!!');
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
