define([
    'jquery',
    'handlebars',
    'underscore',
    'js/battle',
    'json/cards',
], function($, Handlebars, _, battle, cards ) {

    var team1 = [cards[0], cards[1], cards[2]];
    var team2 = [cards[1], cards[2], cards[3]];

    battle(team1, team2);


});
