define([
    'js/models/session',
    'handlebars',
    'text!templates/page-planning.html',
    'jquery'
], function(Session, Handlebars, planPageHtml, $) {
    var planPage = Handlebars.compile(planPageHtml);
    var TEAM_SIZE = 2;

    // State : allcards, chosencards
    var Store = {
        unchosen: [],
        team1: [],
        team2: []
    };

    function moveCard(from, to, id) {
        var card = _.findWhere(Store[from], {id : id});

        Store[from] = _.without(Store[from], card);
        Store[to].push(card);
    }

    function sendEvent(x, id, row) {
        if (row === 'unchosen') {
            if (Store.team1.length < TEAM_SIZE) {
                moveCard(row, 'team1', id);
            } else if (Store.team2.length < TEAM_SIZE) {
                moveCard(row, 'team2', id);
            } else {
                console.log('error');
                return;
            }
        } else {
            moveCard(row, 'unchosen', id);
        }

        render();
    }

    function render() {
        var $html = $(planPage(Store));
        var loggedIn = Session.get('auth');
        var txt = (loggedIn ? 'You are logged in' : 'Not logged in');

        $html.first().prepend(txt);
        $('#battleground').html($html);
    }

    function genParamString(team) {
        var ids = _.map(team, _.property('id'));
        return ids.join(',');
    }

    function cleanup() {
        $('#battleground').off();
    }

    return function(cards) {
        Store.team1 = [];
        Store.team2 = [];
        Store.unchosen = cards;

        $('#battleground').on('click', '.pr-card', function() {
            var $this = $(this);

            var id = parseInt($this.attr('card_id'));
            var fromRow = $this.closest('.row').attr('row');

            sendEvent('card-clicked', id, fromRow);
        });

        $('#battleground').on('click', '#button-fight', function() {
            cleanup();
            var str = genParamString(Store.team1) + '/' + genParamString(Store.team2);
            window.App.navigate('battle/'+str, {trigger: true});
        });

        render();
    }
});
