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
    Session.set('selected_event', $('#event').val());
  }
});

Template.selectDate.events({
  'change #date': function () {
    var theDate = Date.parse($('#date').val()) / 1000;
    Session.set('selected_date', theDate);
  },
  'click #submit': function () {
    Meteor.call('submit', Session.get('selected_event'), Session.get('selected_date'));
    Meteor.call('results', Session.get('selected_event'), function (err, data) {
      if (err)
        console.log(err);
      Session.set('results', data);
    });
  }
});

Template.results.results = function () {
  return Session.get('results');
};
