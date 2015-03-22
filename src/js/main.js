define([
    'js/models/session',
    'backbone',
    'jquery',
    'underscore',
    'js/pages/battle',
    'js/pages/login',
    'js/pages/plan',
    'js/card',
    'json/cards',
    'js/handlebars.helpers',
], function(Session, Backbone, $, _, battle, login, plan, Card, cards) {

    window.sess = Session;
    // Pass to remote server
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        // Your server goes below
        options.url = 'http://localhost:3000' + options.url;
        //options.url = 'http://cross-domain.nodejitsu.com' + options.url;
    });


    function makeTeam(str) {
        return _.map(str.split(','), function(val) {
            var idx = parseInt(val) || 0;
            // the cards object is shared
            return _.clone(App.cards[idx]);
        });
    }

    var Workspace = Backbone.Router.extend({
        routes: {
            '' : 'index',
            'plan' : 'plan',
            'login' : 'login',
            'battle/*team1/*team2' : 'battle'
        },

        index : function() {
            var auth = Session.get('auth');
            if (auth) {
                this.navigate('plan', {trigger: true, replace : false});
            } else {
                this.navigate('login', {trigger: true, replace : false});
            }
        },

        plan : function() {
            var cards = _.clone(App.cards);
            plan(cards);
        },

        login : function() {
            login();
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

    // Set off routing (this will be run after authenticating user)
    Session.getAuth(function() {
        Backbone.history.start();
    }, function(e) {
        console.log(e);
        $('body').html('Connection to the server failed');
    });
});
