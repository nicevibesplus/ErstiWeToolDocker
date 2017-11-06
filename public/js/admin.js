'use strict';

$(document).ready(function() {
  // token generation form submit handler
  $('#gen-tokens').submit(function() {
    $.ajax({
      data: $(this).serialize(),
      type: $(this).attr('method'),
      url:  $(this).attr('action') + $('[name=amount]', this).val(),
      error: function(xhr, status, err) {
        $('#new-tokens').removeClass('hidden').text(xhr.responseText);
      },
      success: function(res) {
        $('#new-tokens')
          .attr('rows', res.length)
          .removeClass('hidden')
          .text(res.join('\n'));
      }
    });
    return false;
  });

  // get stats
  $.get('./api/statistics', function(stats, status) {
    for (let measure in stats)
      $('#count-' + measure).html(stats[measure]);
  });
  
  // get participants' stats
  var colors = {
    gender: ['skyblue', 'pink', 'lightgrey'],
    study:  ['orange', 'mediumseagreen', 'cornflowerblue', 'gold'],
    food:   ['lightsalmon', 'yellowgreen', 'olive']
  };
  ['gender', 'study', 'food'].forEach(function(aspect) {
    $.get('./api/statistics/'+aspect, function(stats, status) {
      var canvas = document.getElementById("chart-"+aspect);
      var options = {
        type: 'pie',
        data: {
          labels: Object.keys(stats),
          datasets: [{
            data: Object.values(stats),
            backgroundColor: colors[aspect],
            borderWidth: 1
          }]
        },
        options: {
          responsive: false,
          maintainAspectRation: false
        }
      };
      new Chart(canvas, options);
    });
  });

  // fill user table
  $.get('./api/users', function(users, status) {
    if (status !== 'success') return showAlert(users, 'error');
    // convert user objects to arrays for further use with DataTables
    users.forEach(function(user, i, arr) {
      users[i] = $.map(user, function(e) { return e || ''; });
    });

    $('#user-table').dataTable({
      data: users,
    });
  });

  // fill waitlist table
  $.get('./api/waitlist', function(users, status) {
    if (status !== 'success') return showAlert(users, 'error');
    // convert user objects to arrays for further use with DataTables
    users.forEach(function(user, i, arr) {
      users[i] = $.map(user, function(e) { return e || ''; });
    });

    $('#waitlist-table').dataTable({
      data: users,
    });
  });
});
