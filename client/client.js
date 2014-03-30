Handlebars.registerHelper('listDates', function (obj) {
  arr = [];
  for (var key in obj) {
    arr.push({
      name: key,
      value: obj[key]
    });
  }
  var result = _.sortBy(arr, function (key) {
    return key.name;
  });
  return result;
});

Template.selectEvent.events({
  'keyup #event': function () {
  AutoCompletion.autocomplete({
    element: '#event',
    collection: Predictions,
    field: 'eventName',
    limit: 5,
    sort: { eventName: 1 }});
  },
  'change #event': function () {
    Session.set('selectedEvent', $('#event').val());
  }
});

Template.selectDate.events({
  'change #date': function () {
    var theDate = Date.parse($('#date').val()) / 1000;
    Session.set('selectedDate', theDate);
  },
  'click #submit': function () {
    Meteor.call('submit', Session.get('selectedEvent'), Session.get('selectedDate'), function (err, data) {
      if (err)
        console.log(err);
      if (data) {
        Meteor.call('getResults', Session.get('selectedEvent'), function (err, data) {
          if (err)
            console.log(err);
          Session.set('results', data);
        });
      }
    });
  }
});

Template.results.data = function () {
  return Session.get('results');
};
