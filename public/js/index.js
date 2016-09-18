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

function showAlert(text, type) {
  // TODO: toggle classes for appropiate styling ('success', 'error')
  $('#info').html(text);
  $('html, body').animate({
    scrollTop: $('#info').offset().top - 20
  }, 400);
}

$(document).ready(function() {
  // submit handler for forms
  $('form').submit(function() {

    // validate email confirmation
    if ($('#email').val() !== $('#email-confirmation').val()) {
      showAlert('email stimmt nicht überein!', 'error');
      return false;
    }

    // submit via ajax
    $.ajax({
      data: $(this).serialize(),
      type: $(this).attr('method'),
      url:  $(this).attr('action'),
      error: function(xhr, status, err) {
        showAlert(xhr.responseText, 'error');
      },
      success: function(res) {
        // reset the view
        $('form').addClass('hidden');
        $('#menu').removeClass('hidden');
        $('form').trigger('reset');
        showAlert(res, 'success');
      }
    });
    return false;
  });

});
