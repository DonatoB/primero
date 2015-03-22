define([
    'handlebars',
    'text!templates/page-battle.html',
    'jquery'
], function(Handlebars, battlePageHtml, $) {

    var TURN_DELAY = 1200;
    var timeout;

    var makePage = Handlebars.compile(battlePageHtml);

    function dealDamage(from, to, logs) {
        logs.push(from.name + ' deals ' + from.damage + 'damage to ' +to.name);
        to.health -= from.damage;
        $('#pr-card-' + to.id).css('color', 'red');
        $('#pr-card-' + from.id).css('color', 'blue');
    }

    function round(cardLeft, cardRight, logs) {
        logs.push('Round begins '+ cardLeft.name+ ' versus '+ cardRight.name);

        if (cardLeft.speed >= cardRight.speed) {
            dealDamage(cardLeft, cardRight, logs);
        } else {
            dealDamage(cardRight, cardLeft, logs);
        }

        if (cardLeft.health <= 0 || cardRight.health <= 0) {
            return;
        }

        if (cardLeft.speed >= cardRight.speed) {
            dealDamage(cardRight, cardLeft, logs);
        } else {
            dealDamage(cardLeft, cardRight, logs);
        }
    }

    function battle(team1, team2, logs) {

        logs = logs || [];

        var left = team1.shift();
        var right = team2.shift();

        round(left, right, logs);

        if (left.health > 0) {
            team1.push(left);
        }
        if (right.health > 0) {
            team2.push(right);
        }


        if (team1.length > 0 && team2.length > 0) {
            timeout = _.delay(_.partial(battle, team1, team2, logs), TURN_DELAY);
        }

        renderPage(team1, team2, logs);
    }

    function renderPage(team1, team2, logs) {

        var battleObject = {
            team1 : team1,
            team2 : team2,
            logs : logs
        };

        var html = makePage(battleObject);
        $('#battleground').html(html);
    }

    function cleanup() {
        clearTimeout(timeout);

    }

    return function(team1, team2) {
        App.on('route', function(route) {
            if (route !== 'battle') {
                cleanup();
            }
        });

        // Since we modify the array to show alive members
        team1 = _.clone(team1);
        team2 = _.clone(team2);

        renderPage(team1, team2);

        _.delay(_.partial(battle, team1, team2), TURN_DELAY);
    }

});
