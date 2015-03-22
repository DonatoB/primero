define([
    'handlebars',
    'text!templates/card.html'
], function(Handlebars, cardHtml) {
    var makeCard = Handlebars.compile(cardHtml);
    Handlebars.registerHelper('createCard', function() {
        return makeCard(this);
    });
});
