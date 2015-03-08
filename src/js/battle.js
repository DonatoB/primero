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


    function dealDamage(from, to) {
        console.log(from.name + ' deals ' + from.damage + ' to ' +to.name);
        to.health -= from.damage;
    }

    function round(cardLeft, cardRight) {
        console.log('Round begins ', cardLeft.name, ' versus ', cardRight.name);
        // cards are instances
        if (cardLeft.speed >= cardRight.speed) {
            dealDamage(cardLeft, cardRight);
        } else {
            dealDamage(cardRight, cardLeft);
        }

        if (cardLeft.health <= 0 || cardRight.health <= 0) {
            return;
        }

        if (cardLeft.speed >= cardRight.speed) {
            dealDamage(cardRight, cardLeft);
        } else {
            dealDamage(cardLeft, cardRight);
        }
    }

    function battle(team1, team2) {
        // Since we modify the array to show alive members
        team1 = _.clone(team1);
        team2 = _.clone(team2);

        while (team1.length > 0 && team2.length > 0) {
            var left = team1.shift();
            var right = team2.shift();

            round(left, right);

            if (left.health > 0) {
                team1.push(left);
            }
            if (right.health > 0) {
                team2.push(right);
            }
        }
    }

    return function(team1, team2) {
        var battleObject = {
            team1 : team1,
            team2 : team2
        };

        battle(team1, team2);

        var html = makePage(battleObject);
        $('#battleground').append(html);
    }
});
