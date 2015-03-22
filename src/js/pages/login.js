define([
    'js/models/session',
    'handlebars',
    'text!templates/page-login.html',
    'jquery'
], function(Session, Handlebars, html, $) {

    var template = Handlebars.compile(html);

    return function() {
        var $html = $(template());

        $html.on('click', '.login-button', function() {
            var $form = $(this).parent();

            var user = $form.find('.username').val();
            var pass = $form.find('.password').val();

            var data = {
                username : user,
                password : pass
            };

            Session.login(data);
        });

        $('#battleground').html($html);
    }
});
