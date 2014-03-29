
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
      if (typeof(Session.get('selected_date')) !== 'number' || typeof(Session.get('selected_event')) !== 'string')
        return false;
      var prediction = Predictions.findOne({ eventName: Session.get('selected_event') });
      if (typeof(prediction) === 'undefined') {
        var payload = { eventName: Session.get('selected_event'), dates: {} };
        payload.dates[Session.get('selected_date')] = { score: 1 };
        Predictions.insert(payload);
      } else {
        var payload = prediction;
        if (Session.get('selected_date') in prediction.dates) {
          payload.dates[Session.get('selected_date')].score++;
        } else {
          payload.dates[Session.get('selected_date')] = { score: 1 };
        }
        Predictions.update({ _id: prediction._id }, payload);
      }
      var prediction = Predictions.findOne({
        eventName: Session.get('selected_event')
      });
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
}
