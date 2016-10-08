'use strict';

function showAlert(text, type) {
  $('#info').html(text);
  $('html, body').animate({
    scrollTop: $('#info').offset().top - 20
  }, 400);
}

$(document).ready(function() {
  var that = this;

  $.ajax({
      type: 'GET',
      url:  './api/statistics',
      error: function(xhr, status, err) {
        showAlert(xhr.responseText, 'error');
      },
      success: function(res) {
        $('#attendeecount').text(res);
      }
  });


  // submit handler for forms
  $('form').submit(function() {
    var that = this;

    // submit via ajax
    $.ajax({
      data: $(that).serialize(),
      type: $(that).attr('method'),
      url:  $(that).attr('action') + $('[name=amount]').val(),
      error: function(xhr, status, err) {
        showAlert(xhr.responseText, 'error');
      },
      success: function(res) {
        // Show Success
        showAlert(res, 'success');
      }
    });
    return false;
  });
});
