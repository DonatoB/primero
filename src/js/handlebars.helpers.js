define([
    'handlebars',
    'text!templates/card.html',
    'text!templates/navbar.html'
], function(Handlebars, cardHtml, text_navbar) {
    var makeCard = Handlebars.compile(cardHtml);
    Handlebars.registerHelper('createCard', function() {
        return makeCard(this);
    });

    Handlebars.registerPartial('navbar', text_navbar);
});
