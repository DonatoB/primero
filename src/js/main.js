define([
    'js/models/session',
    'backbone',
    'jquery',
    'underscore',
    'js/pages/battle',
    'js/pages/login',
    'js/pages/plan',
    'js/card',
    'js/handlebars.helpers',
], function(Session, Backbone, $, _, battle, login, plan, Card) {

    // Pass to remote server
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        // Your server goes below
        options.url = 'http://localhost:3000' + options.url;
        //options.url = 'http://cross-domain.nodejitsu.com' + options.url;
    });


    function makeTeam(str, cards) {
        return _.map(str.split(','), function(val) {
            var idx = parseInt(val) || 0;
            // the cards object is shared
            return _.clone(cards[idx]);
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
            var cards = _.clone(Session.get('cards'));
            plan(cards);
        },

        login : function() {
            login();
        },

        battle : function(t1, t2) {
            // teams come in as a comma delimited string of ints
            var cards = _.clone(Session.get('cards'));
            var team1 = makeTeam(t1, cards);
            var team2 = makeTeam(t2, cards);

            battle(team1, team2);
        }
    });


    // Instantiate App, creating routes
    window.App = new Workspace;
    window.App.session = Session;

    // Convert json into Card objects
    //App.cards = _.map(cards, Card);


    // Set off routing (this will be run after authenticating user)
    Session.getAuth(function() {

        // Any further changes would be a log out
        Session.on('change:auth', function() {
            window.App.navigate('', {trigger: true, replace:false});
        });

        if (!Session.get('auth')) {
            window.App.navigate('', {trigger: true, replace:false});
        }

        Backbone.history.start({
            root: '/~donatoborrello/donatob/primero/src/'
        });
    }, function(e) {
        console.log(e);
        $('body').html('Connection to the server failed');
    });
});
