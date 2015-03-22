define([
    'js/models/session'
    'underscore',
], function(Session, _) {

    var UserSession = Session.extend({

        initialize: function () {

        }
    });

    return new UserSession();

});
