'use strict';

/* global $ Chart */

const BASE_URL = '.'

$(document).ready(function() {
    // get year from url query to apply to all backend requests
    const urlQuery = window.location.search
        .slice(1) // remove leading '?'
        .split('&') // split params
        .reduce((result, kv) => { // make an object of key value pairs
            const [key, value] = kv.split('=');
            return Object.assign(result, {
                [key]: value
            });
        }, {});

    const yearParam = urlQuery.year ? `?year=${urlQuery.year}` : '';

    // get stats
    $.get(`./api/statistics${yearParam}`, function(stats, status) {
        if (status !== 'success') return console.error(stats, 'error');
        for (let measure in stats)
            $('#count-' + measure).html(stats[measure]);
    });

    // fill user table
    $.get(`./api/users${yearParam}`, function(users, status) {
        if (status !== 'success') return console.error(users, 'error');
        // convert user objects to arrays for further use with DataTables
        users.forEach(function(user, i, arr) {
            users[i] = $.map(user, function(e) { return e || ''; });
        });

        $('#user-table').dataTable({
            data: users,
        });
    });

    // fill waitlist table
    $.get(`./api/waitlist${yearParam}`, function(users, status) {
        if (status !== 'success') return console.error(users, 'error');
        // convert user objects to arrays for further use with DataTables
        users.forEach(function(user, i, arr) {
            users[i] = $.map(user, function(e) { return e || ''; });
        });

        $('#waitlist-table').dataTable({
            data: users,
        });
    });
});