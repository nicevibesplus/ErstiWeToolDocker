'use strict';

// called from menu buttons
// shows / hides the correct input fields
function toggleView(mode) {
  if (mode === 'register')
    $('#form-register').removeClass('hidden');
  else if (mode === 'waitlist')
    $('#form-waitlist').removeClass('hidden');
  else if (mode === 'optout')
    $('#form-optout').removeClass('hidden');

  $('#menu').addClass('hidden');
}

$(document).ready(function() {

  // submit forms via ajax
  $('form').submit(function() {
    $.ajax({
      data: $(this).serialize(),
      type: $(this).attr('method'),
      url:  $(this).attr('action'),
      error: function(asdf, status, err) {
        console.error(asdf)
        console.error(status)
        console.error(err)
        $('#info').text(status);
      },
      success: function(res) {
        $('#info').text(res);
        // reset the view
        $('form').addClass('hidden');
        $('#menu').removeClass('hidden');
        $('form').trigger('reset');
      }
    });
    return false;
  });

});
