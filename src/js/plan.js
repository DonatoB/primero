define([
    'handlebars',
    'text!templates/card.html',
    'text!templates/plan-page.html',
    'jquery'
], function(Handlebars, cardHtml, planPageHtml, $) {
    var  planPage = Handlebars.compile(planPageHtml);
    var TEAM_SIZE = 2;

    var Store = {
        unchosen: [],
        team1: [],
        team2: []
    }

    function moveCard(from, to, id) {
        var card = _.findWhere(Store[from], {id : id});

        Store[from] = _.without(Store[from], card);
        Store[to].push(card);
    }

    // State : allcards, chosencards
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
        $('#battleground').html($html);
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

        render();
    }
});
