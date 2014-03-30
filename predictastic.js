
Predictions = new Meteor.Collection('predictions');

if (Meteor.isClient) {

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
    }
  });

  Template.results.results = function () {
    return Predictions.find({ eventName: Session.get('selected_event') });
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //
  });

  Meteor.methods({
    submit: function (theEvent, theDate) {
      check(theEvent, String);
      check(theDate, Number);
      dateCheck = Match.Where(function (a) {
        var now = new Date().setHours(0, 0, 0, 0) / 1000;
        return a >= now;
      });
      check(theDate, dateCheck);
      var prediction = Predictions.findOne({ eventName: theEvent });
      if (typeof(prediction) === 'undefined') {
        var payload = { eventName: theEvent, dates: {} };
        payload.dates[theDate] = { score: 1 };
        Predictions.insert(payload);
      } else {
        var payload = prediction;
        if (theDate in prediction.dates) {
          payload.dates[theDate].score++;
        } else {
          payload.dates[theDate] = { score: 1 };
        }
        Predictions.update({ _id: prediction._id }, payload);
      }
      return true;
    }
  });

}
