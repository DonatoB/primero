define([
    'jquery',
    'handlebars',
    'underscore',
    'js/battle',
    'json/cards',
], function($, Handlebars, _, battle, cards ) {

    function makeTeam(arr) {
        return _.map(arr, _.clone);
    }
    var team1 = makeTeam([cards[0], cards[1], cards[2]]);
    var team2 = makeTeam([cards[1], cards[2], cards[3]]);

    battle(team1, team2);

    // regens
    // speed
    // dmg
    // health
});
