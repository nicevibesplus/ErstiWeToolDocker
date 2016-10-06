'use strict';


function showAlert(text, type) {
  // TODO: toggle classes for appropiate styling ('success', 'error')
  $('#info').html(text);
  $('html, body').animate({
    scrollTop: $('#info').offset().top - 20
  }, 400);
}

function download_users(){
  $.ajax({
      type: 'GET',
      url:  '/api/users/2016',
      error: function(xhr, status, err) {
        showAlert(xhr.responseText, 'error');
      },
      success: function(res) {
        // Show Success
        showAlert(res, 'success');
      }
    });
}

function download_waitlist(){
  $.ajax({
      type: 'GET',
      url:  '/api/waitlist/',
      error: function(xhr, status, err) {
        showAlert(xhr.responseText, 'error');
      },
      success: function(res) {
        // Show Success
        showAlert(res, 'success');
      }
    });
}
function download_successors(){
  $.ajax({
      type: 'GET',
      url:  '/api/successor/',
      error: function(xhr, status, err) {
        showAlert(xhr.responseText, 'error');
      },
      success: function(res) {
        // Show Success
        showAlert(res, 'success');
      }
    });
}

$(document).ready(function() {
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