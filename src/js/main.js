define([
    'jquery',
    'handlebars',
    'underscore',
    'js/battle',
    'js/card',
    'json/cards',
], function($, Handlebars, _, battle, Card, cards ) {

    function makeTeam(arr) {
        return _.map(arr, _.clone);
    }


    cards = _.map(cards, Card);

    var team1 = makeTeam([cards[0], cards[1], cards[2]]);
    var team2 = makeTeam([cards[1], cards[3], cards[2]]);

    battle(team1, team2);

    // regens
    // speed
    // dmg
    // health
});
