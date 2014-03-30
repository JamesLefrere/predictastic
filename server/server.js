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
  },
  results: function (theEvent) {
    check(theEvent, String);
    return Predictions.find({ eventName: theEvent });
  }
});
