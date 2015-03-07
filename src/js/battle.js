define([
    'handlebars',
    'text!templates/card.html',
    'text!templates/battle-page.html',
    'jquery'

], function(Handlebars, cardHtml, battlePageHtml, $) {

    var makeCard = Handlebars.compile(cardHtml);
    var makePage = Handlebars.compile(battlePageHtml);

    Handlebars.registerHelper('createCard', function(team, idx) {
        return makeCard(team[idx]);
    });



    return function(team1, team2) {
        var battleObject = {
            team1 : team1,
            team2 : team2
        };

        console.log(battleObject);
        var html = makePage(battleObject);
        $('body').append(html);
    }
});
