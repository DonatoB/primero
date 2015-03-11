define([
    'backbone',
    'jquery',
    'handlebars',
    'underscore',
    'js/battle',
    'js/plan',
    'js/card',
    'text!templates/card.html',
    'json/cards'
], function(Backbone, $, Handlebars, _, battle, plan, Card, cardHtml, cards ) {

    var makeCard = Handlebars.compile(cardHtml);
    Handlebars.registerHelper('createCard', function() {
        return makeCard(this);
    });

    function makeTeam(arr) {
        return _.map(arr, _.clone);
    }

    var Workspace = Backbone.Router.extend({
        routes: {
            '' : 'plan',
            plan : 'plan',
            battle : 'battle'
        },

        plan : function() {
            plan(cards);
        },
        battle : function() {
            battle(team1, team2);
        }
    });

    var App = new Workspace;


    cards = _.map(cards, Card);

    var team1 = makeTeam([cards[0], cards[1], cards[2]]);
    var team2 = makeTeam([cards[1], cards[3], cards[2]]);


    window.pr = {};
    window.pr.cards = cards;

    // Enable url routing
    Backbone.history.start();

});
