define([
    'backbone',
    'jquery',
    'underscore',
    'js/battle',
    'js/plan',
    'js/card',
    'json/cards',
    'js/handlebars.helpers',
], function(Backbone, $, _, battle, plan, Card, cards) {

    function makeTeam(str) {
        return _.map(str.split(','), function(val) {
            var idx = parseInt(val) || 0;
            // the cards object is shared
            return _.clone(App.cards[idx]);
        });
    }

    var Workspace = Backbone.Router.extend({
        routes: {
            '' : 'plan',
            'plan' : 'plan',
            'battle/*team1/*team2' : 'battle'
        },

        plan : function() {
            plan(App.cards);
        },

        battle : function(t1, t2) {
            // teams come in as a comma delimited string of ints
            var team1 = makeTeam(t1);
            var team2 = makeTeam(t2);

            battle(team1, team2);
        }
    });


    // Instantiate App, creating routes
    window.App = new Workspace;

    // Convert json into Card objects
    App.cards = _.map(cards, Card);

    // Enable url routing
    Backbone.history.start();
});
